// PaymentGateways — renders the gateway grid from the backend registry catalog (live) or seed (demo).
// Adding a gateway in the backend registry makes it appear here automatically, including
// not-yet-built ones (shown as "coming soon"). The credential form adapts to each gateway's fields.
import React, { useEffect, useState } from "react";
import { cx, buzz } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon, Switch, CardHead } from "../ui";
import { PAY_METHODS } from "../../data";
import { api, apiEnabled, type PayCatalogField } from "../../lib/api";

type Method = { id: string; group: string; available: boolean; fields: PayCatalogField[]; label?: string };

const needsToFields = (needs: string): PayCatalogField[] =>
  needs === "wallet" ? [{ key: "address", label: "Wallet address", type: "text", required: true }]
    : needs === "key" ? [{ key: "key", label: "API key", type: "password", required: true }]
      : [];
// catalog group (rial/global/card/crypto) → the three UI buckets this view shows
const uiGroup = (d: any): string => (d.crypto || d.group === "crypto" ? "crypto" : d.manual || d.kind === "manual" || d.group === "manual" ? "manual" : "instant");
const SEED_METHODS: Method[] = (PAY_METHODS as any[]).map((m) => ({ id: m.id, group: m.group, available: true, fields: needsToFields(m.needs) }));

export function PaymentGateways({ t }: any) {
  const g = t.pay;
  const live = apiEnabled();
  const [methods, setMethods] = useState<Method[]>(SEED_METHODS);
  const [creds, setCreds] = useState<Record<string, { id: string; enabled: boolean }>>({});
  const [localOn, setLocalOn] = useState<Record<string, boolean>>({});
  const [localConn, setLocalConn] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});

  const refreshCreds = () => {
    api.payments.listCredentials().then((rows) => {
      const by: Record<string, { id: string; enabled: boolean }> = {};
      (rows ?? []).forEach((r) => { by[r.method] = { id: r.id, enabled: !!r.enabled }; });
      setCreds(by);
    }).catch(() => {});
  };
  useEffect(() => {
    if (!live) return;
    api.payments.methods().then((cat) => {
      setMethods((cat ?? []).filter((d) => d.platformEnabled !== false).map((d) => ({ id: d.method, group: uiGroup(d), available: d.available !== false, fields: d.fields ?? [], label: d.label })));
    }).catch(() => {});
    refreshCreds();
  }, [live]);

  const nameOf = (m: Method) => (g.methods && g.methods[m.id]) || m.label || m.id;
  const isManual = (m: Method) => m.group === "manual";
  const connected = (m: Method) => (live ? !!creds[m.id] : !!localConn[m.id]);
  const isOn = (m: Method) => (live ? !!creds[m.id]?.enabled : !!localOn[m.id]);
  const kindOf = (m: Method) => (m.group === "crypto" ? "wallet" : m.group === "manual" ? "manual" : "key") as "key" | "wallet" | "manual";

  const groups = [
    { key: "instant", icon: "card" },
    { key: "crypto", icon: "coin" },
    { key: "manual", icon: "clock" },
  ].map((grp) => ({ ...grp, items: methods.filter((m) => m.group === grp.key) })).filter((grp) => grp.items.length > 0);

  const openEditor = (m: Method) => { setEditing(m.id); setVals({}); };
  const requiredOk = (m: Method) => m.fields.filter((f) => f.required && f.type !== "boolean").every((f) => (vals[f.key] || "").trim());

  const save = async (m: Method) => {
    if (!requiredOk(m)) return;
    const secret: Record<string, unknown> = {};
    m.fields.forEach((f) => { if (f.type === "boolean") secret[f.key] = vals[f.key] === "true"; else if ((vals[f.key] || "").trim()) secret[f.key] = vals[f.key].trim(); });
    if (live) {
      try {
        const res = await api.payments.upsertCredential({ method: m.id, kind: kindOf(m), secret });
        if (res?.id) await api.payments.setEnabled(res.id, true);
        setEditing(null); setVals({}); buzz(16); toast(g.connectedToast.replace("{name}", nameOf(m)));
        refreshCreds();
      } catch { toast(g.errToast); }
      return;
    }
    setLocalConn((c) => ({ ...c, [m.id]: true })); setLocalOn((e) => ({ ...e, [m.id]: true }));
    setEditing(null); setVals({}); buzz(16); toast(g.connectedToast.replace("{name}", nameOf(m)));
  };

  const toggle = async (m: Method) => {
    if (!m.available) return;
    const on = !isOn(m);
    if (live) {
      const cred = creds[m.id];
      if (on && !cred) {
        if (isManual(m)) {
          try { const res = await api.payments.upsertCredential({ method: m.id, kind: "manual", secret: {} }); if (res?.id) await api.payments.setEnabled(res.id, true); refreshCreds(); toast(g.liveToast.replace("{name}", nameOf(m))); } catch { toast(g.errToast); }
        } else { openEditor(m); }
        return;
      }
      if (cred) { try { await api.payments.setEnabled(cred.id, on); refreshCreds(); toast((on ? g.liveToast : g.offToast).replace("{name}", nameOf(m))); } catch { toast(g.errToast); } }
      return;
    }
    setLocalOn((e) => ({ ...e, [m.id]: on }));
    if (on) { if (!isManual(m) && !localConn[m.id]) openEditor(m); else toast(g.liveToast.replace("{name}", nameOf(m))); }
    else { if (editing === m.id) setEditing(null); toast(g.offToast.replace("{name}", nameOf(m))); }
  };

  const disconnect = async (m: Method) => {
    if (live) { const cred = creds[m.id]; if (cred) { try { await api.payments.deleteCredential(cred.id); refreshCreds(); toast(g.disconnectedToast.replace("{name}", nameOf(m))); } catch { toast(g.errToast); } } if (editing === m.id) setEditing(null); return; }
    setLocalConn((c) => { const n = { ...c }; delete n[m.id]; return n; }); setLocalOn((e) => ({ ...e, [m.id]: false }));
    if (editing === m.id) setEditing(null); toast(g.disconnectedToast.replace("{name}", nameOf(m)));
  };

  return (
    <>
      <div className="db-card">
        <CardHead title={g.title} icon="coin" />
        <div className="db-pad">
          <div className="db-noteline" style={{ marginBottom: 14 }}><Icon name="users" size={14} /> {g.intro}</div>
          <div className="db-paylegend"><span><span className="db-paydot auto" /> {g.autoLegend}</span><span><span className="db-paydot manual" /> {g.manualLegend}</span></div>
        </div>
      </div>
      {groups.map((grp) => (
        <div className="db-card" key={grp.key}>
          <CardHead title={g.groups[grp.key]} icon={grp.icon} />
          <div className="db-paylist">
            {grp.items.map((m) => {
              const on = isOn(m); const conn = connected(m); const isEditing = editing === m.id; const verify = isManual(m) ? "manual" : "auto";
              return (
                <div className={cx("db-payrow", !m.available && "is-soon")} key={m.id}>
                  <div className="db-payrow-main">
                    <span className="db-payname">{nameOf(m)}</span>
                    {m.available
                      ? <span className={cx("db-payverify", verify)}>{verify === "auto" ? g.autoBadge : g.manualBadge}</span>
                      : <span className="db-payverify soon">{g.comingSoon}</span>}
                    {m.available && on && conn ? <span className="db-paychip"><Icon name="check" size={11} /> {g.connected}</span> : null}
                  </div>
                  <div className="db-payrow-act">
                    {m.available && conn ? <button className="db-mini" onClick={() => openEditor(m)} aria-label={g.editKey} title={g.editKey}><Icon name="key" size={14} /></button> : null}
                    {m.available && conn ? <button className="db-mini danger" onClick={() => disconnect(m)} aria-label={g.disconnect} title={g.disconnect}><Icon name="ban" size={14} /></button> : null}
                    <Switch on={on} onClick={() => toggle(m)} label={nameOf(m)} />
                  </div>
                  {isEditing && m.available ? (
                    <div className="db-paycred">
                      {m.fields.map((f) => (
                        f.type === "boolean" ? (
                          <label key={f.key} className="db-noteline" style={{ gap: 8, margin: 0 }}><Switch on={vals[f.key] === "true"} onClick={() => setVals((v) => ({ ...v, [f.key]: v[f.key] === "true" ? "false" : "true" }))} label={f.label} /> {f.label}</label>
                        ) : (
                          <input key={f.key} className="db-wiz-input" dir="ltr" type={f.type === "password" ? "password" : "text"} value={vals[f.key] || ""} onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))} placeholder={f.label} />
                        )
                      ))}
                      <button className="db-btn db-btn-mint db-btn-sm" disabled={!requiredOk(m)} onClick={() => save(m)}><Icon name="check" size={14} /> {g.connect}</button>
                      <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => { setEditing(null); }}>{g.cancel}</button>
                      <div className="db-paycred-note"><Icon name="shield" size={12} /> {m.group === "crypto" ? g.walletNote : g.keyNote}</div>
                    </div>
                  ) : null}
                  {m.available && on && isManual(m) ? <div className="db-paymanualnote"><Icon name="clock" size={12} /> {g.manualNote}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="db-card"><div className="db-pad"><div className="db-noteline" style={{ margin: 0 }}><Icon name="spark" size={14} /> {g.autoApply}</div></div></div>
    </>
  );
}
