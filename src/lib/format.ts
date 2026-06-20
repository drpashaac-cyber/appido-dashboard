// Pure formatting + locale helpers. No side effects, SSR-safe.

export const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
export const fmt = (n: number) => n.toLocaleString("en-US");
export const money = (n: number) => "$" + n.toLocaleString("en-US");
export function fmtDate(d: Date, lang: string) {
  const ca = lang === "fa" ? "persian" : lang === "ar" ? "islamic" : "gregory";
  try {
    const p = new Intl.DateTimeFormat("en-u-ca-" + ca, { year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
    const g = (k: string) => { const f = p.find((x: any) => x.type === k); return f ? f.value : ""; };
    return g("year") + "/" + g("month") + "/" + g("day");
  } catch (e) { return d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0"); }
}
export function fmtDateTime(d: Date, lang: string) {
  let tm = "";
  try { tm = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d); } catch (e) { tm = ""; }
  return fmtDate(d, lang) + (tm ? " " + tm : "");
}
export function detectLang(): string {
  const supported = ["en", "fa", "ar", "tr", "ru"];
  try {
    if (typeof navigator === "undefined") return "en";
    const nav: any = navigator;
    const list: string[] = (nav.languages && nav.languages.length) ? nav.languages : (nav.language ? [nav.language] : []);
    for (const l of list) { const code = String(l).toLowerCase().slice(0, 2); if (supported.indexOf(code) >= 0) return code; }
    if (list.length > 0 && typeof Intl !== "undefined" && (Intl as any).DateTimeFormat) {
      const tz = (Intl as any).DateTimeFormat().resolvedOptions().timeZone || "";
      const tzMap: Record<string, string> = { Tehran: "fa", Istanbul: "tr", Ankara: "tr", Moscow: "ru", "Saint_Petersburg": "ru", Minsk: "ru", Kyiv: "ru", Kiev: "ru", Almaty: "ru", Tashkent: "ru", Baku: "ru", Yerevan: "ru", Dubai: "ar", Riyadh: "ar", Baghdad: "ar", Doha: "ar", Kuwait: "ar", Cairo: "ar", Amman: "ar", Beirut: "ar" };
      for (const key in tzMap) { if (tz.indexOf(key) >= 0) return tzMap[key]; }
    }
  } catch (e) {}
  return "en";
}

// --- additional pure helpers ---
export const relWhen = (ago: any, t: any) => ago.u === "now" ? t.security.now : ago.u === "h" ? ago.n + " " + t.security.hrs : ago.n === 1 ? t.security.yesterday : ago.n + " " + t.security.days;
export const heatColor = (v: number) => ["var(--line)", "rgba(103,225,141,.25)", "rgba(103,225,141,.45)", "rgba(103,225,141,.7)", "var(--mint-bri)"][v];
export const initials = (n: string) => n.replace(/[@(].*/,"").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
export const flowUid = () => Math.random().toString(36).slice(2, 9);

export function maskCred(v: string) { const x = String(v || "").trim(); if (!x) return ""; return x.length <= 6 ? "\u2022\u2022\u2022\u2022" : "\u2022\u2022\u2022\u2022\u2022\u2022" + x.slice(-4); }
export function todayKey() { try { return new Date().toISOString().slice(0, 10); } catch (e) { return ""; } }
export function buzz(ms: number) { try { const n: any = navigator; if (n && typeof n.vibrate === "function") n.vibrate(ms); } catch (e) {} }
