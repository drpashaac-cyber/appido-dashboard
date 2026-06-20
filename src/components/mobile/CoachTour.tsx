// CoachTour
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";

export function CoachTour({ steps, t, onClose }: any) {
  const [i, setI] = useState(0);
  const last = i === steps.length - 1;
  const s = steps[i];
  return (
    <div className="db-tour-bg" onClick={onClose}>
      <div className="db-tour" role="dialog" aria-label={s.t} onClick={(e) => e.stopPropagation()}>
        <div className="db-tour-top">
          <span className="db-tour-badge"><Icon name="spark" size={15} /></span>
          <span className="db-tour-count">{i + 1} / {steps.length}</span>
          <button className="db-tour-skip" onClick={onClose}>{t.common.tourSkip}</button>
        </div>
        <div className="db-tour-title">{s.t}</div>
        <div className="db-tour-body">{s.d}</div>
        <div className="db-tour-dots">{steps.map((_: any, k: number) => <span key={k} className={cx("dot", k === i && "on")} />)}</div>
        <div className="db-tour-foot">
          {i > 0 ? <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setI(i - 1)}>{t.common.tourBack}</button> : <span />}
          <button className="db-btn db-btn-mint db-btn-sm" onClick={() => last ? onClose() : setI(i + 1)}>{last ? t.common.tourDone : t.common.tourNext}</button>
        </div>
      </div>
    </div>
  );
}
