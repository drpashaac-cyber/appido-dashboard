// Navigation + sidebar structure.

export const ACTION_META = [
  { icon: "reply", type: "msg" },
  { icon: "gift", type: "msg" },
  { icon: "flame", type: "hot" },
  { icon: "clock", type: "renew" },
  { icon: "megaphone", type: "camp" },
  { icon: "card", type: "pay" },
];
export const ACT_NAV_TO: Record<string, string> = { msg: "inbox", hot: "inbox", renew: "inbox", camp: "campaigns", pay: "transactions" };
export const NAV = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "inbox", label: "Inbox", icon: "inbox", badge: 7 },
  { id: "crm", label: "CRM & Pipeline", icon: "pipe" },
  { id: "audience", label: "Audience", icon: "users" },
  { id: "offers", label: "Offers", icon: "gift" },
  { id: "transactions", label: "Transactions", icon: "card" },
  { id: "campaigns", label: "Campaigns", icon: "megaphone" },
  { id: "journeys", label: "Journeys", icon: "flow" },
  { id: "agent", label: "AI Agent & Knowledge", icon: "bot" },
  { id: "insights", label: "AI Insights", icon: "spark", badge: 3 },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "actions", label: "Today", icon: "zap", badge: 6 },
];
export const SIDE_GROUPS = [
  { key: "customers", icon: "users", idx: [1, 2, 3] },
  { key: "grow", icon: "megaphone", idx: [4, 6, 7] },
  { key: "ai", icon: "spark", idx: [8, 9] },
];
export const SIDE_DESKONLY = new Set([0, 1, 2, 11]);
export const SIDE_ID2G: Record<string, string> = {};
SIDE_GROUPS.forEach((gr) => gr.idx.forEach((i) => { SIDE_ID2G[NAV[i].id] = gr.key; }));
