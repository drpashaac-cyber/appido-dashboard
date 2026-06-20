// FlowToggle
import React from "react";
import { cx } from "../../lib/format";

export function FlowToggle({ on, label, desc, onChange }: any) {
  return (
    <button type="button" className={cx("db-toggle", on && "on")} onClick={() => onChange(!on)}>
      <div style={{ minWidth: 0, textAlign: "start" }}><div className="tl">{label}</div>{desc ? <div className="td">{desc}</div> : null}</div>
      <span className="tk"><span className="tb" /></span>
    </button>
  );
}
