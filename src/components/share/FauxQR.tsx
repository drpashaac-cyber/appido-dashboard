// FauxQR
import React from "react";

export function FauxQR({ value, size = 176 }: any) {
  // PROTOTYPE placeholder. Production renders a real, scannable QR of the otpauth:// URI with a
  // client-side library (e.g. qrcode.react) — the TOTP secret is NEVER sent to a server or 3rd party.
  const N = 25; const cell = size / N;
  let h = 2166136261; for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  let st = h >>> 0; const rnd = () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; st >>>= 0; return st / 4294967296; };
  const finder = (r: number, col: number) => { const f = (R: number, C: number) => { const rr = r - R, cc = col - C; if (rr < 0 || cc < 0 || rr > 6 || cc > 6) return null; if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true; if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true; return false; }; const a = f(0, 0); if (a !== null) return a; const b = f(0, N - 7); if (b !== null) return b; const d = f(N - 7, 0); if (d !== null) return d; return undefined; };
  const rects: any[] = [];
  for (let r = 0; r < N; r++) for (let col = 0; col < N; col++) { const fr = finder(r, col); const on = fr === undefined ? rnd() > 0.5 : fr; if (on) rects.push(<rect key={r + "-" + col} x={col * cell} y={r * cell} width={cell + 0.6} height={cell + 0.6} />); }
  return <svg width={size} height={size} viewBox={"0 0 " + size + " " + size} className="db-qr" role="img" aria-label="QR"><rect width={size} height={size} fill="#F4F1E6" /><g fill="#1A312B">{rects}</g></svg>;
}
