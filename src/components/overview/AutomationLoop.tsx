// AutomationLoop
import React from "react";
import { track } from "../../lib/telemetry";
import { Icon } from "../ui";
import { LOOP_ICONS, LOOP_VIEWS } from "../../data";

export function AutomationLoop({ t, setView }: any) {
  const a = t.autoloop;
  return (
    <section className="db-autoloop">
      <div className="db-autoloop-head">
        <span className="ic"><Icon name="zap" size={18} /></span>
        <div style={{ minWidth: 0 }}><div className="ti">{a.title}</div><div className="su">{a.sub}</div></div>
      </div>
      <div className="db-autoloop-track">
        {a.stages.map((s: any, i: number) => (
          <div className="db-loopitem" key={i}>
            <button type="button" className="db-loopstage" onClick={() => setView && setView(LOOP_VIEWS[i])}>
              <span className="ls-ic"><Icon name={LOOP_ICONS[i] || "dot"} size={16} /></span>
              <div className="ls-t">{s.t}</div>
              <div className="ls-d">{s.d}</div>
            </button>
            {i < a.stages.length - 1 ? <span className="db-loop-arrow"><Icon name="chevron" size={14} /></span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
