// Demo/seed dataset (customers, products, transactions, campaigns, audience).

export const KPIS = [
  { k: "Revenue (90d)", v: "$48,250", delta: 23, spark: [12, 15, 14, 18, 22, 20, 27, 26, 31, 35, 33, 42, 48], tone: "mint" },
  { k: "Qualified leads", v: "1,284", delta: 12, spark: [40, 52, 48, 61, 58, 70, 66, 78, 82, 90, 95, 102, 128], tone: "" },
  { k: "Conversion", v: "38%", delta: 6, spark: [22, 24, 26, 25, 29, 31, 30, 33, 35, 34, 36, 37, 38], tone: "" },
  { k: "Active subscribers", v: "3,910", delta: 9, spark: [30, 31, 33, 34, 33, 36, 38, 37, 39, 40, 41, 40, 41], tone: "" },
  { k: "Churn", v: "4.2%", delta: -1.8, spark: [9, 8, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4], tone: "down-good" },
];
export const REVENUE = [9, 11, 10, 14, 13, 17, 16, 21, 19, 24, 22, 28, 26, 33, 31, 38, 36, 41, 39, 45, 48];
export const FUNNEL = [
  { l: "Reached", v: 8200, p: 100 },
  { l: "Engaged by AI", v: 5740, p: 70 },
  { l: "Qualified", v: 1284, p: 22 },
  { l: "Paid", v: 488, p: 8 },
];
export const FUNNEL_PREFILL = [
  { goal: 2, seg: 2, type: 1 }, // Reached -> reactivate cold / cold / announcement
  { goal: 0, seg: 1, type: 1 }, // Engaged -> increase sales / engaged / announcement
  { goal: 0, seg: 0, type: 2 }, // Qualified -> increase sales / hot / limited offer
  { goal: 1, seg: 0, type: 0 }, // Paid -> renew / hot / special discount
];
export const OTHER_SESSIONS = [
  { id: "sx1", icon: "phone", os: "iOS", app: "Telegram in-app", city: "Tehran", ago: { u: "h", n: 2 } },
  { id: "sx2", icon: "laptop", os: "Windows", app: "Chrome", city: "Moscow", ago: { u: "d", n: 1 } },
  { id: "sx3", icon: "laptop", os: "macOS", app: "Safari", city: "Istanbul", ago: { u: "d", n: 5 } },
];
export const CONVOS = [
  { id: 1, name: "Sara K.", handle: "@sara_k", tag: "Hot", seg: "needs", last: "Is the annual plan really 2 months free?", time: "2m", unread: 2, ai: false, who: "Coaching", intent: 92 },
  { id: 2, name: "Dmitry V.", handle: "@dmitryv", tag: "Warm", seg: "ai", last: "AI: Shared the comparison + checkout link.", time: "6m", unread: 0, ai: true, who: "Crypto", intent: 71 },
  { id: 3, name: "Elif A.", handle: "@elifa", tag: "VIP", seg: "vip", last: "Renewed — thanks! One more seat please.", time: "18m", unread: 1, ai: false, who: "Agency", intent: 80 },
  { id: 4, name: "Omar H.", handle: "@omar_h", tag: "Cold", seg: "ai", last: "AI: Qualifying — asked about team size.", time: "24m", unread: 0, ai: true, who: "Course", intent: 44 },
  { id: 5, name: "Niloofar R.", handle: "@niloo_r", tag: "Warm", seg: "needs", last: "Can you invoice in IRR?", time: "41m", unread: 1, ai: false, who: "Membership", intent: 68 },
  { id: 6, name: "Ivan P.", handle: "@ivanp", tag: "Warm", seg: "ai", last: "AI: Sent onboarding steps.", time: "1h", unread: 0, ai: true, who: "Course", intent: 63 },
];
export const THREAD = [
  { from: "them", t: "Hi! Saw your channel. Do you support USDT?", time: "10:02" },
  { from: "ai", t: "Yes — USDT on TRC20 and BEP20, plus rial gateways (ZarinPal, IDPay). Want me to set up your workspace?", time: "10:02", conf: 96 },
  { from: "them", t: "Is the annual plan really 2 months free?", time: "10:05" },
  { from: "ai", t: "Correct — annual billing saves 17% (2 months). For your volume the Pro plan fits best.", time: "10:05", draft: false, conf: 93 },
  { from: "them", t: "", time: "10:06" },
  { from: "ai", t: "", time: "10:06" },
  { from: "them", t: "", time: "10:07" },
  { from: "ai", t: "", time: "10:07" },
  { from: "them", t: "", time: "10:08" },
];
export const SUGGEST = "Yes — annual saves you ~17%. I can apply it now and your access stays active instantly. Shall I send the checkout link?";
export const CHANNELS_INIT: any[] = [];
export const STAGES = [
  { id: "cold", label: "Cold", color: "#D1C9BA", cards: [
    { n: "Omar H.", handle: "@omar_h", who: "Course creator", v: 49, intent: 44, t: "2h", ltv: 0, points: 10, phone: "+98 935 000 1122", email: "", plan: null, tags: ["new"], tl: [{ e: "failed", t: "12:35" }, { e: "viewed", t: "12:32" }, { e: "joined", t: "12:30" }] },
    { n: "Lana M.", handle: "@lana_m", who: "Coach", v: 49, intent: 38, t: "5h", ltv: 0, points: 6, phone: "+7 903 221 1900", email: "", plan: null, tags: ["new"], tl: [{ e: "joined", t: "yesterday" }] },
    { n: "Pavel S.", handle: "@pavel_s", who: "Crypto", v: 149, intent: 41, t: "1d", ltv: 0, points: 14, phone: "+7 912 333 2211", email: "pavel@mail.com", plan: null, tags: ["engaged"], tl: [{ e: "viewed", t: "1d" }, { e: "joined", t: "1d" }] },
  ] },
  { id: "warm", label: "Warm", color: "#67E18D", cards: [
    { n: "Dmitry V.", handle: "@dmitryv", who: "Crypto community", v: 149, intent: 71, t: "12m", ltv: 10, points: 95, phone: "+7 905 110 0042", email: "dmitry@mail.com", plan: 0, tags: ["engaged"], tl: [{ e: "viewed", t: "10:32" }, { e: "paid", v: "$10", t: "09:50" }, { e: "joined", t: "09:40" }] },
    { n: "Ivan P.", handle: "@ivanp", who: "Course", v: 49, intent: 63, t: "1h", ltv: 10, points: 60, phone: "+7 921 884 0033", email: "", plan: 0, tags: ["engaged"], tl: [{ e: "paid", v: "$10", t: "1h" }, { e: "joined", t: "2h" }] },
    { n: "Niloofar R.", handle: "@niloo_r", who: "Membership", v: 149, intent: 68, t: "40m", ltv: 22, points: 120, phone: "+98 912 998 8776", email: "niloo@mail.com", plan: 1, tags: ["engaged", "renewed"], tl: [{ e: "viewed", t: "40m" }, { e: "paid", v: "$22", t: "yesterday" }, { e: "joined", t: "3d" }] },
  ] },
  { id: "hot", label: "Hot", color: "#F5B73C", cards: [
    { n: "Sara K.", handle: "@sara_k", who: "Coaching", v: 149, intent: 92, t: "2m", ltv: 170, points: 320, phone: "+98 912 123 4567", email: "sara@mail.com", plan: 1, tags: ["vip", "engaged"], tl: [{ e: "paid", v: "$22", t: "10:35" }, { e: "viewed", t: "10:32" }, { e: "joined", t: "10:30" }] },
    { n: "Mehdi T.", handle: "@mehdi_t", who: "Agency", v: 149, intent: 84, t: "30m", ltv: 90, points: 210, phone: "+98 919 555 1212", email: "mehdi@mail.com", plan: 2, tags: ["engaged"], tl: [{ e: "viewed", t: "30m" }, { e: "joined", t: "2h" }] },
  ] },
  { id: "won", label: "Customer", color: "#3F8C5B", cards: [
    { n: "Elif A.", handle: "@elifa", who: "Agency", v: 149, intent: 80, t: "today", ltv: 120, points: 260, phone: "+90 532 000 1188", email: "elif@mail.com", plan: 2, tags: ["vip"], tl: [{ e: "vip", t: "08:00" }, { e: "renewed", t: "today" }, { e: "paid", v: "$90", t: "today" }] },
    { n: "Reza N.", handle: "@reza_n", who: "Coaching", v: 49, intent: 77, t: "today", ltv: 50, points: 140, phone: "+98 912 333 2211", email: "", plan: 0, tags: ["winback"], tl: [{ e: "expired", t: "1w" }, { e: "paid", v: "$10", t: "1mo" }] },
  ] },
];
export const SEGMENTS = [
  { n: "High-intent, no purchase", c: 142, hint: "Send the annual offer + 24h urgency", tone: "hot" },
  { n: "Churn risk (renewal < 7d)", c: 38, hint: "Trigger win-back sequence", tone: "warn" },
  { n: "Dormant 30d+", c: 410, hint: "Re-engage with value content", tone: "" },
  { n: "Power users", c: 96, hint: "Upsell extra seats / Scale", tone: "good" },
];
export const CATS = [
  { key: "signals", deliver: "channel" },
  { key: "course", deliver: "content" },
  { key: "vip", deliver: "channel" },
  { key: "coaching", deliver: "calls" },
  { key: "consulting", deliver: "calls" },
  { key: "digital", deliver: "file" },
  { key: "community", deliver: "group" },
  { key: "other", deliver: "manual" },
];
export const PRODUCTS = [
  { id: "p1", name: "Crypto Signals VIP", cat: "signals", active: true, desc: "Daily spot & futures calls with entry, SL and targets.", plans: [{ id: "pl1", period: "monthly", price: "$29" }, { id: "pl2", period: "yearly", price: "$249" }], discounts: [{ id: "dc1", code: "LAUNCH20", percent: 20 }], doc: "3–5 signals posted daily (08:00–22:00 UTC). Each signal includes entry, stop-loss and 2 take-profit targets. Delivery is Telegram-only via the VIP channel. 7-day money-back guarantee if no signal is posted. Renewals are automatic; cancel anytime from the bot.", sales: 142, conv: 7 },
  { id: "p2", name: "Pro Trading Course", cat: "course", active: true, desc: "12-module video course, basics to advanced risk management.", plans: [{ id: "pl3", period: "lifetime", price: "$199" }], discounts: [], files: [{ id: "f1", name: "course-syllabus.pdf" }], doc: "12 recorded modules (~9 hours) covering market structure, risk sizing and journaling. Lifetime access, watch on any device. Includes a private Q&A channel. No refunds after the first 3 modules are unlocked.", sales: 64, conv: 11 },
  { id: "p3", name: "1:1 Mentorship", cat: "coaching", active: false, desc: "Weekly private coaching calls with portfolio review.", plans: [{ id: "pl4", period: "monthly", price: "$199" }], discounts: [{ id: "dc2", code: "VIP10", percent: 10 }], doc: "One 60-minute private call per week plus async chat support. Limited to 10 seats. Includes a monthly portfolio review. Cancel anytime; unused weeks are not refunded.", sales: 12, conv: 22 },
];
export const OFFERS = [
  { dur: 0, price: "$10", popular: false, active: true, conv: 7, sales: 142, guarantee: true, bonus: null, ai: false },
  { dur: 1, price: "$22", old: "$30", popular: true, active: true, urgency: true, conv: 23, sales: 318, guarantee: true, bonus: 0, ai: true },
  { dur: 2, price: "$90", popular: false, active: false, conv: 4, sales: 36, guarantee: true, bonus: 1, ai: false },
];
export const TXNS = [
  { name: "Sara K.", amount: "$22", gw: "ZarinPal", status: "ok", time: "2h", plan: 1 },
  { name: "Elif A.", amount: "$90", gw: "USDT TRC20", status: "ok", time: "5h", plan: 2 },
  { name: "Dmitry V.", amount: "$10", gw: "USDT BEP20", status: "ok", time: "1d", plan: 0 },
  { name: "Omar H.", amount: "$10", gw: "ZarinPal", status: "fail", time: "1d", plan: 0 },
  { name: "Niloofar R.", amount: "$22", gw: "IDPay", status: "ok", time: "today", plan: 1 },
];
export const GENDER = [{ l: "Female", v: 54, c: "#67E18D" }, { l: "Male", v: 41, c: "#27403A" }, { l: "Other", v: 5, c: "#C2ECCC" }];
export const AGES = [{ l: "18–24", v: 22 }, { l: "25–34", v: 38 }, { l: "35–44", v: 24 }, { l: "45–54", v: 11 }, { l: "55+", v: 5 }];
export const GEO = [
  { l: "Iran", v: 41 }, { l: "Russia", v: 19 }, { l: "Turkey", v: 14 }, { l: "Kazakhstan", v: 9 }, { l: "UAE", v: 8 }, { l: "Other", v: 9 },
];
export const HOURS = ["0–4", "4–8", "8–12", "12–16", "16–20", "20–24"];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const HEAT = [
  [0, 1, 2, 3, 4, 3], [0, 1, 2, 3, 4, 3], [0, 1, 2, 2, 4, 4], [1, 1, 2, 3, 4, 3],
  [1, 2, 3, 3, 4, 4], [2, 2, 3, 4, 4, 4], [2, 3, 3, 4, 3, 2],
];
export const CAMPAIGNS = [
  { n: "Cold → Warm nurture", status: "Active", sent: 2140, reply: 31, conv: 9, kind: "Sequence · 5 steps" },
  { n: "Annual upgrade push", status: "Active", sent: 680, reply: 44, conv: 18, kind: "Broadcast + offer" },
  { n: "Win-back (churn < 7d)", status: "Active", sent: 210, reply: 27, conv: 12, kind: "Trigger sequence" },
  { n: "New course launch", status: "Draft", sent: 0, reply: 0, conv: 0, kind: "Broadcast" },
];
export const JOURNEY = [
  { id: "trigger", x: 4, y: 38, kind: "trigger", t: "Lead joins channel / DMs bot", icon: "zap" },
  { id: "qualify", x: 27, y: 38, kind: "ai", t: "AI qualifies + tags intent", icon: "bot" },
  { id: "cond", x: 50, y: 38, kind: "cond", t: "Intent ≥ 70?", icon: "filter" },
  { id: "hot", x: 73, y: 14, kind: "action", t: "Send offer + checkout", icon: "coin" },
  { id: "nurture", x: 73, y: 62, kind: "action", t: "Enroll in nurture sequence", icon: "megaphone" },
];
export const FILES = [
  { n: "Product_FAQ.pdf", size: "1.2 MB", status: "Indexed", chunks: 84 },
  { n: "Pricing_2026.csv", size: "32 KB", status: "Indexed", chunks: 12 },
  { n: "Objection_handling.docx", size: "240 KB", status: "Indexed", chunks: 38 },
  { n: "Refund_policy.txt", size: "6 KB", status: "Processing", chunks: 0 },
];
export const INSIGHTS = [
  { icon: "target", tone: "hot", t: "142 high-intent users haven't purchased", d: "They opened pricing 2+ times in 7 days. Launch the annual offer with a 24-hour window — projected +$6.1k this month.", cta: "Create campaign" },
  { icon: "clock", tone: "", t: "Best time to message Iran segment", d: "Replies peak 20:00–24:00 local. Schedule broadcasts in this window for ~1.7× reply rate.", cta: "Schedule" },
  { icon: "users", tone: "warn", t: "38 subscribers renew in < 7 days", d: "12 show low activity (churn risk). Trigger the win-back sequence before renewal.", cta: "Trigger win-back" },
];
export const TEAM = [
  { n: "You (Owner)", e: "owner@brand.io", role: "Admin" },
  { n: "Mona S.", e: "mona@brand.io", role: "Agent" },
  { n: "Karim D.", e: "karim@brand.io", role: "Agent" },
];
