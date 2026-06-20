// Chart primitives: sparkline, area chart, donut (pure SVG).
import React from "react";
import { cx } from "../../lib/format";

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return pts.length ? `M ${pts[0][0]},${pts[0][1]}` : "";
  const d = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`);
  }
  return d.join(" ");
}

export const Sparkline = React.memo(function Sparkline({ data, color = "var(--mint-bri)", h = 34 }: { data: number[]; color?: string; h?: number }) {
  const w = 90, max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * w, h - ((d - min) / rng) * (h - 4) - 2] as [number, number]);
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.6} fill={color} />
    </svg>
  );
});

export const AreaChart = React.memo(function AreaChart({ data }: { data: number[] }) {
  const w = 720, h = 200, pad = 8;
  const max = Math.max(...data), min = Math.min(...data) * 0.9, rng = max - min || 1;
  const X = (i: number) => (i / (data.length - 1)) * w;
  const Y = (d: number) => h - pad - ((d - min) / rng) * (h - pad * 2);
  const pts = data.map((d, i) => [X(i), Y(d)] as [number, number]);
  const lineD = smoothPath(pts);
  const areaD = `${lineD} L ${w},${h} L 0,${h} Z`;
  const lastTop = (Y(data[data.length - 1]) / h) * 100;
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--mint-bri)" stopOpacity="0.35" /><stop offset="100%" stopColor="var(--mint-bri)" stopOpacity="0" /></linearGradient></defs>
        <path d={areaD} fill="url(#rev)" />
        <path d={lineD} fill="none" stroke="var(--mint-bri)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="db-area-dot" style={{ right: -1, top: lastTop + "%" }} />
    </div>
  );
});

export const Donut = React.memo(function Donut({ segs, size = 132 }: { segs: { l: string; v: number; c: string }[]; size?: number }) {
  const r = 54, c = 2 * Math.PI * r; let off = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" aria-hidden="true">
      <g transform="rotate(-90 66 66)">
        {segs.map((s, i) => { const len = (s.v / 100) * c; const el = <circle key={i} cx="66" cy="66" r={r} fill="none" stroke={s.c} strokeWidth={18} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-off} />; off += len; return el; })}
      </g>
      <text x="66" y="62" textAnchor="middle" fontSize="22" fontWeight="750" fill="var(--text)" fontFamily="var(--mono)">{segs[0].v}%</text>
      <text x="66" y="80" textAnchor="middle" fontSize="11" fill="var(--text-2)">{segs[0].l}</text>
    </svg>
  );
});
