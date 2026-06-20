// DailyBrief
import React, { useState, useEffect } from "react";
import { money } from "../../lib/format";
import { Icon } from "../ui";
import { BRIEF_STATS } from "../../i18n";

export function DailyBrief({ t, decisions, onClose, onGoTasks }: any) {
  const b = t.brief;
  const sx = BRIEF_STATS;
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: any; const start = (typeof performance !== "undefined" ? performance.now() : Date.now()); const dur = 900;
    const tick = (now: number) => { const p = Math.min(1, (now - start) / dur); const e = 1 - Math.pow(1 - p, 3); setVal(Math.round(sx.rev * e)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, []);
  const stat = (v: any, l: string) => <div className="db-brief-stat"><b>{v}</b><span>{l}</span></div>;
  return (
    <div className="db-celeb" role="dialog" aria-modal="true" aria-label={b.title} onClick={onClose}>
      <div className="db-brief-card" onClick={(e) => e.stopPropagation()}>
        <div className="db-brief-top"><div className="db-brief-greet"><Icon name="spark" size={14} /> {b.greet}</div><button className="db-celeb-close" aria-label="Close" onClick={onClose}><Icon name="x" size={18} /></button></div>
        <div className="db-brief-title">{b.title}</div>
        <div className="db-brief-hero"><div className="db-brief-herolbl">{b.hero}</div><div className="db-brief-amt" dir="ltr">{money(val)}</div></div>
        <div className="db-brief-stats">{stat(sx.replies, b.repliesL)}{stat(sx.offers, b.offersL)}{stat(sx.closed, b.closedL)}{stat(sx.recovered, b.recoveredL)}</div>
        <button className="db-brief-needs" onClick={onGoTasks}><span className="db-brief-needs-ic"><Icon name="zap" size={15} /></span><span className="db-brief-needs-tx">{b.needs.replace("{n}", String(decisions))}</span><Icon name="chevron" size={16} /></button>
        <div className="db-brief-actions"><button className="db-btn db-btn-mint" onClick={onGoTasks}>{b.cta}</button><button className="db-btn db-btn-ghost" onClick={onClose}>{b.dismiss}</button></div>
        <div className="db-brief-foot">{b.foot}</div>
      </div>
    </div>
  );
}
