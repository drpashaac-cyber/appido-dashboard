// FirstWinModal
import React, { useState, useEffect } from "react";
import { fmt, money } from "../../lib/format";
import { Icon } from "../ui";

export function FirstWinModal({ t, leads, onActivate, onClose }: any) {
  const f = t.fw;
  const n = leads || 820;
  const recoverable = Math.round(n * 11.2);
  const dormant = Math.round(n * 0.42);
  const winback = Math.round(n * 0.11);
  const hot = Math.max(1, Math.round(n * 0.015));
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: any; const start = (typeof performance !== "undefined" ? performance.now() : Date.now()); const dur = 1100;
    const tick = (now: number) => { const p = Math.min(1, (now - start) / dur); const e = 1 - Math.pow(1 - p, 3); setVal(Math.round(recoverable * e)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [recoverable]);
  return (
    <div className="db-celeb" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="db-celeb-card db-fw-card" onClick={(e) => e.stopPropagation()}>
        <div className="db-celeb-bloom" aria-hidden="true" />
        <div className="db-celeb-badge"><Icon name="bot" size={28} /></div>
        <div className="db-celeb-kick">{f.kicker.replace("{n}", fmt(n))}</div>
        <div className="db-celeb-amt">~{money(val)}</div>
        <div className="db-celeb-title">{f.title}</div>
        <div className="db-fw-break">
          <div className="db-fw-b"><b>{fmt(dormant)}</b><span>{f.dormant}</span></div>
          <div className="db-fw-b"><b>{fmt(winback)}</b><span>{f.winback}</span></div>
          <div className="db-fw-b"><b>{fmt(hot)}</b><span>{f.hot}</span></div>
        </div>
        <div className="db-celeb-msg">{f.msg}</div>
        <div className="db-celeb-actions"><button className="db-btn db-btn-mint" onClick={onActivate}><Icon name="zap" size={15} /> {f.activate}</button><button className="db-btn db-btn-ghost" onClick={onClose}>{f.later}</button></div>
        <button className="db-celeb-close" aria-label="Close" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
    </div>
  );
}
