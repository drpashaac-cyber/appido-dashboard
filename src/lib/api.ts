// APPIDO tenant-dashboard → backend HTTP client.
// Cookie-session auth (`appido_session`, httpOnly, set by the API on login) + double-submit CSRF
// (`appido_csrf` cookie is readable and echoed as the `X-CSRF-Token` header on mutations).
// Base URL comes from window.APPIDO_API_BASE (see /public/config.js); empty = demo mode (no calls).
// Every path below maps to a REAL core-api route — nothing speculative.

export class ApiError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
    this.name = "ApiError";
  }
}

function base(): string {
  const b = (typeof window !== "undefined" && ((window as Record<string, unknown>).APPIDO_API_BASE as string)) || "";
  return b.replace(/\/$/, "");
}

/** True when a backend origin is configured; UI can fall back to demo data when false. */
export function apiEnabled(): boolean {
  return base().length > 0;
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function req<T = unknown>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") {
    const token = readCookie("appido_csrf");
    if (token) headers["X-CSRF-Token"] = token;
  }
  let res: Response;
  try {
    res = await fetch(base() + path, {
      method,
      credentials: "include",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "network_error", "Cannot reach the API.");
  }
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const code = (data && typeof data === "object" && "message" in data ? String((data as Record<string, unknown>).message) : "") || `http_${res.status}`;
    throw new ApiError(res.status, code);
  }
  return data as T;
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}

function qs(params: Record<string, string | number | undefined>): string {
  const parts = Object.entries(params).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

// ── Shared response shapes (kept light; the backend pins the full shape) ─────────────
export interface ConsentRow { purpose: string; granted: boolean; source: string | null; at: string | null }
export interface ScriptItem { id: string; key: string; category: string; questionFa: string; questionEn: string; sortOrder: number; enabled: boolean }
export interface GovernancePolicy { requireOptin: boolean; aiRequiresConsent: boolean; piiRedaction: string; dataRetentionDays: number; residency: string }
export interface Page<T> { items: T[]; nextCursor?: string | null }
export type PayMethod =
  | "zarinpal" | "idpay" | "nextpay" | "stripe" | "paypal"
  | "usdt_trc20" | "usdt_bep20" | "usdt_ton" | "card";
export type CredentialKind = "key" | "wallet" | "manual";
export type AppidoPlan = "start" | "pro";

// Tenant insights (mirrors core-api InsightsService)
export interface InsightsSummary {
  revenueUsd90d: number;
  revenueDeltaPct: number | null;
  customers: number;
  qualifiedLeads: number;
  conversionPct: number;
  activeSubscribers: number;
  churnPct: number | null;
}
export interface FunnelStage { stage: "reached" | "engaged" | "qualified" | "paid"; count: number; pct: number }
export interface RevenueSeries { weeks: number; series: { week: string; usd: number }[] }

// Tenant data rows (display-enriched by core-api)
export interface ApiCustomer { id: string; name: string; handle: string | null; tag: "hot" | "warm" | "cold" | "vip"; segment: string | null; intent: number; ltvCents: number; isVip: boolean; aiManaged: boolean }
export interface ApiTransaction { id: string; amountCents: number; currency: string; gateway: string; status: "pending" | "ok" | "fail"; customerId: string | null; productId: string | null; customerName: string | null; at: string }
export interface ApiProduct { id: string; name: string; priceCents: number; currency: string; durationDays: number | null; description: string | null; doc: string | null; active: boolean; sales: number }
export interface UsageTier { tier: string; calls: number; tokensIn: number; tokensOut: number; costUsd: number }
export interface Usage {
  windowDays: number;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  byModel: { model: string; tokensIn: number; tokensOut: number; costUsd: number }[];
  byTier: UsageTier[];
}
export interface Me { id: string; email: string; name: string; role: string; tenantId: string | null; mustRotate: boolean }
export interface ApiChannel { id: string; name: string; username: string | null; members: number; botUsername: string | null; connectedAt: string | null; aiModel: string; aiEnabled: boolean; onboardingEnabled?: boolean; createdAt: string; revCents: number }
export interface Subscription { plan: string; status: string; periodEnd: string | null }
// Appido's OWN plan catalog (shared source of truth — owner manages, landing + dashboard display).
export interface PublicPlan { key: string; name: string; descFa: string | null; descEn: string | null; priceCents: number; annualCents: number | null; currency: string; periodDays: number; featuresFa: string[]; featuresEn: string[]; popular: boolean }
export interface DashboardSummary { channels: unknown[]; customers: number; gmvUsd: number; subscription: Subscription | null; aiTokens: number }
// Inbox/CRM conversation row (one per customer, latest message) + chat thread message
export interface InboxConvo { customerId: string; name: string; handle: string | null; tag: "hot" | "warm" | "cold" | "vip"; intent: number; segment: string | null; aiManaged: boolean; isVip: boolean; last: string | null; author: "customer" | "ai" | "human" | null; direction: "in" | "out" | null; at: string | null; unread: number }
export interface ThreadMsg { id: string; direction: "in" | "out"; author: "customer" | "ai" | "human"; body: string; at: string }
// Growth (marketing/targeting) — enriched by core-api
export interface ApiSegment { id: string; name: string; criteria: Record<string, unknown>; createdAt: string; count: number }
export interface ApiCampaign { id: string; name: string; status: string; goal: string | null; createdAt: string; sent: number; converted: number; total: number }
// Payments — gateway catalog (registry-driven) + tenant credential status (never includes secrets)
export interface PayCatalogField { key: string; label: string; type: "text" | "password" | "boolean"; required?: boolean; placeholder?: string }
export interface PayCatalogItem { method: string; label: string; kind: CredentialKind; group: string; crypto?: boolean; manual?: boolean; available: boolean; platformEnabled?: boolean; fields: PayCatalogField[] }
export interface PayCredential { id: string; method: string; kind: CredentialKind; enabled: boolean; verifiedAt: string | null; createdAt: string }

// ── The client ───────────────────────────────────────────────────────────────────────
export const api = {
  enabled: apiEnabled,

  auth: {
    /** Issue/refresh the CSRF cookie. Call once before the first mutation. */
    ensureCsrf: () => req<{ ok: true }>("GET", "/auth/csrf"),
    /** Email a one-time login code (neutral by design — never reveals whether the email exists). */
    startLogin: (email: string) => req<{ ok: true }>("POST", "/auth/login/start", { email }),
    loginWithPassword: (email: string, password: string) => req("POST", "/auth/login/password", { email, password }),
    loginWithCode: (email: string, code: string) => req("POST", "/auth/login/code", { email, code }),
    register: (input: { email: string; password: string; name?: string; brand?: string }) =>
      req<{ ok: true; mustRotate: boolean }>("POST", "/auth/register", input),
    requestReset: (email: string) => req<{ ok: true }>("POST", "/auth/password/forgot", { email }),
    resetPassword: (email: string, code: string, newPassword: string) =>
      req<{ ok: true }>("POST", "/auth/password/reset", { email, code, newPassword }),
    logout: () => req<{ ok: true }>("POST", "/auth/logout"),
    rotatePassword: (newPassword: string) => req<{ ok: true }>("POST", "/auth/password/rotate", { newPassword }),
  },

  me: () => req<Me>("GET", "/me"),
  session: () => req("GET", "/session"),
  channels: () => req<ApiChannel[]>("GET", "/channels"),
  // The channel's AI config is the single backend truth (dashboard edits, owner console monitors).
  setChannelAi: (id: string, body: { aiModel?: string; aiEnabled?: boolean; aiBudgetCents?: number; onboardingEnabled?: boolean }) =>
    req<{ id: string; aiModel: string; aiEnabled: boolean; aiBudgetCents: number; onboardingEnabled: boolean }>("PATCH", `/channels/${encodeURIComponent(id)}/ai`, body),

  // Tenant-scoped insights for the dashboard overview (RLS-scoped to the caller's tenant)
  insights: {
    summary: () => req<InsightsSummary>("GET", "/v1/insights/summary"),
    revenue: (weeks?: number) => req<RevenueSeries>("GET", "/v1/insights/revenue" + (weeks ? `?weeks=${weeks}` : "")),
    funnel: () => req<{ stages: FunnelStage[] }>("GET", "/v1/insights/funnel"),
  },

  // Tenant data (the dashboard's own customers/products/transactions — NOT Appido billing)
  data: {
    customers: (opts: { limit?: number; cursor?: string } = {}) => req<Page<ApiCustomer>>("GET", "/v1/customers" + qs(opts)),
    customer: (id: string) => req("GET", `/v1/customers/${encodeURIComponent(id)}`),
    customerMessages: (id: string, opts: { limit?: number } = {}) => req<ThreadMsg[]>("GET", `/v1/customers/${encodeURIComponent(id)}/messages` + qs(opts)),
    sendReply: (id: string, text: string) => req<ThreadMsg>("POST", `/v1/customers/${encodeURIComponent(id)}/reply`, { text }),
    markRead: (id: string) => req<{ ok: true }>("POST", `/v1/customers/${encodeURIComponent(id)}/read`, {}),
    listConsent: (id: string) => req<ConsentRow[]>("GET", `/v1/customers/${encodeURIComponent(id)}/consent`),
    setConsent: (id: string, body: { purpose: "marketing" | "ai" | "analytics"; granted: boolean; source?: string }) => req<ConsentRow[]>("POST", `/v1/customers/${encodeURIComponent(id)}/consent`, body),
    exportCustomer: (id: string) => req("GET", `/v1/customers/${encodeURIComponent(id)}/export`),
    deleteCustomer: (id: string) => req<{ ok: true; deleted: string }>("DELETE", `/v1/customers/${encodeURIComponent(id)}`),
    products: () => req<ApiProduct[]>("GET", "/v1/products"),
    transactions: (opts: { limit?: number; cursor?: string } = {}) => req<Page<ApiTransaction>>("GET", "/v1/transactions" + qs(opts)),
    inbox: (opts: { limit?: number } = {}) => req<InboxConvo[]>("GET", "/v1/inbox" + qs(opts)),
    usage: () => req<Usage>("GET", "/v1/usage"),
    summary: () => req<DashboardSummary>("GET", "/v1/dashboard/summary"),
  },

  ai: {
    /** Server-side revenue advisor (replaces any client-side LLM call). */
    advisor: (question: string) => req<{ text?: string } | string>("POST", "/v1/ai/advisor", { question }),
    test: (message: string, customerId?: string) => req("POST", "/v1/ai/test", { message, customerId }),
    getConfig: () => req("GET", "/v1/ai/config"),
    putConfig: (config: Record<string, unknown>) => req("PUT", "/v1/ai/config", config),
    getKnowledge: () => req("GET", "/v1/ai/knowledge"),
    addKnowledge: (entry: Record<string, unknown>) => req("POST", "/v1/ai/knowledge", entry),
  },

  // Tenant's payment credentials (per-tenant, encrypted server-side)
  payments: {
    methods: () => req<PayCatalogItem[]>("GET", "/v1/payments/methods"),
    listCredentials: () => req<PayCredential[]>("GET", "/v1/payments/credentials"),
    upsertCredential: (input: { method: string; kind: CredentialKind; secret?: Record<string, unknown> }) =>
      req<{ id: string }>("POST", "/v1/payments/credentials", input),
    setEnabled: (id: string, enabled: boolean) => req("PATCH", `/v1/payments/credentials/${encodeURIComponent(id)}`, { enabled }),
    deleteCredential: (id: string) => req("DELETE", `/v1/payments/credentials/${encodeURIComponent(id)}`),
    confirmTransaction: (id: string) => req("POST", `/v1/payments/transactions/${encodeURIComponent(id)}/confirm`),
  },

  growth: {
    score: (input: Record<string, unknown>) => req("POST", "/v1/growth/score", input),
    leads: () => req("GET", "/v1/growth/leads"),
    listSegments: () => req<ApiSegment[]>("GET", "/v1/growth/segments"),
    createSegment: (input: Record<string, unknown>) => req("POST", "/v1/growth/segments", input),
    deleteSegment: (id: string) => req("DELETE", `/v1/growth/segments/${encodeURIComponent(id)}`),
    listCampaigns: () => req<ApiCampaign[]>("GET", "/v1/growth/campaigns"),
    createCampaign: (input: Record<string, unknown>) => req("POST", "/v1/growth/campaigns", input),
    getCampaign: (id: string) => req("GET", `/v1/growth/campaigns/${encodeURIComponent(id)}`),
    copyCampaign: (id: string) => req("POST", `/v1/growth/campaigns/${encodeURIComponent(id)}/copy`),
    sendCampaign: (id: string) => req("POST", `/v1/growth/campaigns/${encodeURIComponent(id)}/send`),
  },

  telegram: {
    verifyToken: (token: string) => req("POST", "/v1/telegram/verify-token", { token }),
    connect: (token: string, name?: string) => req("POST", "/v1/telegram/connect", { token, name }),
    status: (channelId: string) => req("GET", `/v1/telegram/status/${encodeURIComponent(channelId)}`),
    disconnect: (channelId: string) => req("POST", `/v1/telegram/disconnect/${encodeURIComponent(channelId)}`),
  },

  // Appido's OWN plan catalog (public) — same source the owner console manages and the landing shows.
  plans: () => req<PublicPlan[]>("GET", "/v1/plans"),
  // Platform settings shared across surfaces (e.g. free-trial length).
  settings: () => req<{ trialDays: number }>("GET", "/v1/settings"),
  // Read-only governance policy + the onboarding script the AI will use (owner-managed).
  governance: () => req<GovernancePolicy>("GET", "/v1/governance"),
  aiScript: () => req<ScriptItem[]>("GET", "/v1/ai/script"),
  // Appido subscription the BUSINESS pays (Start/Pro) — NOT the manager's own products
  billing: {
    subscription: () => req("GET", "/v1/billing/subscription"),
    checkout: (plan: string) => req<{ redirectUrl?: string }>("POST", "/v1/billing/checkout", { plan }),
    redeem: (code: string) => req("POST", "/v1/billing/redeem", { code }),
  },

  flywheel: () => req("GET", "/v1/flywheel"),
};

/** Convenience for the AI advisor: returns plain text or null (callers can fall back to demo copy). */
export async function aiAdvisor(question: string): Promise<string | null> {
  if (!apiEnabled()) return null;
  try {
    const r = await api.ai.advisor(question);
    if (typeof r === "string") return r || null;
    return (r && typeof r === "object" && "text" in r ? String((r as { text?: string }).text ?? "") : "") || null;
  } catch {
    return null;
  }
}

/** Map the backend /me record onto the dashboard's account object, preserving local prefs. */
export function accountFromMe(me: Me, base: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...base, email: me.email, brand: (me.name && me.name.trim()) || (base.brand as string) || me.email };
}
