// CelebrateModal
import React, { useState, useMemo, useEffect } from "react";
import { fmt, money } from "../../lib/format";
import { Icon } from "../ui";

export function CelebrateModal({ t, kind, value, onClose, onShare, onNewGoal }: any) {
  const c = t.celeb;
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: any; const start = (typeof performance !== "undefined" ? performance.now() : Date.now()); const dur = 1100;
    const tick = (now: number) => { const p = Math.min(1, (now - start) / dur); const e = 1 - Math.pow(1 - p, 3); setN(Math.round(value * e)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const disp = kind === "sales" ? fmt(n) : money(n);
  const PARTS = useMemo(() => { const cols = ["#67E18D", "#C2ECCC", "#D1C9BA", "#67E18D"]; return Array.from({ length: 22 }, (_, i) => ({ left: (i * 4.6 + (i % 3) * 7) % 100, delay: (i % 6) * 90 + (i % 2) * 40, dur: 2600 + (i % 5) * 320, col: cols[i % cols.length], rot: (i * 47) % 360, sway: (i % 2 ? 1 : -1) * (10 + (i % 4) * 6), size: 7 + (i % 3) * 2 })); }, []);
  return (
    <div className="db-celeb" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="db-celeb-parts" aria-hidden="true">{PARTS.map((p, i) => <span key={i} style={{ left: p.left + "%", animationDelay: p.delay + "ms", animationDuration: p.dur + "ms", background: p.col, width: p.size, height: p.size + 4, "--sway": p.sway + "px", "--rot": p.rot + "deg" } as any} />)}</div>
      <div className="db-celeb-card" onClick={(e) => e.stopPropagation()}>
        <div className="db-celeb-bloom" aria-hidden="true" />
        <div className="db-celeb-badge"><Icon name="check" size={30} /></div>
        <div className="db-celeb-kick">{c.kicker}</div>
        <div className="db-celeb-amt">{disp}</div>
        <div className="db-celeb-title">{kind === "sales" ? c.titleSales : c.titleRev}</div>
        <div className="db-celeb-msg">{c.msg}</div>
        <div className="db-celeb-actions"><button className="db-btn db-btn-mint" onClick={onShare}><Icon name="share" size={15} /> {c.share}</button><button className="db-btn db-btn-ghost" onClick={onNewGoal}>{c.newGoal}</button></div>
        <button className="db-celeb-close" aria-label="Close" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
    </div>
  );
}
