// Sidebar
import React, { useState, useRef, useEffect } from "react";
import { cx, initials } from "../../lib/format";
import { store } from "../../lib/storage";
import { Icon } from "../ui";
import { NAV, SIDE_GROUPS, SIDE_DESKONLY, SIDE_ID2G } from "../../data";
import { LANGS } from "../../i18n";
import { viewLocked } from "../../lib/entitlements";

export function Sidebar({ view, setView, open, lang, setLang, langOpen, setLangOpen, account, channel, onAccount, onPlan, onLogout, tier, onLocked, t }: any) {
  const cur = LANGS.find((l) => l.c === lang);
  const [acctOpen, setAcctOpen] = useState(false);
  const [openG, setOpenG] = useState<Record<string, boolean>>(() => { const saved = store.get<Record<string, boolean> | null>("nav", null); const k = SIDE_ID2G[view]; if (!saved) return { [k || "customers"]: true }; return k ? { ...saved, [k]: true } : saved; });
  useEffect(() => { const k = SIDE_ID2G[view]; if (k) setOpenG((o) => (o[k] ? o : { ...o, [k]: true })); }, [view]);
  useEffect(() => { store.set("nav", openG); }, [openG]);
  const footRef = useRef<any>(null);
  useEffect(() => { if (!acctOpen) return; const h = (e: any) => { if (footRef.current && !footRef.current.contains(e.target)) setAcctOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [acctOpen]);
  const item = (n: any, i: number, deskOnly?: boolean) => {
    const locked = viewLocked(n.id, tier);
    return (
      <button key={n.id} aria-current={view === n.id ? "page" : undefined} aria-disabled={locked || undefined} className={cx("db-navitem", deskOnly && "db-desk-only", view === n.id && "on", locked && "locked")} onClick={locked ? () => onLocked && onLocked(n.id) : () => setView(n.id)}>
        <Icon name={n.icon} size={19} /><span>{t.nav[i]}</span>{locked ? <span className="db-nav-lock" aria-hidden="true"><Icon name="lock" size={13} /></span> : (n.badge ? <span className="bdg">{n.badge}</span> : null)}
      </button>
    );
  };
  return (
    <aside className={cx("db-side", open && "open")}>
      <div className="db-brand">Appido<span className="os">OS</span></div>
      {channel ? <div className="db-ws" role="button" tabIndex={0} onClick={onPlan} title={t.bill.title}><span className="av">{initials(channel.name)}</span><div style={{ minWidth: 0 }}><div className="nm">{channel.planName}</div><div className="pl">{t.bill.perCh} · {channel.daysLeft} {t.bill.daysLeft}</div></div><span className="ch"><Icon name="chevrond" size={16} /></span></div> : null}
      <nav className="db-nav">
        {item(NAV[0], 0, SIDE_DESKONLY.has(0))}
        {item(NAV[11], 11, SIDE_DESKONLY.has(11))}
        {SIDE_GROUPS.map((gr) => (
          <div key={gr.key}>
            <button className={cx("db-navgrp", openG[gr.key] && "open")} aria-expanded={!!openG[gr.key]} onClick={() => setOpenG((o) => ({ ...o, [gr.key]: !o[gr.key] }))}>
              <Icon name={gr.icon} size={17} /><span>{t.grp[gr.key]}</span><span className="cv"><Icon name="chevrond" size={15} /></span>
            </button>
            {openG[gr.key] ? <div className="db-navgrp-items">{gr.idx.map((i) => item(NAV[i], i, SIDE_DESKONLY.has(i)))}</div> : null}
          </div>
        ))}
      </nav>
      <div className="db-sidefoot" ref={footRef}>
        {acctOpen ? (
          <div className="db-acctmenu" role="menu">
            <div className="db-acctmenu-h">{t.grp.acct}</div>
            <button className="db-acctitem" role="menuitem" onClick={() => { setAcctOpen(false); onAccount(); }}><Icon name="user" size={17} /><span>{t.acct.profile}</span></button>
            <button className="db-acctitem" role="menuitem" onClick={() => { setAcctOpen(false); setView("settings"); }}><Icon name="settings" size={17} /><span>{t.nav[10]}</span></button>
            <button className="db-acctitem" role="menuitem" onClick={() => { setAcctOpen(false); setView("transactions"); }}><Icon name={NAV[5].icon} size={17} /><span>{t.nav[5]}</span></button>
            <button className="db-acctitem" role="menuitem" onClick={() => { setAcctOpen(false); onPlan(); }}><Icon name="card" size={17} /><span>{t.bill.title}</span></button>
            <button className="db-acctitem" role="menuitem" onClick={() => { setAcctOpen(false); onLogout(); }}><Icon name="logout" size={17} /><span>{t.acct.signOut}</span></button>
          </div>
        ) : null}
        <button className={cx("db-user", acctOpen && "open")} aria-expanded={acctOpen} aria-haspopup="menu" onClick={() => setAcctOpen((v) => !v)}>
          <span className="av">{initials(account.owner)}</span>
          <div style={{ minWidth: 0 }}><div className="nm">{account.owner}</div><div className="pl" dir="ltr">{account.email}</div></div>
          <span className="db-user-cv"><Icon name="chevrond" size={16} /></span>
        </button>
      </div>
    </aside>
  );
}
