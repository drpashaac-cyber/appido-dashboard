// BusinessHub
import React, { useState, useMemo } from "react";
import { cx, fmt, money, fmtDateTime, initials } from "../../lib/format";
import { deviceInfo } from "../../lib/device";
import { Icon, AreaChart, Donut, CardHead, Kpi } from "../ui";
import { KPIS, REVENUE, GENDER } from "../../data";
import { PLAN_NAMES } from "../../i18n";
import { LangSwitch } from "../layout";

export function BusinessHub({ channels, t, theme, setTheme, lang, setLang, account, onManageAccount, onOpen, onAdd, onBilling }: any) {
  const dev = useMemo(deviceInfo, []);
  const [loginAt] = useState(() => new Date());
  const totalRev = channels.reduce((a: number, c: any) => a + (c.rev || 0), 0);
  const totalMem = channels.reduce((a: number, c: any) => a + (c.members || 0), 0);
  const gAvg = channels.length ? Math.round(channels.reduce((a: number, c: any) => a + (c.growth || 0), 0) / channels.length) : 0;
  const kpis = [
    { label: t.hub.totalRev, k: { v: money(totalRev), delta: gAvg, spark: KPIS[0].spark, tone: "mint" } },
    { label: t.hub.totalUsers, k: { v: fmt(totalMem), delta: 9, spark: KPIS[1].spark, tone: "" } },
    { label: t.hub.growth, k: { v: "+" + gAvg + "%", delta: gAvg, spark: KPIS[2].spark, tone: "" } },
  ];
  const acct: [string, string][] = [["pin", `${dev.os} · ${dev.browser}`], ["globe", dev.tz], ["file", dev.screen], ["clock", fmtDateTime(loginAt, lang)]];
  const acctLabels = [t.hub.thisDevice, t.hub.location, t.hub.screen, t.hub.lastLogin];
  return (
    <div className="db-hub">
      <header className="db-hub-top">
        <div className="db-brand" style={{ color: "var(--text)", padding: 0 }}>Appido<span className="os">OS</span></div>
        <span style={{ marginInlineStart: "auto" }} />
        <LangSwitch lang={lang} setLang={setLang} t={t} />
        <button className="db-iconbtn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme"><Icon name={theme === "dark" ? "sun" : "moon"} size={18} /></button>
      </header>
      <div className="db-hub-body">
        <div className="db-hub-head">
          <div><h1>{t.hub.title}</h1><p>{t.hub.sub}</p></div>
          <button className="db-btn db-btn-mint" onClick={onAdd}><Icon name="plus" size={16} /> {t.ch.add}</button>
        </div>
        <div className="db-kpis" style={{ marginBottom: 24 }}>
          {kpis.map((x, i) => <Kpi key={i} label={x.label} k={x.k} />)}
          <div className="db-kpi"><div className="k">{t.hub.channels}</div><div className="v">{channels.length}</div><div className="db-muted" style={{ fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}><Icon name="check" size={13} /> Telegram</div></div>
        </div>
        <div className="db-grid g-hero" style={{ marginBottom: 24 }}>
          <div className="db-card"><CardHead title={t.hub.growth} right={<span className="db-chip"><Icon name="arrowUp" size={12} /> +{gAvg}%</span>} /><div className="db-pad"><AreaChart data={REVENUE} /></div></div>
          <div className="db-card"><CardHead title={t.hub.audience} /><div className="db-pad" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}><Donut segs={GENDER} /><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{GENDER.map((g, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: g.c }} />{t.aud.genders[i]} <span className="db-muted">· {g.v}%</span></div>)}</div></div></div>
        </div>
        <div className="db-card" style={{ marginBottom: 24 }}>
          <CardHead title={t.hub.yourChannels} right={<button className="db-btn db-btn-ghost db-btn-sm" onClick={onAdd}><Icon name="plus" size={14} /> {t.ch.add}</button>} />
          <div className="db-pad"><div className="db-chgrid">
            {channels.map((c: any) => {
              const pct = Math.min(100, Math.round((c.daysLeft / (c.daysTotal || 1)) * 100)); const low = c.daysLeft < 7;
              return (
                <div className="db-chcard" key={c.id}>
                  <div className="cc-top"><span className="db-chsw-av" style={{ width: 38, height: 38, borderRadius: 12, fontSize: 14 }}>{initials(c.name)}</span><div style={{ minWidth: 0 }}><div className="cc-nm">{c.name}</div><div className="cc-mt" dir="ltr">{c.username} · {fmt(c.members)} {t.ch.members}</div></div></div>
                  <div className="cc-sub">
                    <div className="cc-sub-h"><span className="cc-plan">{c.planName || (c.paid ? PLAN_NAMES[0] : t.bill.trial)}</span><span className={cx("cc-days", low && "warn")}>{`${c.daysLeft} ${t.bill.daysLeft}`}</span></div>
                    <div className="cc-bar"><span className={cx(low && "warn")} style={{ width: pct + "%" }} /></div>
                  </div>
                  <div className="cc-acts"><button className="db-btn db-btn-mint db-btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => onOpen(c.id)}>{t.hub.open}</button><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => onBilling(c.id)}><Icon name="card" size={14} /> {t.hub.manage}</button></div>
                </div>
              );
            })}
          </div></div>
        </div>
        <div className="db-card">
          <CardHead title={t.hub.account} icon="pin" right={<button className="db-btn db-btn-ghost db-btn-sm" onClick={onManageAccount}>{t.acct.manage}</button>} />
          <div className="db-pad">
            <div className="db-acct-id"><span className="db-av">{initials(account.owner || "U")}</span><div><div style={{ fontWeight: 650, fontSize: 14 }}>{account.owner}</div><div className="db-muted" style={{ fontSize: 12.5 }} dir="ltr">{account.email}</div></div></div>
            <div className="db-acct-grid">
              {acct.map(([ic, v], i) => <div className="db-acct-row" key={i}><span className="ai"><Icon name={ic} size={15} /></span><div style={{ minWidth: 0 }}><div className="al">{acctLabels[i]}</div><div className="av2" dir="ltr">{v}</div></div></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
