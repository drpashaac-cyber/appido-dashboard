// JourneysView
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { Icon, PageHead } from "../ui";
import { FlowStep } from "./FlowStep";
import { BlockPickerModal } from "./BlockPickerModal";
import { StepEditModal } from "./StepEditModal";
import { newFlowStep } from "./newFlowStep";
import { starterFlow } from "./starterFlow";

export function JourneysView({ t, onPlaybooks }: any) {
  const F = t.flow;
  const [region, setRegion] = useState("ir");
  const [steps, setSteps] = useState<any[]>(() => starterFlow(F, "ir"));
  const [picker, setPicker] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const editing = steps.find((s) => s.id === editId) || null;
  const add = (type: string) => { const s = newFlowStep(type, F, region); setSteps((p) => [...p, s]); setPicker(false); setEditId(s.id); };
  const update = (id: string, patch: any) => setSteps((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => setSteps((p) => p.filter((s) => s.id !== id));
  const smart = () => { setSteps(starterFlow(F, region)); toast(F.suggested); };
  return (
    <>
      <PageHead title={F.title} sub={F.sub}><button className="db-btn db-btn-mint" onClick={() => onPlaybooks && onPlaybooks()}><Icon name="grid" size={15} /> {t.pb.title}</button></PageHead>
      <div className="db-flowbar">
        <div className="db-field" style={{ margin: 0, flex: 1, maxWidth: 280 }}><label>{F.region}</label><select className="db-select" value={region} onChange={(e) => setRegion(e.target.value)}>{Object.keys(F.regions).map((kk) => <option key={kk} value={kk}>{F.regions[kk]}</option>)}</select></div>
        <button className="db-btn db-btn-ghost db-btn-sm" onClick={smart}><Icon name="spark" size={15} /> {F.suggest}</button>
      </div>
      <div className="db-tipbar"><span className="ic"><Icon name="bot" size={16} /></span><div style={{ minWidth: 0 }}><b>{F.tipTitle}</b><span>{F.tipBody}</span></div></div>
      <div className="db-card db-pad">
        <div className="db-flow">
          {steps.map((s, i) => <FlowStep key={s.id} step={s} n={i + 1} last={i === steps.length - 1} t={t} onEdit={() => setEditId(s.id)} onDelete={() => remove(s.id)} />)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
        <button className="db-btn db-btn-mint db-btn-sm" onClick={() => setPicker(true)}><Icon name="plus" size={15} /> {F.addStep}</button>
        <span style={{ marginInlineStart: "auto" }} />
        <span className="db-chip"><Icon name="check" size={12} /> {t.jr.live}</span>
      </div>
      {picker && <BlockPickerModal t={t} onPick={add} onClose={() => setPicker(false)} />}
      {editing && <StepEditModal t={t} step={editing} region={region} onSave={(patch: any) => { update(editing.id, patch); setEditId(null); }} onClose={() => setEditId(null)} />}
    </>
  );
}
