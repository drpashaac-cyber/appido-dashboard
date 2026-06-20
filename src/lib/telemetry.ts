// Telemetry: internal buffer + consent. Public surface = track / identify / setTelemetryConsent.
import { deviceInfo } from "./device";
import { ANALYTICS_ENDPOINT } from "../data";

let _prospect: any = null;

const _events: any[] = [];

let _consent = { analytics: false, marketing: false };

export function setTelemetryConsent(c: any) { _consent = { ..._consent, ...c }; }

function telemetryContext() {
  const d = (typeof deviceInfo === "function") ? deviceInfo() : { os: "—", browser: "—", screen: "—", tz: "—" };
  let referrer = "", utm: any = {}, path = "";
  if (typeof window !== "undefined") {
    try {
      referrer = (typeof document !== "undefined" && document.referrer) || "";
      path = window.location ? window.location.pathname : "";
      const q = new URLSearchParams(window.location ? window.location.search : "");
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => { const v = q.get(k); if (v) utm[k] = v; });
    } catch (e) {}
  }
  return { device: d, geo: { tz: d.tz }, locale: (typeof navigator !== "undefined" && (navigator as any).language) || "", referrer, utm, path, ts: Date.now() };
}

function initProspect() {
  if (_prospect) return _prospect;
  const ctx = telemetryContext();
  _prospect = { id: "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36), traits: {}, firstSeen: ctx.ts, acquisition: { referrer: ctx.referrer, utm: ctx.utm } };
  return _prospect;
}

export function identify(traits: any) {
  if (!_consent.analytics) return; // PII only with consent
  initProspect();
  _prospect.traits = { ...(_prospect.traits || {}), ...traits, identifiedAt: new Date().toISOString() };
  flushTelemetry();
}

export function track(event: string, props?: any) {
  if (!_consent.analytics) return; // consent-gated: no non-essential tracking without opt-in
  const p = initProspect();
  const e = { pid: p.id, event, props: props || {}, traits: p.traits, ctx: telemetryContext(), at: new Date().toISOString() };
  _events.push(e); p.lastSeen = e.at;
  // prod: navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(e))  (fallback: fetch keepalive)
  try { if (typeof console !== "undefined" && console.debug) console.debug("[appido:event]", event, props || {}); } catch (e2) {}
  flushTelemetry();
}

function flushTelemetry() {
  // prod: debounced batch POST of _events -> ANALYTICS_ENDPOINT (sendBeacon / fetch keepalive);
  // prototype: events accumulate in the in-memory _events buffer (ready for a real transport).
}
