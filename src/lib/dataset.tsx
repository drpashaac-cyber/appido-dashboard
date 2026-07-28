// Dataset provider: serves the dashboard's data either from the backend (when APPIDO_API_BASE is
// set) or from local seed data (demo mode). Views call useDataset() instead of importing the seed
// constants directly, so each view flips from demo → live independently as it's migrated.
//
// Migrated: KPIS, REVENUE, FUNNEL (overview insights → /v1/insights/*); CONVOS (CRM → /v1/customers),
// TXNS (→ /v1/transactions), PRODUCTS (→ /v1/products), USAGE (AI metering → /v1/usage, incl. the
// hybrid local/cloud tier split). In LIVE mode we show the tenant's real data as-is (even when empty)
// — never seed — so the numbers are always honest.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  KPIS as SEED_KPIS, REVENUE as SEED_REVENUE, FUNNEL as SEED_FUNNEL,
  CONVOS as SEED_CONVOS, TXNS as SEED_TXNS, PRODUCTS as SEED_PRODUCTS,
  SEGMENTS as SEED_SEGMENTS, CAMPAIGNS as SEED_CAMPAIGNS,
} from "../data";
import { api, apiEnabled, type ApiTransaction, type ApiProduct, type Usage, type ApiChannel, type Subscription, type InboxConvo, type ApiSegment, type ApiCampaign } from "./api";

export interface KpiItem { k: string; v: string; delta: number; spark: number[]; tone: string }
export interface FunnelItem { l: string; v: number; p: number }

export interface Dataset {
  KPIS: KpiItem[];
  REVENUE: number[];
  FUNNEL: FunnelItem[];
  CONVOS: any[];
  TXNS: any[];
  PRODUCTS: any[];
  SEGMENTS: any[];
  CAMPAIGNS: any[];
  USAGE: Usage | null;
  live: boolean;
  loading: boolean;
}

const SEED: Pick<Dataset, "KPIS" | "REVENUE" | "FUNNEL" | "CONVOS" | "TXNS" | "PRODUCTS" | "SEGMENTS" | "CAMPAIGNS"> = {
  KPIS: SEED_KPIS as KpiItem[],
  REVENUE: SEED_REVENUE as number[],
  FUNNEL: SEED_FUNNEL as FunnelItem[],
  CONVOS: SEED_CONVOS as any[],
  TXNS: SEED_TXNS as any[],
  PRODUCTS: SEED_PRODUCTS as any[],
  SEGMENTS: SEED_SEGMENTS as any[],
  CAMPAIGNS: SEED_CAMPAIGNS as any[],
};

const EMPTY: Pick<Dataset, "KPIS" | "REVENUE" | "FUNNEL" | "CONVOS" | "TXNS" | "PRODUCTS" | "SEGMENTS" | "CAMPAIGNS"> = {
  KPIS: [
    { k: "Revenue (90d)", v: "$0", delta: 0, spark: [0, 0], tone: "mint" },
    { k: "Qualified leads", v: "0", delta: 0, spark: [0, 0], tone: "" },
    { k: "Conversion", v: "0%", delta: 0, spark: [0, 0], tone: "" },
    { k: "Active subscribers", v: "0", delta: 0, spark: [0, 0], tone: "" },
    { k: "Churn", v: "—", delta: 0, spark: [0, 0], tone: "down-good" },
  ],
  REVENUE: [0, 0],
  FUNNEL: [
    { l: "Reached", v: 0, p: 0 },
    { l: "Engaged by AI", v: 0, p: 0 },
    { l: "Qualified", v: 0, p: 0 },
    { l: "Paid", v: 0, p: 0 },
  ],
  CONVOS: [],
  TXNS: [],
  PRODUCTS: [],
  SEGMENTS: [],
  CAMPAIGNS: [],
};

const Ctx = createContext<Dataset>({ ...EMPTY, USAGE: null, live: false, loading: false });
export const useDataset = (): Dataset => useContext(Ctx);

const fmtUsd = (v: number): string => "$" + Math.round(v).toLocaleString("en-US");
const fmtInt = (v: number): string => Math.round(v).toLocaleString("en-US");
const flat = (v: number): number[] => [v, v]; // Sparkline needs ≥2 points
const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

function relTime(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 60) return Math.max(m, 0) + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  return Math.floor(h / 24) + "d";
}
function periodOf(days: number | null): string {
  if (days == null) return "lifetime";
  if (days >= 360 && days <= 372) return "yearly";
  if (days >= 28 && days <= 31) return "monthly";
  return days + "d";
}

// ── adapters: backend rows → the display shapes the views already expect ──────────────
// Conversation row for CRM/inbox/overview — sourced from the conversation-grouped /v1/inbox, so the
// last message, time, who's handling it and a waiting flag are all real (unread = customer's last
// message is unanswered; there's no read model yet).
function convoFromInbox(r: InboxConvo) {
  return { id: r.customerId, name: r.name, handle: r.handle || "", tag: cap(r.tag || ""), seg: r.segment || (r.aiManaged ? "ai" : "needs"), last: r.last || "", time: r.at ? relTime(r.at) : "", unread: r.unread || 0, ai: r.aiManaged, who: r.segment || "", intent: r.intent };
}
function txnFromApi(t: ApiTransaction) {
  return { name: t.customerName || "—", amount: fmtUsd(t.amountCents / 100), gw: t.gateway, status: t.status, time: relTime(t.at), plan: 0 };
}
function productFromApi(p: ApiProduct) {
  return { id: p.id, name: p.name, cat: "", active: p.active, desc: p.description || "", plans: [{ id: "pl-" + p.id, period: periodOf(p.durationDays), price: fmtUsd(p.priceCents / 100) }], discounts: [], doc: p.doc || "", sales: p.sales || 0, conv: 0 };
}

// Targeting: segment size is live (count of matching customers); tone/hint derived from the criteria.
function segTone(cr: Record<string, any>): string {
  if (cr.tag === "hot" || (typeof cr.minScore === "number" && cr.minScore >= 60)) return "hot";
  if (cr.isVip === true || cr.tag === "vip") return "good";
  if (typeof cr.maxScore === "number" && cr.maxScore <= 30) return "warn";
  return "";
}
function segHint(cr: Record<string, any>): string {
  if (cr.isVip === true || cr.tag === "vip") return "Upsell / expand";
  if (cr.tag === "hot" || (typeof cr.minScore === "number" && cr.minScore >= 60)) return "Send the offer with urgency";
  if (typeof cr.maxScore === "number" && cr.maxScore <= 30) return "Re-engage with value";
  if (cr.tag) return String(cr.tag) + " leads";
  return "";
}
function segmentFromApi(s: ApiSegment) {
  const cr = (s.criteria || {}) as Record<string, any>;
  return { n: s.name, c: s.count || 0, hint: segHint(cr), tone: segTone(cr) };
}
// reply rate isn't tracked per send yet → 0; conversion = converted/sent.
function campaignFromApi(c: ApiCampaign) {
  return { n: c.name, status: c.status === "draft" ? "Draft" : "Active", sent: c.sent || 0, reply: 0, conv: c.sent ? Math.round((c.converted / c.sent) * 100) : 0, kind: c.goal || "Campaign" };
}
// Appido subscription (per-tenant, applied to each channel card). growth/payments aren't per-channel
// in the backend — left at sensible defaults until wired.
export function channelFromApi(c: ApiChannel, sub: Subscription | null) {
  const planName = sub ? (sub.plan === "pro" ? "Pro" : sub.plan === "start" ? "Start" : "Trial") : "";
  const paid = !!sub && (sub.status === "active" || sub.status === "trialing");
  let daysLeft = 0;
  const daysTotal = 30;
  if (sub && sub.periodEnd) daysLeft = Math.max(Math.ceil((new Date(sub.periodEnd).getTime() - Date.now()) / 86_400_000), 0);
  return {
    id: c.id,
    name: c.name,
    username: c.botUsername || c.username || "",
    members: c.members || 0,
    date: c.connectedAt ? new Date(c.connectedAt).toISOString().slice(0, 10) : "",
    rev: Math.round((c.revCents || 0) / 100),
    growth: 0,
    paid,
    planName,
    daysLeft,
    daysTotal,
    payments: [] as any[],
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Dataset>(() =>
    apiEnabled()
      ? { ...EMPTY, USAGE: null, live: true, loading: true }
      : { ...SEED, USAGE: null, live: false, loading: false }
  );

  useEffect(() => {
    if (!apiEnabled()) return;
    let alive = true;
    (async () => {
      try {
        const [summary, rev, fun, convos, txns, prods, usage, segs, camps] = await Promise.all([
          api.insights.summary(),
          api.insights.revenue(),
          api.insights.funnel(),
          api.data.inbox({ limit: 60 }),
          api.data.transactions({ limit: 50 }),
          api.data.products(),
          api.data.usage(),
          api.growth.listSegments(),
          api.growth.listCampaigns(),
        ]);
        if (!alive) return;
        const series = (rev?.series ?? []).map((p) => p.usd);
        const revSpark = series.length >= 2 ? series : flat(summary.revenueUsd90d);
        // Order MUST match t.ov.kpis[]: Revenue, Qualified leads, Conversion, Active subscribers, Churn.
        const KPIS: KpiItem[] = [
          { k: "Revenue (90d)", v: fmtUsd(summary.revenueUsd90d), delta: summary.revenueDeltaPct ?? 0, spark: revSpark, tone: "mint" },
          { k: "Qualified leads", v: fmtInt(summary.qualifiedLeads), delta: 0, spark: flat(summary.qualifiedLeads), tone: "" },
          { k: "Conversion", v: summary.conversionPct + "%", delta: 0, spark: flat(summary.conversionPct), tone: "" },
          { k: "Active subscribers", v: fmtInt(summary.activeSubscribers), delta: 0, spark: flat(summary.activeSubscribers), tone: "" },
          { k: "Churn", v: summary.churnPct == null ? "—" : summary.churnPct + "%", delta: summary.churnPct ?? 0, spark: flat(summary.churnPct ?? 0), tone: "down-good" },
        ];
        const FUNNEL: FunnelItem[] = fun.stages.map((s) => ({ l: s.stage, v: s.count, p: s.pct }));
        setState({
          KPIS,
          REVENUE: series.length >= 2 ? series : [0, 0],
          FUNNEL,
          CONVOS: (convos ?? []).map(convoFromInbox),
          TXNS: (txns?.items ?? []).map(txnFromApi),
          PRODUCTS: (prods ?? []).map(productFromApi),
          SEGMENTS: (segs ?? []).map(segmentFromApi),
          CAMPAIGNS: (camps ?? []).map(campaignFromApi),
          USAGE: usage ?? null,
          live: true,
          loading: false,
        });
      } catch {
        if (alive) setState({ ...EMPTY, USAGE: null, live: true, loading: false });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

