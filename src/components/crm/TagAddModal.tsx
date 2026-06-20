// TagAddModal
import React, { useState } from "react";
import { Icon, Modal } from "../ui";

export function TagAddModal({ t, existing, onAdd, onClose }: any) {
  const f = t.dflow;
  const preset = Object.keys(t.drawer.tagset).filter((k) => !existing.includes(k));
  const [custom, setCustom] = useState("");
  return (
    <Modal title={f.tagTitle} onClose={onClose}>
      {preset.length ? (<div className="db-field"><label>{f.tagPreset}</label><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{preset.map((k) => <button key={k} className="db-chip" style={{ cursor: "pointer" }} onClick={() => onAdd(k)}><Icon name="plus" size={12} /> {t.drawer.tagset[k]}</button>)}</div></div>) : null}
      <div className="db-field"><label>{f.tagCustom}</label><input className="db-wiz-input" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={f.tagPh} /></div>
      <button className="db-btn db-btn-mint" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} disabled={!custom.trim()} onClick={() => onAdd(custom.trim())}><Icon name="plus" size={15} /> {f.tagAdd}</button>
    </Modal>
  );
}
