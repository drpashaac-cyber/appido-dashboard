// OverviewView
import React, { useState } from "react";
import { cx, fmt, money, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { track } from "../../lib/telemetry";
import { Icon, Sparkline, AreaChart, PageHead, CardHead, Kpi } from "../ui";
import { BENCH } from "../../data";
import { useDataset } from "../../lib/dataset";
import { NeedsYou } from "./NeedsYou";
import { AutomationLoop } from "./AutomationLoop";
import { ActivityFeed } from "./ActivityFeed";
import { GoalCard } from "./GoalCard";

export function OverviewView({ t, setView, openComposer, goToChat, autopilot, setAutopilot, autonomy, setAutonomy, onFunnelAction, onShare, onPlaybooks, goal, setGoal, onCelebrate, isPreview, onAddChannel, onExplain }: any) {
  const { KPIS, REVENUE, FUNNEL, SEGMENTS, CONVOS, live } = useDataset();
  const [ovTab, setOvTab] = useState("perf");
  const aiClosed = live ? 0 : 32800;
  const aiShare = live ? 0 : 68;
  const taskState = ["running", "done", "queued"];
  const aTitle = autopilot ? t.airun.title : (autonomy === "draft" ? t.airun.titleDraft : autonomy === "approve" ? t.airun.titleApprove : t.airun.titlePaused);
  const aSub = autopilot ? t.airun.sub : (autonomy === "draft" ? t.airun.subDraft : autonomy === "approve" ? t.airun.subApprove : t.airun.subPaused);
  return (
    <>
      <PageHead title={t.nav[0]} sub={t.ovSub}><button className="db-btn db-btn-mint" onClick={openComposer}><Icon name="plus" size={16} /> {t.cta.campaign}</button></PageHead>
      <NeedsYou t={t} setView={setView} goToChat={goToChat} />
      {isPreview ? <button type="button" className="db-preview-rib" onClick={() => onAddChannel && onAddChannel()}><Icon name="eye" size={13} /> <span>{t.fw.previewRib}</span> <Icon name="chevron" size={13} /></button> : null}
      <section className="db-revhero">
        <div className="rh-l">
          <div className="rh-cap">{t.ov.revThisMonth}</div>
          <div className="rh-amt">{KPIS[0].v}</div>
          <div className="rh-row"><span className="rh-delta"><Icon name="arrowUp" size={13} /> +{KPIS[0].delta}%</span><span className="rh-vs">{t.ov.vsLast}</span></div>
          <div className="rh-spark"><Sparkline data={KPIS[0].spark} color="#67E18D" h={40} /></div>
        </div>
        <div className="rh-ai">
          <div className="rh-ai-cap"><Icon name="bot" size={14} /> {t.ov.aiClosed}</div>
          <div className="rh-ai-amt">{money(aiClosed)}</div>
          <div className="rh-ai-track"><span style={{ width: aiShare + "%" }} /></div>
          <div className="rh-ai-sub">{aiShare}% {t.ov.ofRevenue} · {t.ov.aiHint}</div>
          <button type="button" className="db-rh-how" onClick={() => onExplain && onExplain()}><Icon name="eye" size={13} /> {t.xai.viewDetail}</button>
          <button className="db-rh-share" onClick={() => onShare && onShare()}><Icon name="share" size={13} /> {t.share.shareWin}</button>
        </div>
      </section>
      <GoalCard t={t} goal={goal} setGoal={setGoal} onCelebrate={onCelebrate} />
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={ovTab === "perf"} className={cx(ovTab === "perf" && "on")} onClick={() => setOvTab("perf")}><span className="ic"><Icon name="chart" size={15} /></span><span>{t.ov.tabs.perf}</span></button>
        <button role="tab" aria-selected={ovTab === "activity"} className={cx(ovTab === "activity" && "on")} onClick={() => setOvTab("activity")}><span className="ic"><Icon name="clock" size={15} /></span><span>{t.ov.tabs.activity}</span></button>
        <button role="tab" aria-selected={ovTab === "auto"} className={cx(ovTab === "auto" && "on")} onClick={() => setOvTab("auto")}><span className="ic"><Icon name="flow" size={15} /></span><span>{t.ov.tabs.auto}</span></button>
      </div>
      {ovTab === "perf" ? (
        <>
      <div className="db-kpis" style={{ marginBottom: 24 }}>{KPIS.map((k, i) => <Kpi key={i} label={t.ov.kpis[i]} k={k} />)}</div>
      <div className="db-grid g-hero" style={{ marginBottom: 24 }}>
        <div className="db-card">
          <CardHead title={t.ov.rev} right={<><span className="db-muted" style={{ fontSize: 12.5 }}>{t.ov.last30}</span>&nbsp;&nbsp;<span className="db-chip"><Icon name="arrowUp" size={12} /> +{live ? 0 : 23}%</span></>} />
          <div className="db-pad"><AreaChart data={REVENUE} /></div>
        </div>
        <div className="db-card">
          <CardHead title={t.ov.convFunnel} />
          <div className="db-pad"><div className="db-funnel">{FUNNEL.map((f, i) => (
            <div className="db-fstage" key={i}>
              <div className="db-fstage-h"><span className="lab">{t.ov.funnel[i]}</span><span className="pct">{f.v > 0 ? f.p : 0}%</span><span className="val">{fmt(f.v)}</span></div>
              <div className="db-ftrack"><div className="fill" style={{ width: f.v > 0 ? Math.max(f.p, 6) + "%" : "0%" }} /></div>
              <button className="db-faction" onClick={() => onFunnelAction ? onFunnelAction(i) : setView("campaigns")}><Icon name="spark" size={13} /> {t.funnelAct[i]}</button>
            </div>
          ))}</div><div className="db-fnote"><Icon name="bot" size={13} /> {t.funnelAuto}</div></div>
        </div>
      </div>
      <div className="db-card db-bench" style={{ marginBottom: 24 }}>
        <CardHead title={t.offer.benchTitle} icon="chart" right={<span className="db-chip"><Icon name="arrowUp" size={12} /> {t.offer.benchChip.replace("{p}", String(BENCH.topPct))}</span>} />
        <div className="db-pad">
          <div className="db-bench-bars">
            <div className="db-bench-bar you"><span className="lab">{t.offer.benchYou}</span><div className="track"><i style={{ width: Math.round(BENCH.you / BENCH.top * 100) + "%" }} /></div><span className="val">{money(BENCH.you)}</span></div>
            <div className="db-bench-bar"><span className="lab">{t.offer.benchAvg}</span><div className="track"><i style={{ width: Math.round(BENCH.avg / BENCH.top * 100) + "%" }} /></div><span className="val">{money(BENCH.avg)}</span></div>
            <div className="db-bench-bar top"><span className="lab">{t.offer.benchTop}</span><div className="track"><i style={{ width: "100%" }} /></div><span className="val">{money(BENCH.top)}</span></div>
          </div>
          <div className="db-bench-take"><Icon name="spark" size={14} /> <span>{t.offer.benchTake.replace("{avg}", money(BENCH.avg)).replace("{top}", money(BENCH.top))}</span></div>
          <button className="db-link db-bench-cta" onClick={() => setView("settings")}>{t.offer.benchCta}</button>
        </div>
      </div>
        </>
      ) : ovTab === "activity" ? (
        <>
      <ActivityFeed t={t} autonomy={autonomy} />
        <div className="db-card">
          <CardHead title={t.ov.liveConv} right={<button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setView("inbox")}>{t.ov.openInbox}</button>} />
          <div className="db-list">{CONVOS.slice(0, 4).map((c, i) => (
            <div className="db-li" key={c.id}>
              <span className="db-av">{initials(c.name)}</span>
              <div style={{ minWidth: 0 }}><div style={{ fontWeight: 650, fontSize: 13.5 }}>{c.name}</div><div className="db-muted" style={{ fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.inbox.snips[i]}</div></div>
              <span className="sp" style={{ marginInlineStart: "auto" }} /><span className={cx("db-tag", c.tag.toLowerCase())}>{t.tags[c.tag]}</span>{c.ai ? <span className="db-chip"><Icon name="bot" size={12} /> AI</span> : null}
            </div>
          ))}</div>
        </div>
        </>
      ) : (
        <>
      <div className="db-airun" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, display: "grid", placeItems: "center", background: autopilot ? "var(--mint-bri)" : "var(--line)", color: autopilot ? "var(--forest)" : "var(--text-2)", flexShrink: 0, transition: "background .2s" }}><Icon name="zap" size={22} /></span>
          <div style={{ minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 17 }}>{aTitle}</div><div style={{ fontSize: 12.5, opacity: .75 }}>{aSub}</div></div>
          <span className="sp" style={{ marginInlineStart: "auto" }} />
          <div className="db-autodial" role="group" aria-label="Autonomy">
            <button className={cx(!autopilot && autonomy === "draft" && "on")} aria-pressed={!autopilot && autonomy === "draft"} onClick={() => { setAutonomy("draft"); setAutopilot(false); toast(t.airun.tManual); }}>{t.airun.manual}</button>
            <button className={cx(!autopilot && autonomy === "approve" && "on")} aria-pressed={!autopilot && autonomy === "approve"} onClick={() => { setAutonomy("approve"); setAutopilot(false); toast(t.airun.tApprove); }}>{t.airun.approve}</button>
            <button className={cx(autopilot && "on")} aria-pressed={autopilot} onClick={() => { setAutonomy("auto"); setAutopilot(true); toast(t.airun.tAuto); }}>{t.airun.auto}</button>
          </div>
        </div>
        <div className="db-grid g-3" style={{ marginTop: 16 }}>
          {t.airun.tasks.map((task: string, i: number) => {
            const st = autopilot ? taskState[i] : "queued";
            const ic = st === "done" ? "check" : st === "running" ? "dot" : "clock";
            const col = st === "queued" ? "rgba(244,241,230,.6)" : "var(--mint-bri)";
            return <div className="task" key={i}><span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task}</span><span className="sp" style={{ marginInlineStart: "auto" }} /><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: col, flexShrink: 0 }}><Icon name={ic} size={12} />{t.airun[st]}</span></div>;
          })}
        </div>
      </div>
      <AutomationLoop t={t} setView={setView} />
        <div className="db-card">
          <CardHead title={t.ov.aiRec} icon="spark" right={<button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setView("insights")}>{t.ov.allInsights}</button>} />
          <div className="db-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SEGMENTS.slice(0, 3).map((s, i) => (
              <div className={cx("db-airec-row", s.tone)} key={i}>
                <span className="ic"><Icon name="target" size={17} /></span>
                <div className="meta">
                  <div className="hd"><span className="nm">{t.crm.seg[i].n}</span><span className="cnt">{fmt(s.c)}</span></div>
                  <div className="hint">{t.crm.seg[i].hint}</div>
                </div>
                <button className="db-btn db-btn-ghost db-btn-sm use" onClick={() => toast(t.toast.applied)}>{t.common.use}</button>
              </div>
            ))}
          </div>
        </div>
        </>
      )}
    </>
  );
}
