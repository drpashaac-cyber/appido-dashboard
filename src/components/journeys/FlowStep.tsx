// FlowStep
import React from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";
import { FlowSummary } from "./FlowSummary";
import { flowMeta } from "./flowMeta";

export function FlowStep({ step, n, last, t, onEdit, onDelete }: any) {
  const meta = flowMeta(step.type, t.flow);
  return (
    <div className={cx("db-step", meta.kind)}>
      <div className="rail"><span className="db-stepn">{n}</span>{last ? null : <span className="db-line" />}</div>
      <div className="db-stepbody">
        <div className="db-stepcard">
          <div className="sh"><span className="si"><Icon name={meta.icon} size={14} /></span>{meta.name}
            <span style={{ marginInlineStart: "auto", display: "flex", gap: 4 }}>
              <button className="db-mini" onClick={onEdit} aria-label="Edit"><Icon name="edit" size={14} /></button>
              {step.type !== "welcome" ? <button className="db-mini danger" onClick={onDelete} aria-label="Delete"><Icon name="trash" size={14} /></button> : null}
            </span>
          </div>
          <FlowSummary step={step} t={t} />
        </div>
      </div>
    </div>
  );
}
