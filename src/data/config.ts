// Misc config constants (endpoints, flow/payment method maps, current totals).

export const ANALYTICS_ENDPOINT = "/collect";
export const FLOW_REGION_METHODS: Record<string, string[]> = {
  ir: ["zarinpal", "card", "usdt"],
  cis: ["card", "usdt", "yoomoney"],
  tr: ["papara", "card", "usdt"],
  eu: ["visa", "paypal", "usdt"],
  global: ["usdt", "visa", "paypal"],
};
export const FLOW_STEP_META: Record<string, { icon: string; kind: string }> = {
  welcome: { icon: "spark", kind: "trigger" }, askName: { icon: "user", kind: "action" }, askPhone: { icon: "phone", kind: "action" }, askChoice: { icon: "list", kind: "action" }, message: { icon: "send", kind: "action" }, payment: { icon: "coin", kind: "action" }, deliver: { icon: "gift", kind: "action" }, condition: { icon: "filter", kind: "cond" }, aiEval: { icon: "bot", kind: "ai" }, delay: { icon: "clock", kind: "action" },
};
export const PAY_METHODS = [
  { id: "zarinpal", group: "instant", needs: "key" },
  { id: "idpay", group: "instant", needs: "key" },
  { id: "nextpay", group: "instant", needs: "key" },
  { id: "stripe", group: "instant", needs: "key" },
  { id: "paypal", group: "instant", needs: "key" },
  { id: "usdt_trc20", group: "crypto", needs: "wallet" },
  { id: "usdt_bep20", group: "crypto", needs: "wallet" },
  { id: "usdt_ton", group: "crypto", needs: "wallet" },
  { id: "card", group: "manual", needs: "none" },
];
export const CUR_REV = 48250, CUR_SALES = 127;
