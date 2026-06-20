// Drawer
import React, { useState } from "react";
import { cx, fmt, money, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { leadScoreOf, scoreBand } from "../../lib/score";
import { Icon, ConfirmModal } from "../ui";
import { OfferSendModal } from "../billing";
import { TagAddModal } from "./TagAddModal";
import { GrantModal } from "./GrantModal";

export function Drawer({ card, t, onClose, onMessage, onOffer, onGrant, onBlock, onDelete }: any) {
  const [flow, setFlow] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(card.tags);
  const f = t.dflow;
  const score = leadScoreOf(card); const band = scoreBand(score);
  const jPaid = (card.ltv || 0) > 0 || (card.tl || []).some((e: any) => e.e === "paid");
  const jDone = [true, true, true, jPaid || score >= 55, jPaid || score >= 80, jPaid, jPaid];
  const jActive = jDone.findIndex((x) => !x);
  return (
    <>
      <div className="db-drawer-bg" onClick={onClose} />
      <aside className="db-drawer" role="dialog" aria-label={card.n}>
        <div style={{ display: "flex", alignItems: "center" }}><span className="db-muted" style={{ fontSize: 12 }} dir="ltr">{card.handle}</span><span style={{ marginInlineStart: "auto" }} /><button className="db-iconbtn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}><Icon name="x" size={16} /></button></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
          <span className="db-av" style={{ width: 56, height: 56, fontSize: 20, borderRadius: 18 }}>{initials(card.n)}</span>
          <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 18 }}>{card.n}</div><div className="db-muted" style={{ fontSize: 12.5 }}>{card.who}</div></div>
        </div>
        <div className="db-ainow" data-band={band}><Icon name="zap" size={13} /> <span>{t.crm.aiNow}</span> <b>{t.crm.scoreActs[band]}</b> <span className="db-ainow-sc">{score}</span></div>
        <div className="db-journey">
          <div className="db-journey-h"><Icon name="flow" size={13} /> {t.crm.journeyT}</div>
          {t.crm.journey.map((lb: string, idx: number) => { const st = jDone[idx] ? "done" : (idx === jActive ? "active" : "next"); return (
            <div className="db-jstep" data-st={st} key={idx}>
              <span className="db-jnode"><Icon name={st === "done" ? "check" : (st === "active" ? "zap" : "dot")} size={11} /></span>
              <span className="db-jlabel">{lb}</span>
              {st === "active" ? <span className="db-jnow">{t.crm.journeyNow}</span> : null}
            </div>
          ); })}
        </div>
        <div className="db-grid g-2" style={{ marginTop: 18 }}>
          <div className="db-statcard"><div className="db-muted" style={{ fontSize: 11.5 }}>{t.drawer.ltv}</div><div style={{ fontWeight: 750, fontSize: 18, fontFamily: "var(--mono)" }}>{money(card.ltv)}</div></div>
          <div className="db-statcard"><div className="db-muted" style={{ fontSize: 11.5 }}>{t.drawer.points}</div><div style={{ fontWeight: 750, fontSize: 18, fontFamily: "var(--mono)" }}>{fmt(card.points)}</div></div>
        </div>
        <div style={{ marginTop: 18 }}><div className="db-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{t.drawer.tags}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tags.map((tg: string) => <span key={tg} className="db-chip">{t.drawer.tagset[tg] || tg}</span>)}<button className="db-chip" style={{ cursor: "pointer" }} onClick={() => setFlow("tag")}><Icon name="plus" size={12} /> {t.drawer.addTag}</button></div></div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          {[["pin", card.phone], ["bot", card.handle], ["file", card.email || t.drawer.noEmail]].map(([ic, v]: any, i: number) => <div key={i} className="db-statcard" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px" }}><Icon name={ic} size={15} /><span dir="ltr" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span></div>)}
        </div>
        <div style={{ marginTop: 18 }}><div className="db-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>{t.drawer.timeline}</div>
          <div className="db-tl">{card.tl.map((e: any, i: number) => <div key={i} className={cx("db-tlrow", i === 0 && "hot")}><div style={{ fontSize: 13, fontWeight: 500 }}>{(t.drawer.ev[e.e] || e.e).replace("{v}", e.v || "")}</div><div className="db-muted" style={{ fontSize: 11 }}>{e.t}</div></div>)}</div>
        </div>
        <div className="db-drawer-acts">
          <button className="db-btn db-btn-mint db-drawer-msg" onClick={onMessage}><Icon name="send" size={15} /> {t.drawer.message}</button>
          <div className="db-drawer-grid">
            <button className="db-btn db-btn-ghost" onClick={() => setFlow("offer")}><Icon name="gift" size={15} /> {t.drawer.offer}</button>
            <button className="db-btn db-btn-ghost" onClick={() => setFlow("grant")}><Icon name="coin" size={15} /> {t.drawer.grant}</button>
            <button className="db-btn db-btn-ghost" onClick={() => setFlow("block")}><Icon name="ban" size={15} /> {t.drawer.block}</button>
            <button className="db-btn db-btn-ghost db-danger" onClick={() => setFlow("delete")}><Icon name="trash" size={15} /> {t.drawer.del}</button>
          </div>
        </div>
      </aside>
      {flow === "block" && <ConfirmModal title={f.blockT} body={f.blockB} confirmLabel={t.drawer.block} cancelLabel={f.cancel} danger onConfirm={() => { setFlow(null); onBlock(); }} onClose={() => setFlow(null)} />}
      {flow === "delete" && <ConfirmModal title={f.delT} body={f.delB} confirmLabel={t.drawer.del} cancelLabel={f.cancel} danger onConfirm={() => { setFlow(null); onDelete(); }} onClose={() => setFlow(null)} />}
      {flow === "offer" && <OfferSendModal t={t} onClose={() => setFlow(null)} onConfirm={() => { setFlow(null); onOffer(); }} />}
      {flow === "grant" && <GrantModal t={t} onClose={() => setFlow(null)} onConfirm={() => { setFlow(null); onGrant(); }} />}
      {flow === "tag" && <TagAddModal t={t} existing={tags} onAdd={(tg: string) => { if (!tags.includes(tg)) setTags([...tags, tg]); setFlow(null); toast(t.toast.added); }} onClose={() => setFlow(null)} />}
    </>
  );
}
