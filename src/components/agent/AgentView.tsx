// AgentView
import React, { useState, useEffect } from "react";
import { cx } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon, Switch, PageHead, CardHead } from "../ui";
import { PRODUCTS, FILES } from "../../data";
import { useDataset } from "../../lib/dataset";
import { api } from "../../lib/api";
import { AI_MODELS } from "../../i18n";
import { MarketVoice } from "../audience";

export function AgentView({ t, lang, setView, channel, onChannelChanged }: any) {
  const { USAGE } = useDataset();
  const live = api.enabled();
  const [rules, setRules] = useState([true, true, true]);
  const [approval, setApproval] = useState(true);
  const [guards, setGuards] = useState([true, true, true, true]);
  const [model, setModel] = useState((channel && channel.aiModel) || "claude");
  const [agTab, setAgTab] = useState("knowledge");
  const LANG_CHIPS = ["English", "فارسی", "Türkçe", "Русский"];
  // Keep the selected model in sync with the active channel (the backend truth).
  useEffect(() => { if (channel && channel.aiModel) setModel(channel.aiModel); }, [channel && channel.id, channel && channel.aiModel]);
  const pickModel = (id: string, name: string) => {
    const prev = model;
    setModel(id);
    if (live && channel && channel.id) {
      api.setChannelAi(channel.id, { aiModel: id })
        .then(() => { toast(name); onChannelChanged && onChannelChanged(); })
        .catch(() => { setModel(prev); toast(t.toast.soon); });
      return;
    }
    toast(name);
  };
  const [onboarding, setOnboarding] = useState(!channel || channel.onboardingEnabled !== false);
  const [scriptQs, setScriptQs] = useState<any[]>([]);
  useEffect(() => { setOnboarding(!channel || channel.onboardingEnabled !== false); }, [channel && channel.id, channel && channel.onboardingEnabled]);
  useEffect(() => { if (live) api.aiScript().then((r) => setScriptQs(r || [])).catch(() => {}); }, [live]);
  const toggleOnboarding = () => {
    const next = !onboarding;
    setOnboarding(next);
    if (live && channel && channel.id) {
      api.setChannelAi(channel.id, { onboardingEnabled: next }).then(() => onChannelChanged && onChannelChanged()).catch(() => setOnboarding(!next));
    }
  };
  return (
    <>
      <PageHead title={t.ag.title} sub={t.ag.sub} />
      <div className="db-card db-pad db-aieng">
        <div className="db-aieng-head"><span className="ic"><Icon name="spark" size={18} /></span><div style={{ minWidth: 0 }}><div className="ti">{t.ag.engine}</div><div className="su">{t.ag.engineNote}</div></div></div>
        <div className="db-modelrow">{AI_MODELS.map((m) => <button key={m.id} type="button" className={cx("db-model", model === m.id && "on")} onClick={() => pickModel(m.id, m.name)}><Icon name={model === m.id ? "check" : "spark"} size={14} /> {m.name}</button>)}</div>
        <div className="db-noteline" style={{ marginTop: 12 }}><Icon name="bot" size={13} /> {t.ag.switchNote}</div>
      </div>
      <div className="db-card db-pad">
        <div className="db-aieng-head" style={{ marginBottom: 4 }}><span className="ic"><Icon name="spark" size={18} /></span><div style={{ minWidth: 0 }}><div className="ti">{t.ag.onboarding}</div><div className="su">{t.ag.onboardingNote}</div></div></div>
        <label className="db-aitoggle" style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}><Switch on={onboarding} onClick={toggleOnboarding} label={t.ag.onboardingOptOut} /><span>{t.ag.onboardingOptOut}</span></label>
        {live && scriptQs.length > 0 ? (
          <ul style={{ margin: "12px 0 0", paddingInlineStart: 18, opacity: onboarding ? 1 : 0.45 }}>
            {scriptQs.map((q) => <li key={q.id} style={{ fontSize: 13, marginBottom: 5 }}>{lang === "fa" ? q.questionFa : q.questionEn}</li>)}
          </ul>
        ) : null}
      </div>
      {USAGE && USAGE.byTier.length > 0 && t.ag.hybrid && (() => {
        const fast = USAGE.byTier.find((x) => x.tier === "fast");
        const smart = USAGE.byTier.find((x) => x.tier === "smart");
        const fc = fast?.calls ?? 0;
        const sc = smart?.calls ?? 0;
        const tot = fc + sc;
        const fastPct = tot ? Math.round((fc / tot) * 100) : 0;
        const h = t.ag.hybrid;
        return (
          <div className="db-card db-pad">
            <CardHead title={h.title} />
            <div className="db-noteline" style={{ marginBottom: 12 }}><Icon name="bot" size={13} /> {h.note}</div>
            <div className="db-kpis">
              <div className="db-kpi"><div className="k">{h.fast}</div><div className="v" style={{ color: "var(--good)" }}>{fastPct}%</div></div>
              <div className="db-kpi"><div className="k">{h.smart}</div><div className="v">{tot ? 100 - fastPct : 0}%</div></div>
              <div className="db-kpi"><div className="k">{h.tokens}</div><div className="v">{(USAGE.tokensIn + USAGE.tokensOut).toLocaleString("en-US")}</div></div>
              <div className="db-kpi"><div className="k">{h.cost}</div><div className="v">${USAGE.costUsd.toFixed(2)}</div></div>
            </div>
          </div>
        );
      })()}
      <MarketVoice t={t} />
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={agTab === "knowledge"} className={cx(agTab === "knowledge" && "on")} onClick={() => setAgTab("knowledge")}><span className="ic"><Icon name="file" size={15} /></span><span>{t.ag.tabs.knowledge}</span></button>
        <button role="tab" aria-selected={agTab === "behavior"} className={cx(agTab === "behavior" && "on")} onClick={() => setAgTab("behavior")}><span className="ic"><Icon name="bot" size={15} /></span><span>{t.ag.tabs.behavior}</span></button>
        <button role="tab" aria-selected={agTab === "guardrails"} className={cx(agTab === "guardrails" && "on")} onClick={() => setAgTab("guardrails")}><span className="ic"><Icon name="shield" size={15} /></span><span>{t.ag.tabs.guardrails}</span></button>
      </div>
      {agTab === "knowledge" ? (<>
        <div className="db-card">
          <CardHead title={t.ag.sources} right={<span className="db-chip">{t.ag.indexedN}</span>} />
          <div className="db-pad">
            <div className="db-drop" role="button" tabIndex={0} style={{ cursor: "pointer" }} onClick={() => toast(t.toast.uploaded)}><div className="di"><Icon name="upload" size={24} /></div><div style={{ fontWeight: 650 }}>{t.ag.drop}</div><div className="db-muted" style={{ fontSize: 12.5, marginTop: 4 }}>{t.ag.dropSub}</div></div>
            <div style={{ marginTop: 18 }}>
              {FILES.map((f, i) => (
                <div className="db-file" key={i}>
                  <span className="fi"><Icon name="file" size={18} /></span>
                  <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{f.n}</div><div className="db-muted" style={{ fontSize: 12 }}>{f.size}{f.chunks ? " · " + f.chunks + " " + t.ag.chunks : ""}</div></div>
                  <span className="db-chip" style={{ marginInlineStart: "auto", background: f.status === "Indexed" ? undefined : "rgba(224,138,60,.16)", color: f.status === "Indexed" ? undefined : "var(--warn)" }}>{f.status === "Indexed" ? <><Icon name="check" size={12} /> {t.ag.indexed}</> : t.ag.processing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      <div className="db-card" style={{ marginTop: 16 }}>
        <CardHead title={t.ag.prodKnow} right={<span className="db-chip">{PRODUCTS.filter((pr) => (pr.doc && pr.doc.trim()) || (pr.files && pr.files.length)).length}/{PRODUCTS.length} {t.ag.ready}</span>} />
        <div className="db-pad">
          <div className="db-noteline" style={{ marginTop: 0, marginBottom: 14 }}><Icon name="spark" size={14} /> {t.ag.prodKnowNote}</div>
          {PRODUCTS.map((pr) => { const has = (pr.doc && pr.doc.trim()) || (pr.files && pr.files.length); const fc = pr.files ? pr.files.length : 0; return (
            <div className="db-knowrow" key={pr.id}>
              <span className={cx("ki", has && "on")}><Icon name={has ? "check" : "file"} size={15} /></span>
              <div style={{ minWidth: 0 }}><div className="kn">{pr.name}</div><div className="kd">{has ? t.ag.knowOn + (fc ? " · " + fc + " " + t.ag.filesU : "") : t.ag.knowOff}</div></div>
              {has ? <span className="db-chip" style={{ marginInlineStart: "auto" }}><Icon name="check" size={12} /> {t.ag.ready}</span> : <button className="db-btn db-btn-ghost db-btn-sm" style={{ marginInlineStart: "auto" }} onClick={() => setView && setView("offers")}><Icon name="plus" size={13} /> {t.ag.addKnow}</button>}
            </div>
          ); })}
        </div>
      </div>
      </>) : agTab === "behavior" ? (<>
        <div className="db-card">
          <CardHead title={t.ag.behavior} />
          <div className="db-pad">
            <div className="db-field"><label>{t.ag.tone}</label><select className="db-select" defaultValue={t.ag.tones[0]}>{t.ag.tones.map((o: string) => <option key={o}>{o}</option>)}</select></div>
            <div className="db-field"><label>{t.ag.goal}</label><select className="db-select" defaultValue={t.ag.goals[0]}>{t.ag.goals.map((o: string) => <option key={o}>{o}</option>)}</select></div>
            <div className="db-field"><label>{t.ag.languages}</label><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{LANG_CHIPS.map((l) => <span key={l} className="db-chip"><Icon name="check" size={12} /> {l}</span>)}</div></div>
            <div className="db-field" style={{ marginBottom: 0 }}><label>{t.ag.handoff}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
                {t.ag.rules.map((r: string, i: number) => <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, cursor: "pointer" }}><Switch on={rules[i]} onClick={() => setRules((p) => p.map((v, j) => j === i ? !v : v))} label={r} /> {r}</label>)}
              </div>
            </div>
          </div>
        </div>
      <div className="db-card" style={{ marginTop: 16 }}>
        <CardHead title={t.ag.playbook} />
        <div className="db-pad">
          <div className="db-noteline" style={{ marginTop: 0, marginBottom: 14 }}><Icon name="spark" size={13} /> {t.ag.playbookNote}</div>
          {t.ag.plays.map((p: any, i: number) => (
            <div className="db-play" key={i}>
              <span className="db-play-sig">{p.sig}</span>
              <span className="db-play-arrow"><Icon name="chevron" size={13} /></span>
              <span className="db-play-act"><Icon name="zap" size={12} /> {p.act}</span>
            </div>
          ))}
        </div>
      </div>
      </>) : (<>
      <div className="db-grid g-2" style={{ marginTop: 16 }}>
        <div className="db-card">
          <CardHead title={t.ag.guardrails} />
          <div className="db-pad">
            <div className="db-approve"><Switch on={approval} onClick={() => setApproval((v) => !v)} label={t.ag.approval} /><span>{t.ag.approval}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              {t.ag.rules2.map((r: string, i: number) => <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, cursor: "pointer" }}><Switch on={guards[i]} onClick={() => setGuards((p) => p.map((v, j) => j === i ? !v : v))} label={r} /> {r}</label>)}
            </div>
          </div>
        </div>
        <div className="db-card">
          <CardHead title={t.ag.log} />
          <div className="db-pad">
            {t.ag.logItems.map((it: any, i: number) => (
              <div className="db-log-row" key={i}>
                <span className="ic"><Icon name="bot" size={14} /></span>
                <div style={{ flex: 1, minWidth: 0 }}><div className="a">{it.a}</div><div className="db-muted" style={{ fontSize: 11 }}>{it.t}</div></div>
                <span className="db-conf-chip">{it.c}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>)}
    </>
  );
}
