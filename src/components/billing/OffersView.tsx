// OffersView
import React, { useState } from "react";
import { cx, fmt } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon, Modal, Switch, PageHead } from "../ui";
import { OFFERS } from "../../data";

export function OffersView({ t }: any) {
  const [offers, setOffers] = useState(OFFERS);
  const [form, setForm] = useState<any>(null);
  const openNew = () => setForm({ name: "", price: "", dur: 0, guarantee: false, popular: false });
  const openEdit = (o: any) => setForm({ name: o.name || t.offers.names[o.dur], price: o.price, dur: o.dur, guarantee: !!o.guarantee, popular: !!o.popular, _ref: o });
  const canSave = !!(form && form.name.trim() && form.price.trim());
  const saveOffer = () => {
    const base = { name: form.name.trim(), price: form.price.trim(), dur: form.dur, guarantee: form.guarantee, popular: form.popular };
    if (form._ref) setOffers((p) => p.map((x) => x === form._ref ? { ...form._ref, ...base } : x));
    else setOffers((p) => [{ ...base, active: true, ai: false, conv: 0, sales: 0, bonus: null, old: null, urgency: null }, ...p]);
    setForm(null); toast(t.toast.created);
  };
  return (
    <>
      <PageHead title={t.offers.title} sub={t.offers.sub}><button className="db-btn db-btn-mint" onClick={openNew}><Icon name="plus" size={16} /> {t.offers.newBtn}</button></PageHead>
      <div className="db-grid g-3">
        {offers.map((o, i) => (
          <div key={i} className={cx("db-offer", o.popular && "pop")}>
            {o.popular ? <span className="popbadge">{t.offers.popular}</span> : null}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{o.name || t.offers.names[o.dur]}</div>{o.ai ? <span className="db-offer-ai"><Icon name="spark" size={11} /> {t.offers.aiOpt}</span> : null}<span style={{ marginInlineStart: "auto", width: 9, height: 9, borderRadius: 99, background: o.active ? "var(--good)" : "#D1C9BA" }} /></div>
            <div style={{ marginTop: 14, borderBottom: "1px dashed var(--line)", paddingBottom: 14 }}>
              {o.old ? <div className="db-strike">{o.old}</div> : null}
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 26, fontWeight: 750 }}>{o.price}</span></div>
              {o.urgency ? <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: "var(--hot)" }}><Icon name="clock" size={12} /> {t.offers.urgency}</div> : null}
            </div>
            <div className="db-offer-conv">
              <div className="row"><span className="db-muted" style={{ fontSize: 11.5 }}>{t.offers.conv}</span><b>{o.conv}%</b></div>
              <div className="bar"><i style={{ width: o.conv + "%" }} /></div>
              <div className="db-muted" style={{ fontSize: 11, marginTop: 5 }}>{fmt(o.sales)} {t.offers.sales}</div>
            </div>
            <div className="db-offer-perks">
              {o.guarantee ? <span className="db-chip"><Icon name="check" size={12} /> {t.offers.guarantee}</span> : null}
              {o.bonus != null ? <span className="db-chip"><Icon name="coin" size={12} /> {t.offers.bonuses[o.bonus]}</span> : null}
            </div>
            <div className="db-muted" style={{ marginTop: 12, fontSize: 13 }}>{t.offers.dur[o.dur]}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}><button className="db-btn db-btn-ghost db-btn-sm" style={{ flex: 1 }} onClick={() => openEdit(o)}><Icon name="edit" size={14} /> {t.offers.edit}</button><button className="db-btn db-btn-ghost db-btn-sm" aria-label={t.drawer.del} onClick={() => { setOffers((p) => p.filter((x) => x !== o)); toast(t.toast.deleted); }}><Icon name="trash" size={15} /></button></div>
          </div>
        ))}
      </div>
      {form && (
        <Modal title={form._ref ? t.offers.formEdit : t.offers.formNew} onClose={() => setForm(null)}>
          <div className="db-field"><label>{t.offers.fName}</label><input className="db-wiz-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.offers.names[0]} /></div>
          <div className="db-field"><label>{t.offers.fPrice}</label><input className="db-wiz-input" dir="ltr" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$49" /></div>
          <div className="db-field"><label>{t.offers.fDur}</label><div className="db-seg db-seg-wrap">{t.offers.dur.map((d: string, i: number) => <button key={i} className={cx(form.dur === i && "on")} onClick={() => setForm({ ...form, dur: i })}>{d}</button>)}</div></div>
          <div className="db-offer-toggles">
            <div className="db-toggle-row"><span>{t.offers.fGuar}</span><Switch on={!!form.guarantee} onClick={() => setForm({ ...form, guarantee: !form.guarantee })} label={t.offers.fGuar} /></div>
            <div className="db-toggle-row"><span>{t.offers.fPop}</span><Switch on={!!form.popular} onClick={() => setForm({ ...form, popular: !form.popular })} label={t.offers.fPop} /></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setForm(null)}>{t.offers.cancel}</button>
            <button className="db-btn db-btn-mint" style={{ flex: 1, justifyContent: "center" }} disabled={!canSave} onClick={saveOffer}>{t.offers.save}</button>
          </div>
        </Modal>
      )}
    </>
  );
}
