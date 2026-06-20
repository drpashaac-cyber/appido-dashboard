// ChannelEmpty
import React from "react";
import { Icon } from "../ui";
import { LangSwitch } from "../layout";

export function ChannelEmpty({ t, theme, setTheme, lang, setLang, onAdd }: any) {
  return (
    <div className="db-chempty">
      <div className="db-chempty-top">
        <div className="db-brand" style={{ color: "var(--text)" }}>Appido<span className="os">OS</span></div>
        <span style={{ marginInlineStart: "auto" }} />
        <LangSwitch lang={lang} setLang={setLang} t={t} />
        <button className="db-iconbtn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme"><Icon name={theme === "dark" ? "sun" : "moon"} size={18} /></button>
      </div>
      <div className="db-chempty-mid">
        <span className="db-chempty-ic"><Icon name="inbox" size={34} /></span>
        <h2>{t.ch.emptyTitle}</h2>
        <p>{t.ch.emptySub}</p>
        <button className="db-btn db-btn-mint db-chempty-cta" onClick={onAdd}><Icon name="plus" size={16} /> {t.ch.emptyCta}</button>
      </div>
    </div>
  );
}
