// StepEditModal
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { catDeliver } from "../../lib/catalog";
import { Icon, Modal } from "../ui";
import { PRODUCTS, FLOW_REGION_METHODS } from "../../data";
import { FlowToggle } from "./FlowToggle";
import { flowMeta } from "./flowMeta";

export function StepEditModal({ t, step, region, onSave, onClose }: any) {
  const F = t.flow;
  const [d, setD] = useState<any>({ ...step });
  const set = (patch: any) => setD((p: any) => ({ ...p, ...patch }));
  const meta = flowMeta(step.type, F);
  const setOpt = (i: number, v: string) => set({ options: (d.options || []).map((o: string, j: number) => (j === i ? v : o)) });
  const addOpt = () => set({ options: [...(d.options || []), ""] });
  const delOpt = (i: number) => set({ options: (d.options || []).filter((_: string, j: number) => j !== i) });
  const toggleM = (m: string) => set({ methods: (d.methods || []).includes(m) ? d.methods.filter((x: string) => x !== m) : [...(d.methods || []), m] });
  const regionMethods = FLOW_REGION_METHODS[region] || FLOW_REGION_METHODS.global;
  const hasText = ["welcome", "askName", "askPhone", "askChoice", "message", "payment"].includes(step.type);
  const hasStyle = ["askChoice", "message"].includes(step.type);
  const hasOptions = step.type === "askChoice" || (step.type === "message" && d.style && d.style !== "text");
  return (
    <Modal title={meta.name} onClose={onClose}>
      {hasText ? <div className="db-field"><label>{step.type === "payment" ? F.payIntro : F.msgText}</label><textarea className="db-area" rows={2} value={d.text || ""} onChange={(e) => set({ text: e.target.value })} placeholder={F.msgPh} /></div> : null}
      {step.type === "askPhone" ? <div className="db-noteline"><Icon name="phone" size={14} /> {F.shareNote}</div> : null}
      {hasStyle ? <div className="db-field"><label>{F.styleL}</label><select className="db-select" value={d.style || "reply"} onChange={(e) => set({ style: e.target.value })}>{(step.type === "message" ? ["text", "reply", "inline"] : ["reply", "inline"]).map((st) => <option key={st} value={st}>{F.st[st]}</option>)}</select></div> : null}
      {hasOptions ? <div className="db-field"><label>{F.opts}</label><div className="db-optlist">{(d.options || []).map((o: string, i: number) => <div key={i} className="db-optrow"><input className="db-wiz-input" value={o} onChange={(e) => setOpt(i, e.target.value)} placeholder={F.optPh} /><button className="db-mini danger" onClick={() => delOpt(i)} aria-label="Remove"><Icon name="x" size={14} /></button></div>)}<button className="db-btn db-btn-ghost db-btn-sm" onClick={addOpt}><Icon name="plus" size={14} /> {F.addOpt}</button></div></div> : null}
      {step.type === "payment" ? (<>
        <div className="db-field"><label>{F.sellProduct}</label><select className="db-select" value={d.product || ""} onChange={(e) => set({ product: e.target.value })}><option value="">{F.sellCustom}</option>{PRODUCTS.map((pr) => <option key={pr.id} value={pr.id}>{pr.name}</option>)}</select></div>
        <div className="db-field"><label>{F.payMethods} · {F.localizedFor} {F.regions[region]}</label><div className="db-methodgrid">{regionMethods.map((m) => <button key={m} className={cx("db-method", (d.methods || []).includes(m) && "on")} onClick={() => toggleM(m)}><span className="mi"><Icon name={(d.methods || []).includes(m) ? "check" : "plus"} size={13} /></span>{F.mNames[m]}</button>)}</div></div>
        {(() => { const pr = PRODUCTS.find((x) => x.id === d.product); if (pr) { const dm = catDeliver(pr.cat); return <div className="db-autodeliver"><span className="adi"><Icon name="zap" size={16} /></span><div style={{ minWidth: 0 }}><div className="adt">{F.autoDeliverOn}</div><div className="add">{F.autoDeliverVia} <b>{dm ? t.prod.deliver[dm] : t.prod.deliver.manual}</b> — {F.autoDeliverAfter}</div></div></div>; } return <div className="db-field"><label>{F.deliverWhat}</label><select className="db-select" value={d.deliverType || "channel"} onChange={(e) => set({ deliverType: e.target.value })}>{Object.keys(F.dv).map((kk) => <option key={kk} value={kk}>{F.dv[kk]}</option>)}</select><input className="db-wiz-input" style={{ marginTop: 8 }} dir={d.deliverType === "text" ? undefined : "ltr"} value={d.deliverValue || ""} onChange={(e) => set({ deliverValue: e.target.value })} placeholder={F.dvPh[d.deliverType || "channel"]} /></div>; })()}
        <div className="db-field"><label>{F.autoTitle}</label>
          <FlowToggle on={d.autoConnect !== false} label={F.autoConn} desc={F.autoConnD} onChange={(v: boolean) => set({ autoConnect: v })} />
          <FlowToggle on={d.autoConfirm !== false} label={F.autoConf} desc={F.autoConfD} onChange={(v: boolean) => set({ autoConfirm: v })} />
          <FlowToggle on={d.autoDeliver !== false} label={F.autoDeliver} desc={F.autoDeliverD} onChange={(v: boolean) => set({ autoDeliver: v })} />
        </div>
        <div className="db-noteline"><Icon name="spark" size={14} /> {F.autoNote}</div>
      </>) : null}
      {step.type === "deliver" ? <div className="db-field"><label>{F.deliverWhat}</label><select className="db-select" value={d.deliverType || "channel"} onChange={(e) => set({ deliverType: e.target.value })}>{Object.keys(F.dv).map((kk) => <option key={kk} value={kk}>{F.dv[kk]}</option>)}</select><input className="db-wiz-input" style={{ marginTop: 8 }} dir={d.deliverType === "text" ? undefined : "ltr"} value={d.deliverValue || ""} onChange={(e) => set({ deliverValue: e.target.value })} placeholder={F.dvPh[d.deliverType || "channel"]} /></div> : null}
      {step.type === "condition" ? (<>
        <div className="db-field"><label>{F.condWhen}</label><select className="db-select" value={d.metric || "intent"} onChange={(e) => set({ metric: e.target.value })}>{Object.keys(F.cm).map((kk) => <option key={kk} value={kk}>{F.cm[kk]}</option>)}</select></div>
        <div className="db-grid g-2"><div className="db-field"><label>{F.condIs}</label><select className="db-select" value={d.op || "gte"} onChange={(e) => set({ op: e.target.value })}>{Object.keys(F.co).map((kk) => <option key={kk} value={kk}>{F.co[kk]}</option>)}</select></div><div className="db-field"><label>{F.condVal}</label><input className="db-wiz-input" dir="ltr" inputMode="numeric" value={d.value || ""} onChange={(e) => set({ value: e.target.value.replace(/[^\d]/g, "") })} placeholder="70" /></div></div>
      </>) : null}
      {step.type === "aiEval" ? <div className="db-noteline"><Icon name="bot" size={14} /> {F.aiNote}</div> : null}
      {step.type === "delay" ? <div className="db-grid g-2"><div className="db-field"><label>{F.waitN}</label><input className="db-wiz-input" dir="ltr" inputMode="numeric" value={d.amount || ""} onChange={(e) => set({ amount: e.target.value.replace(/[^\d]/g, "") })} placeholder="1" /></div><div className="db-field"><label>{F.unitL}</label><select className="db-select" value={d.unit || "hour"} onChange={(e) => set({ unit: e.target.value })}>{Object.keys(F.un).map((kk) => <option key={kk} value={kk}>{F.un[kk]}</option>)}</select></div></div> : null}
      <button className="db-btn db-btn-mint" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => onSave(d)}><Icon name="check" size={15} /> {F.done}</button>
    </Modal>
  );
}
