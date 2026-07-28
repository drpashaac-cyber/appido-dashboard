// NeedsYou
import React, { useState } from "react";
import { Icon } from "../ui";
import { useDataset } from "../../lib/dataset";

export function NeedsYou({ t, setView, goToChat }: any) {
  const { CONVOS, live } = useDataset();
  const [gone, setGone] = useState(false);
  const lead = CONVOS.find((c) => c.tag === "Hot");
  if (lead && !gone) {
    return (
      <div className="db-hotbar" role="alert">
        <span className="hb-ic"><Icon name="flame" size={22} /></span>
        <button type="button" className="hb-tx hb-tap" onClick={() => setView("actions")}>
          <div className="hb-t">{lead.name} {t.hotReady}</div>
          <div className="hb-s">{lead.intent}% {t.inbox.intent}{live ? "" : ` · ${t.act.plusToday.replace("{n}", "6")}`}</div>
        </button>
        <button className="db-btn db-btn-mint db-btn-sm hb-cta" onClick={() => goToChat(lead.id)}><Icon name="send" size={14} /> {t.hotNow}</button>
        <button className="db-iconbtn hb-x" aria-label={t.common.dismiss} onClick={() => setGone(true)}><Icon name="x" size={16} /></button>
      </div>
    );
  }
  // Live mode has no real decisions endpoint yet.
  // Never show the demo action banner for a real tenant.
  if (live) return null;
  return (
    <button className="db-actbanner" onClick={() => setView("actions")}><span className="ic"><Icon name="zap" size={18} /></span><span className="tx"><b>6 {t.act.bannerT}</b><span>{t.act.bannerS}</span></span><span className="cv"><Icon name="chevron" size={18} /></span></button>
  );
}
