// NotificationSettings
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { store } from "../../lib/storage";
import { Switch, CardHead } from "../ui";

export function NotificationSettings({ t }: any) {
  const n = t.notifset;
  const [p, setP] = useState<any>(() => store.get("notifPrefs", { brief: true, time: 0, telegram: true, email: false, push: true, hot: true, churn: true, pay: true, summary: false }));
  const upd = (patch: any) => setP((prev: any) => { const next = { ...prev, ...patch }; store.set("notifPrefs", next); return next; });
  const row = (k: string, label: string, sub?: string) => (
    <div className="db-nset-row"><div className="db-nset-tx"><div className="db-nset-l">{label}</div>{sub ? <div className="db-nset-s">{sub}</div> : null}</div><Switch on={!!p[k]} onClick={() => upd({ [k]: !p[k] })} label={label} /></div>
  );
  return (
    <div className="db-card"><CardHead title={n.title} icon="bell" /><div className="db-pad">
      <div style={{ fontSize: 12.5, color: "var(--text-2)", marginBottom: 10 }}>{n.desc}</div>
      {row("brief", n.brief, n.briefSub)}
      {p.brief ? <div className="db-pref-row" style={{ marginTop: 6 }}><span className="db-pref-l">{n.time}</span><div className="db-seg">{n.times.map((tm: string, i: number) => <button key={i} className={cx(p.time === i && "on")} onClick={() => upd({ time: i })}>{tm}</button>)}</div></div> : null}
      <div className="db-nset-sec">{n.where}</div>
      {row("telegram", n.chTelegram)}{row("email", n.chEmail)}{row("push", n.chPush)}
      <div className="db-nset-sec">{n.alerts}</div>
      {row("hot", n.aHot)}{row("churn", n.aChurn)}{row("pay", n.aPay)}{row("summary", n.aSummary)}
    </div></div>
  );
}
