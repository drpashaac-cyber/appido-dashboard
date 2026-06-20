// Topbar
import React, { useState } from "react";
import { cx, initials } from "../../lib/format";
import { Icon } from "../ui";
import { useDataset } from "../../lib/dataset";
import { LANGS, NOTIF_META } from "../../i18n";
import { ChannelSwitcher } from "./ChannelSwitcher";

export function Topbar({ theme, setTheme, lang, setLang, onPick, channels, activeId, onSwitch, onAddChannel, onHub, onOperator, onNav, t }: any) {
  const { CONVOS } = useDataset();
  const [notif, setNotif] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = query ? CONVOS.filter((c) => (c.name + " " + c.handle + " " + c.who).toLowerCase().includes(query)).slice(0, 6) : [];
  const pick = (id: number) => { onPick(id); setQ(""); };
  return (
    <header className="db-top">
      <ChannelSwitcher channels={channels} activeId={activeId} onSwitch={onSwitch} onAdd={onAddChannel} onHub={onHub} t={t} />
      <div className="db-search">
        <Icon name="search" size={16} />
        <input placeholder={t.search} aria-label={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
        {query && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 54 }} onClick={() => setQ("")} />
            <div className="db-searchpop" role="listbox">
              {results.length > 0 ? results.map((c) => (
                <button key={c.id} className="db-searchitem" role="option" onClick={() => pick(c.id)}>
                  <span className="db-av" style={{ width: 28, height: 28, fontSize: 11 }}>{initials(c.name)}</span>
                  <div style={{ minWidth: 0, textAlign: "start" }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div><div className="db-muted" style={{ fontSize: 11.5 }} dir="ltr">{c.handle}</div></div>
                  <span className={cx("db-tag", c.tag.toLowerCase())} style={{ marginInlineStart: "auto", flexShrink: 0 }}>{t.tags[c.tag]}</span>
                </button>
              )) : <div className="db-searchempty">{t.searchEmpty}</div>}
            </div>
          </>
        )}
      </div>
      <span style={{ marginInlineStart: "auto" }} />
      <div style={{ position: "relative" }}>
        <button className="db-iconbtn" aria-label={t.prefs.prefsTitle} title={t.prefs.prefsTitle} aria-expanded={prefsOpen} onClick={() => setPrefsOpen((v: boolean) => !v)}><Icon name="globe" size={18} /></button>
        {prefsOpen && (<><div style={{ position: "fixed", inset: 0, zIndex: 55 }} onClick={() => setPrefsOpen(false)} /><div className="db-pop db-prefpop db-pop-top"><div className="db-pref-sec">{t.prefs.appearance}</div><div className="db-seg db-pref-seg"><button className={cx(theme !== "dark" && "on")} onClick={() => setTheme("light")}><Icon name="sun" size={14} /> {t.prefs.light}</button><button className={cx(theme === "dark" && "on")} onClick={() => setTheme("dark")}><Icon name="moon" size={14} /> {t.prefs.dark}</button></div><div className="db-pref-sec">{t.prefs.language}</div>{LANGS.map((l) => <button key={l.c} className="db-popitem db-pref-lang" style={{ color: l.c === lang ? "var(--mint-bri)" : undefined, fontWeight: l.c === lang ? 700 : 500 }} onClick={() => setLang(l.c)}><Icon name="globe" size={14} /> {l.l}{l.c === lang ? <span style={{ marginInlineStart: "auto" }}><Icon name="check" size={14} /></span> : null}</button>)}<div className="db-pref-note"><Icon name="check" size={12} /> {t.prefs.syncNote}</div></div></>)}
      </div>
      <button className="db-iconbtn db-op-launch" aria-label={t.op.enter} title={t.op.enter} onClick={() => onOperator && onOperator()}><Icon name="phone" size={18} /></button>
      <div style={{ position: "relative" }}>
        <button className="db-iconbtn" aria-label={t.notif.title} aria-expanded={notif} onClick={() => setNotif((v) => !v)}><Icon name="bell" size={18} /><span className="ping" /></button>
        {notif && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 55 }} onClick={() => setNotif(false)} />
            <div className="db-pop db-pop-top">
              <div style={{ fontWeight: 700, fontSize: 12.5, padding: "6px 12px 8px" }}>{t.notif.title}</div>
              {t.notif.items.map((it: any, i: number) => { const meta = NOTIF_META[i] || {}; return (<button className="db-popitem db-notif-item" key={i} onClick={() => { setNotif(false); onNav && onNav(meta.view || "overview"); }}><span className="db-notif-ic"><Icon name={meta.icon || "bell"} size={15} /></span><span className="db-notif-tx"><span className="db-notif-t">{it.t}</span><span className="db-notif-s">{it.s}</span></span></button>); })}
              <button className="db-notif-foot" onClick={() => { setNotif(false); onNav && onNav("settings"); }}><Icon name="settings" size={13} /> {t.notifset.title}</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
