// Device fingerprint for session display.

export function deviceInfo() {
  if (typeof navigator === "undefined") return { browser: "—", os: "—", screen: "—", tz: "—" };
  const ua = navigator.userAgent || "";
  let os = "Unknown";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  let browser = "Browser";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  const screen = (typeof window !== "undefined" && window.screen) ? `${window.screen.width}×${window.screen.height}` : "—";
  let tz = "—"; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "—"; } catch (e) { /* noop */ }
  return { browser, os, screen, tz };
}
