// BlockPickerModal
import React from "react";
import { cx } from "../../lib/format";
import { Icon, Modal } from "../ui";
import { flowMeta } from "./flowMeta";

export function BlockPickerModal({ t, onPick, onClose }: any) {
  const F = t.flow;
  const groups: [string, string[]][] = [["msg", ["welcome", "message", "delay"]], ["ask", ["askName", "askPhone", "askChoice"]], ["sell", ["payment", "deliver"]], ["logic", ["aiEval", "condition"]]];
  return (
    <Modal title={F.pickTitle} onClose={onClose}>
      <p className="db-muted" style={{ marginTop: -4, marginBottom: 14, fontSize: 13, lineHeight: 1.5 }}>{F.pickSub}</p>
      {groups.map(([g, types]) => (
        <div key={g} className="db-field">
          <label>{F.grp[g]}</label>
          <div className="db-blockgrid">
            {types.map((ty) => { const m = flowMeta(ty, F); return (
              <button key={ty} className="db-block" onClick={() => onPick(ty)}>
                <span className={cx("bi", m.kind)}><Icon name={m.icon} size={16} /></span>
                <div style={{ minWidth: 0 }}><div className="bn">{m.name}</div><div className="bd">{F.ty[ty][1]}</div></div>
              </button>
            ); })}
          </div>
        </div>
      ))}
    </Modal>
  );
}
