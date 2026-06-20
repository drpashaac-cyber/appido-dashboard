// Lead scoring helpers.

export function leadScoreOf(c: any) {
  const tt = String(c.t || c.time || "");
  const rec = /m$/.test(tt) ? 100 : /h$/.test(tt) ? 80 : (/^1d|yester/i.test(tt) ? 55 : 35);
  const eng = (c.ltv && c.ltv > 0) ? 100 : ((c.intent || 0) >= 60 ? 70 : 40);
  return Math.max(1, Math.min(100, Math.round((c.intent || 0) * 0.55 + rec * 0.25 + eng * 0.20)));
}

export function scoreBand(sc: number) { return sc >= 80 ? "hot" : sc >= 55 ? "warm" : "cold"; }
