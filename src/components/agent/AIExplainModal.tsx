// AIExplainModal
import React, { useState } from "react";
import { cx, money, initials } from "../../lib/format";
import { Icon } from "../ui";
import { AI_CLOSES } from "../../data";

export function AIExplainModal({ t, onClose, onAdjust }: any) {
  const x = t.xai;
  const [sel, setSel] = useState<number | null>(null);
  const cur = sel != null ? AI_CLOSES[sel] : null;
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-xai" onClick={(e) => e.stopPropagation()}>
        <div className="db-xai-head">
          {cur ? <button className="db-xai-back" onClick={() => setSel(null)}><Icon name="chevron" size={16} /> {x.back}</button> : <div className="db-xai-title">{x.closedTitle}</div>}
          <button className="db-xai-x" aria-label="Close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        {!cur ? (
          <div>
            <div className="db-xai-hero"><b>{money(32800)}</b><span>{x.ofRevenue}</span></div>
            <div className="db-xai-attr"><Icon name="shield" size={15} /> <span>{x.attribution}</span></div>
            <div className="db-xai-lab">{x.recent}</div>
            <div className="db-xai-list">
              {AI_CLOSES.map((c, i) => (
                <button key={i} type="button" className="db-xai-row" onClick={() => setSel(i)}>
                  <span className="db-xai-av">{initials(c.who)}</span>
                  <span className="db-xai-rl"><span className="n">{c.who}</span><span className="m">{c.auto ? x.fullyAuto : x.youApproved} · {x.when[c.whenKey]}</span></span>
                  <span className="db-xai-amt">{money(c.amount)}</span>
                  <Icon name="chevron" size={16} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="db-xai-d-top"><span className="db-xai-av lg">{initials(cur.who)}</span><div><div className="db-xai-d-name">{cur.who}</div><div className="db-xai-d-sub">{cur.auto ? x.fullyAuto : x.youApproved} · {money(cur.amount)} · {x.paidVia} {cur.gw}</div></div></div>
            <div className="db-xai-conf"><div className="r"><span>{x.confidence}</span><b>{cur.conf}%</b></div><div className="bar"><i style={{ width: cur.conf + "%" }} /></div></div>
            <div className="db-xai-lab">{x.signalsLab}</div>
            <div className="db-xai-sigs">{cur.signals.map((sg: string, i: number) => <span key={i} className="db-xai-sig"><Icon name="check" size={12} /> {sg}</span>)}</div>
            <div className="db-xai-lab">{x.timelineLab}</div>
            <div className="db-xai-tl">{cur.timeline.map((st: any, i: number) => <div key={i} className="db-xai-step"><span className="ic"><Icon name={st.ic} size={14} /></span><div className="m"><div className="t">{x.steps[st.k]}</div><div className="d">{st.d}</div></div></div>)}</div>
            <div className="db-xai-lab">{x.convoLab}</div>
            <div className="db-xai-convo">{cur.convo.map((m: any, i: number) => <div key={i} className={cx("db-xai-bub", m.me ? "me" : "them")} dir="auto">{m.x}</div>)}</div>
            <button className="db-btn db-btn-ghost db-btn-sm db-xai-adjust" onClick={onAdjust}><Icon name="settings" size={13} /> {x.adjustAuto}</button>
          </div>
        )}
      </div>
    </div>
  );
}
