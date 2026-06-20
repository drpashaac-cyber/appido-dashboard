// Deterministic on-chain receipt data (USDT TRC20 / BEP20 / TON). Pure.

export function rndSeed(seed: number) { let s = (seed * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
export function hexOf(r: () => number, len: number) { const h = "0123456789abcdef"; let o = ""; for (let i = 0; i < len; i++) o += h[Math.floor(r() * 16)]; return o; }
export function b58Of(r: () => number, len: number) { const b = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; let o = ""; for (let i = 0; i < len; i++) o += b[Math.floor(r() * b.length)]; return o; }
export function agoToDate(s: string) { const m = String(s || "").match(/(\d+)\s*([hdm])/); const now = Date.now(); if (!m) return new Date(now); const n = +m[1]; const mult = m[2] === "d" ? 86400000 : m[2] === "m" ? 60000 : 3600000; return new Date(now - n * mult); }
export function seedOf(o: any) { const str = String((o && (o.name || "")) + (o && (o.amount || "")) + (o && (o.gw || ""))); let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h || 7; }
export function makeReceipt(seed: number, gw: string) {
  const r = rndSeed(seed);
  const isBep = /BEP20/.test(gw); const isTon = /TON/.test(gw);
  const net = isBep
    ? { chain: "BNB Smart Chain", net: "BEP20", explorer: "BscScan", url: "https://bscscan.com/tx/", conf: 15 }
    : isTon
    ? { chain: "TON", net: "TON", explorer: "Tonviewer", url: "https://tonviewer.com/transaction/", conf: 24 }
    : { chain: "Tron", net: "TRC20", explorer: "Tronscan", url: "https://tronscan.org/#/transaction/", conf: 19 };
  const hash = isBep ? "0x" + hexOf(r, 64) : hexOf(r, 64);
  const addr = () => (isBep ? "0x" + hexOf(r, 40) : isTon ? "UQ" + b58Of(r, 46) : "T" + b58Of(r, 33));
  const block = 40000000 + Math.floor(r() * 9000000);
  return { token: "USDT", chain: net.chain, net: net.net, explorer: net.explorer, url: net.url, conf: net.conf, hash, from: addr(), to: addr(), block };
}
