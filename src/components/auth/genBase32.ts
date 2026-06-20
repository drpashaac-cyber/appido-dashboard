// genBase32
export function genBase32(len: number) { const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; let s = ""; for (let i = 0; i < len; i++) s += A[Math.floor(Math.random() * A.length)]; return s; }
