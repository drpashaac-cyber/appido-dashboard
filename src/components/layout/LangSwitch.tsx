// LangSwitch
import React, { useState } from "react";
import { Icon } from "../ui";
import { LANGS } from "../../i18n";

export function LangSwitch({ lang, setLang, t }: any) {
  const [lo, setLo] = useState(false);
  const cur = LANGS.find((l) => l.c === lang);
  return (
    <div style={{ position: "relative" }}>
      <button className="db-iconbtn" onClick={() => setLo((o) => !o)} aria-label={t.langLabel} style={{ width: "auto", padding: "0 12px", gap: 6 }}><Icon name="globe" size={17} /><span style={{ fontSize: 13, fontWeight: 600 }}>{cur ? cur.l : "English"}</span></button>
      {lo && (<>
        <div style={{ position: "fixed", inset: 0, zIndex: 54 }} onClick={() => setLo(false)} />
        <div className="db-pop" style={{ width: 180 }}>
          {LANGS.map((l) => <button key={l.c} className="db-popitem" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", width: "100%", color: l.c === lang ? "var(--mint-bri)" : undefined, fontWeight: l.c === lang ? 700 : 500 }} onClick={() => { setLang(l.c); setLo(false); }}><Icon name="globe" size={14} /> {l.l}{l.c === lang ? <span style={{ marginInlineStart: "auto" }}><Icon name="check" size={14} /></span> : null}</button>)}
        </div>
      </>)}
    </div>
  );
}
