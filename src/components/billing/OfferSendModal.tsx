// OfferSendModal
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon, Modal } from "../ui";
import { OFFERS } from "../../data";

export function OfferSendModal({ t, onClose, onConfirm }: any) {
  const f = t.dflow;
  const CUSTOM = -1;
  const DURMAP = [0, 1, 4]; // offer.dur (30d / 90d / Lifetime) -> durList index
  const num = (p: string) => (p || "").replace(/[^\d]/g, "");
  const [oi, setOi] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(num(OFFERS[0].price));
  const [durIdx, setDurIdx] = useState(DURMAP[OFFERS[0].dur] || 0);
  const [discMode, setDiscMode] = useState<"preset" | "custom">("preset");
  const [disc, setDisc] = useState(0);
  const [discCustom, setDiscCustom] = useState("");
  const [valMode, setValMode] = useState<"preset" | "custom">("preset");
  const [val, setVal] = useState(0);
  const [valCustom, setValCustom] = useState("");
  const [note, setNote] = useState("");
  const discs = [0, 10, 20];
  const vals = [f.v24, f.v48, f.v7];
  const pickOffer = (i: number, o: any) => { setOi(i); setPrice(num(o.price)); setDurIdx(DURMAP[o.dur] || 0); };
  const pickCustom = () => { setOi(CUSTOM); setName(""); setPrice(""); setDurIdx(0); };
  const ready = oi === CUSTOM ? (name.trim().length > 0 && price.length > 0) : price.length > 0;
  return (
    <Modal title={f.offerT} onClose={onClose}>
      <div className="db-field"><label>{f.offerPick}</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {OFFERS.map((o: any, i: number) => (
            <button key={i} className={cx("db-planrow", oi === i && "on")} onClick={() => pickOffer(i, o)}>
              <span className="db-planradio">{oi === i ? <Icon name="check" size={13} /> : null}</span>
              <div style={{ minWidth: 0, textAlign: "start" }}><div className="nm">{o.name || t.offers.names[o.dur]}</div></div>
              <span className="pp" dir="ltr">{o.price}</span>
            </button>
          ))}
          <button className={cx("db-planrow", oi === CUSTOM && "on")} onClick={pickCustom}>
            <span className="db-planradio">{oi === CUSTOM ? <Icon name="check" size={13} /> : null}</span>
            <div style={{ minWidth: 0, textAlign: "start" }}><div className="nm">{f.offerCustom}</div></div>
            <Icon name="plus" size={15} />
          </button>
        </div>
      </div>
      {oi === CUSTOM ? (<div className="db-field"><label>{f.offerName}</label><input className="db-wiz-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={f.offerNamePh} /></div>) : null}
      <div className="db-field"><label>{f.offerPrice}</label>
        <div className="db-pricewrap" dir="ltr"><span className="ux">$</span><input className="db-wiz-input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, "").slice(0, 6))} placeholder="0" /></div>
      </div>
      <div className="db-field"><label>{f.offerDur}</label>
        <div className="db-seg db-seg-wrap">{f.durList.map((d: string, i: number) => <button key={i} className={cx(durIdx === i && "on")} onClick={() => setDurIdx(i)}>{d}</button>)}</div>
      </div>
      <div className="db-field"><label>{f.offerDisc}</label>
        <div className="db-seg db-seg-wrap">
          {discs.map((d) => <button key={d} className={cx(discMode === "preset" && disc === d && "on")} onClick={() => { setDiscMode("preset"); setDisc(d); }}>{d === 0 ? f.discNone : "-" + d + "%"}</button>)}
          <button className={cx(discMode === "custom" && "on")} onClick={() => setDiscMode("custom")}>{f.custom}</button>
        </div>
        {discMode === "custom" ? (<div className="db-pricewrap" dir="ltr" style={{ marginTop: 8 }}><input className="db-wiz-input" inputMode="numeric" value={discCustom} onChange={(e) => setDiscCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 2))} placeholder="0" /><span className="ux">%</span></div>) : null}
      </div>
      <div className="db-field"><label>{f.offerValidity}</label>
        <div className="db-seg db-seg-wrap">
          {vals.map((v: string, i: number) => <button key={i} className={cx(valMode === "preset" && val === i && "on")} onClick={() => { setValMode("preset"); setVal(i); }}>{v}</button>)}
          <button className={cx(valMode === "custom" && "on")} onClick={() => setValMode("custom")}>{f.custom}</button>
        </div>
        {valMode === "custom" ? (<div className="db-pricewrap" dir="ltr" style={{ marginTop: 8 }}><input className="db-wiz-input" inputMode="numeric" value={valCustom} onChange={(e) => setValCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 3))} placeholder="0" /><span className="ux">{f.daysUnit}</span></div>) : null}
      </div>
      <div className="db-field"><label>{f.offerNote}</label><input className="db-wiz-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={f.offerNotePh} /></div>
      <button className="db-btn db-btn-mint" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={!ready} onClick={onConfirm}><Icon name="gift" size={15} /> {f.offerSendBtn}</button>
    </Modal>
  );
}
