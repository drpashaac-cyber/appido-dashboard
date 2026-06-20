// CrmView
import React, { useState, useEffect } from "react";
import { cx, fmt, money, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { leadScoreOf, scoreBand } from "../../lib/score";
import { Icon, Switch, PageHead } from "../ui";
import { STAGES } from "../../data";
import { useDataset } from "../../lib/dataset";
import { ImportWizard } from "./ImportWizard";
import { Drawer } from "./Drawer";

export function CrmView({ t, goToChat, setView, imported, setImported, importReq, clearImportReq }: any) {
  const { CONVOS, SEGMENTS } = useDataset();
  const [tab, setTab] = useState("pipeline");
  const [sel, setSel] = useState<any>(null);
  const [stages, setStages] = useState(STAGES);
  const [autos, setAutos] = useState([true, true, false, false]);
  const [wiz, setWiz] = useState(false);
  const [nudge, setNudge] = useState(true);
  useEffect(() => { if (importReq) { setWiz(true); clearImportReq && clearImportReq(); } }, [importReq]);
  const allCards = [...(imported || []), ...stages.flatMap((s) => s.cards)];
  const totalValue = allCards.reduce((a, c) => a + c.v, 0);
  const forecast = Math.round(allCards.reduce((a, c) => a + c.v * c.intent / 100, 0));
  const removeCard = (card: any) => { if (card && card.imported) { setImported && setImported((L: any[]) => (L || []).filter((x) => x.id !== card.id)); } else { setStages((sts) => sts.map((s) => ({ ...s, cards: s.cards.filter((x) => x !== card) }))); } };
  const onDelete = (card: any) => { removeCard(card); setSel(null); toast(t.toast.deleted); };
  const onBlock = (card: any) => { removeCard(card); setSel(null); toast(t.toast.blocked); };
  const onMessage = () => { const cv = sel ? CONVOS.find((c) => c.handle === sel.handle) : null; setSel(null); goToChat && goToChat(cv ? cv.id : null); };
  return (
    <>
      <PageHead title={t.crm.title} sub={t.crm.sub}>
        <div className="db-seg"><button className={cx(tab === "pipeline" && "on")} onClick={() => setTab("pipeline")}>{t.crm.pipeline}</button><button className={cx(tab === "segments" && "on")} onClick={() => setTab("segments")}>{t.crm.segments}</button></div>
        <button className="db-btn db-btn-ghost db-btn-sm db-crm-import" onClick={() => setWiz(true)}><Icon name="upload" size={14} /> {t.imp.title}</button>
      </PageHead>
      {wiz && <ImportWizard t={t} onClose={() => setWiz(false)} onNav={(v: string) => { setWiz(false); setView && setView(v); }} onDone={(leads: any[]) => { setImported && setImported((L: any[]) => [...leads, ...(L || [])]); }} />}
      {tab === "pipeline" ? (<>
        {nudge && (imported || []).length === 0 && (<div className="db-impnudge"><span className="db-impnudge-ic"><Icon name="upload" size={16} /></span><div style={{ minWidth: 0 }}><div className="t">{t.imp.nudgeT}</div><div className="s">{t.imp.nudgeB}</div></div><button className="db-btn db-btn-mint db-btn-sm db-impnudge-cta" onClick={() => setWiz(true)}>{t.imp.nudgeCta}</button><button className="db-iconbtn db-impnudge-x" onClick={() => setNudge(false)} aria-label="Dismiss"><Icon name="x" size={14} /></button></div>)}
        <div className="db-pipe-sum">
          <div className="it"><span className="db-muted">{t.crm.pipeValue}</span><b>{money(totalValue)}{t.crm.mo}</b><span className="db-pipe-hint">{t.crm.pipeValueHint}</span></div>
          <div className="it"><span className="db-muted">{t.crm.forecast}</span><b className="fc">{money(forecast)}{t.crm.mo}</b><span className="db-pipe-hint">{t.crm.forecastHint}</span></div>
        </div>
        <div className="db-kanban">
          {stages.map((st, si) => {
            const colCards = [...(imported || []).filter((x: any) => (x.stage || "cold") === st.id), ...st.cards];
            const stVal = colCards.reduce((a, c) => a + c.v, 0);
            return (
              <div className="db-col" key={st.id}>
                <div className="db-colh"><span className="dotc" style={{ background: st.color }} />{t.crm.stages[si]}<span className="ct">{colCards.length}</span></div>
                <div className="db-colval">{money(stVal)}{t.crm.mo}</div>
                {colCards.map((c, i) => { const score = leadScoreOf(c); const band = scoreBand(score); return (
                  <div className="db-pcard" key={i} onClick={() => setSel(c)} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}><span className="db-av" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(c.n)}</span><div style={{ minWidth: 0 }}><div className="pn">{c.n}</div><div className="pw">{c.who}</div></div>{c.imported ? <span className="db-imp-badge" style={{ marginInlineStart: "auto" }}><Icon name="upload" size={10} /> {t.imp.badge}</span> : null}</div>
                    <div className="pf"><span className="pv">{money(c.v)}{t.crm.mo}</span><span className="db-muted" style={{ fontSize: 11, marginInlineStart: "auto" }}>{c.t}</span></div>
                    <div className="pf"><span className="db-muted" style={{ fontSize: 11 }}>{t.crm.score}</span><span className="db-meter db-meter-band" data-band={band}><i style={{ width: score + "%" }} /></span><span className="db-score-num" data-band={band}>{score}</span></div>
                    <div className="db-pcard-auto" data-band={band}><Icon name="zap" size={12} /> {t.crm.scoreActs[band]}</div>
                  </div>
                ); })}
              </div>
            );
          })}
        </div>
      </>) : (
        <div className="db-grid g-2">
          {SEGMENTS.map((s, i) => { const on = autos[i]; return (
            <div className={cx("db-card db-pad db-autoseg", on && "on")} key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span className={cx("db-autoseg-ic", on && "on")}><Icon name="target" size={16} /></span>
                <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.crm.seg[i].n}</div><div className="db-muted" style={{ fontSize: 12, marginTop: 1 }}>{fmt(s.c)} {t.crm.contacts}</div></div>
              </div>
              <div style={{ fontSize: 13, marginTop: 12, lineHeight: 1.55 }}>{t.crm.seg[i].hint}</div>
              <div className="db-autoseg-impact"><Icon name="arrowUp" size={13} /> <span className="db-muted">{t.crm.segImpactL}:</span> <b>{t.crm.segImpacts[i]}</b></div>
              <div className="db-noteline" style={{ marginTop: 10 }}><Icon name="spark" size={13} /> {t.crm.segTrigger}</div>
              <div className="db-autoseg-foot"><Switch on={on} onClick={() => { setAutos((p) => p.map((v, j) => j === i ? !v : v)); toast(on ? t.crm.segOff : t.crm.segOn); }} label={t.crm.seg[i].n} /><span>{on ? t.crm.segOn : t.crm.segOff}</span></div>
            </div>
          ); })}
        </div>
      )}
      {sel && <Drawer card={sel} t={t} onClose={() => setSel(null)} onMessage={onMessage} onOffer={() => toast(t.toast.offerSent)} onGrant={() => toast(t.toast.granted)} onBlock={() => onBlock(sel)} onDelete={() => onDelete(sel)} />}
    </>
  );
}
