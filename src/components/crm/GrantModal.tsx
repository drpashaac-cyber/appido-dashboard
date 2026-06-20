// GrantModal
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon, Modal } from "../ui";
import { PLAN_NAMES } from "../../i18n";

export function GrantModal({ t, onClose, onConfirm }: any) {
  const f = t.dflow;
  const [pi, setPi] = useState(0);
  const [di, setDi] = useState(0);
  const days = [30, 90];
  return (
    <Modal title={f.grantT} onClose={onClose}>
      <div className="db-field"><label>{f.grantPick}</label>
        <div className="db-seg db-seg-wrap">{PLAN_NAMES.map((nm: string, i: number) => <button key={i} className={cx(pi === i && "on")} onClick={() => setPi(i)}>{nm}</button>)}</div>
      </div>
      <div className="db-field"><label>{f.grantDur}</label>
        <div className="db-seg db-seg-wrap">{days.map((d, i) => <button key={i} className={cx(di === i && "on")} onClick={() => setDi(i)}>{f.grantDays.replace("{n}", String(d))}</button>)}</div>
      </div>
      <button className="db-btn db-btn-mint" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={onConfirm}><Icon name="coin" size={15} /> {f.grantBtn}</button>
    </Modal>
  );
}
