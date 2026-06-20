// CampaignComposer
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { Icon, Modal } from "../ui";
import { FUNNEL_PREFILL } from "../../data";

export function CampaignComposer({ t, onClose, prefill }: any) {
  const p = (prefill !== null && prefill !== undefined) ? FUNNEL_PREFILL[prefill] : null;
  const [goal, setGoal] = useState(p ? p.goal : 0);
  const [seg, setSeg] = useState(p ? p.seg : 0);
  const [typ, setTyp] = useState(p ? p.type : 0);
  const [msg, setMsg] = useState(() => p ? t.comp.stageMsg[prefill][0] : t.comp.segMsg[0][0]);
  const [vi, setVi] = useState(0);
  const regen = () => { const pool = (p ? t.comp.stageMsg[prefill] : t.comp.segMsg[seg]) || []; if (!pool.length) return; const ni = (vi + 1) % pool.length; setVi(ni); setMsg(pool[ni]); toast(t.toast.applied); };
  return (
    <Modal title={t.comp.title} onClose={onClose}>
      {p ? (<div className="db-comp-pf"><span className="db-comp-pf-ic"><Icon name="target" size={14} /></span><div style={{ minWidth: 0 }}><div className="t">{t.ov.funnel[prefill]}</div><div className="s"><Icon name="spark" size={11} /> {t.funnelAct[prefill]}</div></div><span className="db-comp-pf-tag">{t.comp.fromFunnel}</span></div>) : null}
      <div className="db-field"><label>{t.comp.goal}</label><select className="db-select" value={goal} onChange={(e) => setGoal(+e.target.value)}>{t.comp.goals.map((o: string, idx: number) => <option key={idx} value={idx}>{o}</option>)}</select></div>
      <div className="db-grid g-2"><div className="db-field"><label>{t.comp.segment}</label><select className="db-select" value={seg} onChange={(e) => setSeg(+e.target.value)}>{t.comp.segments.map((o: string, idx: number) => <option key={idx} value={idx}>{o}</option>)}</select></div><div className="db-field"><label>{t.comp.type}</label><select className="db-select" value={typ} onChange={(e) => setTyp(+e.target.value)}>{t.comp.types.map((o: string, idx: number) => <option key={idx} value={idx}>{o}</option>)}</select></div></div>
      <div className="db-field"><label>{t.comp.preview}</label>
        <div className="db-aiedit">
          <div className="db-aiedit-bar"><span className="tag"><Icon name="spark" size={11} /> {t.comp.preview}</span><button type="button" className="rgen" onClick={regen}><Icon name="bot" size={12} /> {t.comp.regen}</button></div>
          <textarea className="db-aiedit-area" value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} aria-label={t.comp.preview} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}><button className="db-btn db-btn-mint" style={{ flex: 1 }} onClick={() => { toast(t.toast.created); onClose(); }}><Icon name="send" size={15} /> {t.comp.launch}</button><button className="db-btn db-btn-ghost" onClick={onClose}>{t.comp.cancel}</button></div>
    </Modal>
  );
}
