// ProductEditorModal
import React, { useState, useRef } from "react";
import { cx, flowUid } from "../../lib/format";
import { catDeliver } from "../../lib/catalog";
import { Icon, Modal, Switch } from "../ui";
import { CATS } from "../../data";

export function ProductEditorModal({ t, init, onClose, onSave }: any) {
  const p = t.prod;
  const periods = ["monthly", "yearly", "lifetime"];
  const [name, setName] = useState(init.name || "");
  const [cat, setCat] = useState(init.cat || "");
  const [desc, setDesc] = useState(init.desc || "");
  const [doc, setDoc] = useState(init.doc || "");
  const [active, setActive] = useState(init.active !== false);
  const [plans, setPlans] = useState<any[]>(init.plans && init.plans.length ? init.plans.map((x: any) => ({ ...x })) : [{ id: flowUid(), period: "monthly", price: "" }]);
  const [discounts, setDiscounts] = useState<any[]>(init.discounts ? init.discounts.map((x: any) => ({ ...x, percent: String(x.percent ?? "10") })) : []);
  const [files, setFiles] = useState<any[]>(init.files ? init.files.map((x: any) => ({ ...x })) : []);
  const fileRef = useRef<any>(null);
  const setPlan = (id: string, patch: any) => setPlans((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
  const setDisc = (id: string, patch: any) => setDiscounts((a) => a.map((x) => x.id === id ? { ...x, ...patch } : x));
  const canSave = !!name.trim() && plans.some((pl) => String(pl.price).trim());
  const submit = () => onSave({ ...init, name: name.trim(), cat: cat.trim(), desc: desc.trim(), doc: doc.trim(), active, files, plans: plans.filter((pl) => String(pl.price).trim()), discounts: discounts.filter((d) => String(d.code).trim()).map((d) => ({ ...d, percent: Number(d.percent) || 0 })) });
  return (
    <Modal title={init.id ? p.editTitle : p.newBtn} onClose={onClose}>
      <div className="db-field"><label>{p.nameL}</label><input className="db-wiz-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={p.namePh} /></div>
      <div className="db-field"><label>{p.catL}</label><select className="db-select" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">{p.catPick}</option>{CATS.map((c) => <option key={c.key} value={c.key}>{p.cats[c.key]}</option>)}</select>{cat && catDeliver(cat) ? <div className="db-noteline" style={{ marginTop: 8 }}><Icon name="send" size={13} /> {p.deliverL}: <b style={{ fontWeight: 700 }}>{p.deliver[catDeliver(cat) as string]}</b></div> : null}</div>
      <div className="db-field"><label>{p.descL}</label><input className="db-wiz-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={p.descPh} /></div>
      <div className="db-field"><label>{p.plansL}</label>
        <div className="db-planedit">
          {plans.map((pl) => (
            <div key={pl.id} className="db-planedit-row">
              <div className="db-seg db-seg-wrap" style={{ flex: "1 1 150px" }}>{periods.map((per) => <button key={per} type="button" className={cx(pl.period === per && "on")} onClick={() => setPlan(pl.id, { period: per })}>{p.per[per]}</button>)}</div>
              <input className="db-wiz-input db-planedit-price" dir="ltr" value={pl.price} onChange={(e) => setPlan(pl.id, { price: e.target.value })} placeholder="$29" />
              <button className="db-mini danger" type="button" aria-label={t.drawer.del} onClick={() => setPlans((a) => a.filter((x) => x.id !== pl.id))} disabled={plans.length <= 1}><Icon name="trash" size={14} /></button>
            </div>
          ))}
          <button className="db-btn db-btn-ghost db-btn-sm" type="button" onClick={() => setPlans((a) => [...a, { id: flowUid(), period: "monthly", price: "" }])}><Icon name="plus" size={14} /> {p.addPlan}</button>
        </div>
      </div>
      <div className="db-field"><label>{p.discL}</label>
        <div className="db-planedit">
          {discounts.map((d) => (
            <div key={d.id} className="db-planedit-row">
              <input className="db-wiz-input" style={{ flex: "1 1 120px" }} value={d.code} onChange={(e) => setDisc(d.id, { code: e.target.value.toUpperCase() })} placeholder={p.codePh} />
              <div className="db-discpct"><input className="db-wiz-input" dir="ltr" inputMode="numeric" value={d.percent} onChange={(e) => { let v = e.target.value.replace(/[^0-9]/g, ""); if (v) v = String(Math.min(100, parseInt(v, 10))); setDisc(d.id, { percent: v }); }} placeholder="10" /><span className="db-muted">% {p.off}</span></div>
              <button className="db-mini danger" type="button" aria-label={t.drawer.del} onClick={() => setDiscounts((a) => a.filter((x) => x.id !== d.id))}><Icon name="trash" size={14} /></button>
            </div>
          ))}
          <button className="db-btn db-btn-ghost db-btn-sm" type="button" onClick={() => setDiscounts((a) => [...a, { id: flowUid(), code: "", percent: "10" }])}><Icon name="plus" size={14} /> {p.addDisc}</button>
        </div>
      </div>
      <div className="db-field"><label>{p.docL}</label>
        <textarea className="db-wiz-input db-prod-doc" rows={4} value={doc} onChange={(e) => setDoc(e.target.value)} placeholder={p.docPh} />
        {files.length ? <div className="db-filelist">{files.map((f) => <span key={f.id} className="db-filechip"><Icon name="file" size={12} /> <span className="nm">{f.name}</span><button type="button" aria-label={t.drawer.del} onClick={() => setFiles((a) => a.filter((x) => x.id !== f.id))}><Icon name="x" size={12} /></button></span>)}</div> : null}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.md,.rtf" multiple style={{ display: "none" }} onChange={(e) => { const picked = Array.from((e.target as any).files || []).map((f: any) => ({ id: flowUid(), name: f.name })); if (picked.length) setFiles((a) => [...a, ...picked]); (e.target as any).value = ""; }} />
        <button className="db-btn db-btn-ghost db-btn-sm" type="button" style={{ marginTop: 10 }} onClick={() => fileRef.current && fileRef.current.click()}><Icon name="upload" size={14} /> {p.addFile} <span className="db-muted" style={{ fontWeight: 400 }}>· {p.fileTypes}</span></button>
        <div className="db-noteline" style={{ marginTop: 10 }}><Icon name="spark" size={13} /> {p.docNote}</div>
      </div>
      <div className="db-toggle-row" style={{ marginTop: 4 }}><span>{p.activeL}</span><Switch on={active} onClick={() => setActive(!active)} label={p.activeL} /></div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>{p.cancel}</button>
        <button className="db-btn db-btn-mint" style={{ flex: 1, justifyContent: "center" }} disabled={!canSave} onClick={submit}>{p.save}</button>
      </div>
    </Modal>
  );
}
