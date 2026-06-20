// SettingsView
import React, { useState, useMemo, useEffect } from "react";
import { cx, money, initials, relWhen } from "../../lib/format";
import { toast } from "../../lib/toast";
import { deviceInfo } from "../../lib/device";
import { Icon, Switch, PageHead, CardHead } from "../ui";
import { TEAM } from "../../data";
import { PLAN_NAMES, PLAN_PRICES, GATEWAYS, GATEWAYS_MORE } from "../../i18n";
import { TwoFASetup } from "../auth";
import { LangSwitch, NotificationSettings } from "../layout";
import { api } from "../../lib/api";
import { PaymentGateways } from "./PaymentGateways";
import { BotStatus } from "./BotStatus";
import { PrivacyPrefsModal } from "./PrivacyPrefsModal";

export function SettingsView({ t, channel, onBilling, twoFA, setTwoFA, sessions, onRevoke, onRevokeAll, onManageAccount, account, consent, onConsentSave, lang, setLang, theme, setTheme, onRefer, onChannelChanged }: any) {
  const subIdx = channel ? PLAN_NAMES.indexOf(channel.planName) : -1;
  const dev = useMemo(deviceInfo, []);
  const curIcon = /iOS|Android/i.test(dev.os) ? "phone" : "laptop";
  const [faOpen, setFaOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [pace, setPace] = useState(0);
  const [miniApp, setMiniApp] = useState(true);
  const [stars, setStars] = useState(true);
  const [tab, setTab] = useState("plan");
  const subPrice = subIdx >= 0 ? PLAN_PRICES[subIdx] : null;
  // Live: the tenant's real Appido subscription (single backend truth) overrides the seeded channel plan.
  const [liveSub, setLiveSub] = useState<any>(null);
  useEffect(() => { if (api.enabled()) api.billing.subscription().then(setLiveSub).catch(() => {}); }, []);
  const sub = liveSub && liveSub.subscription;
  const livePlan = sub ? ((liveSub.plans || []).find((p: any) => p.key === sub.plan) || null) : null;
  const livePlanName = sub ? (livePlan ? livePlan.name : sub.plan) : null;
  const liveDaysLeft = sub && sub.periodEnd ? Math.max(0, Math.ceil((new Date(sub.periodEnd).getTime() - Date.now()) / 86400000)) : null;
  const planLabel = livePlanName || (channel ? channel.planName : PLAN_NAMES[0]);
  const daysText = liveDaysLeft != null ? liveDaysLeft + " " + t.bill.daysLeft : (channel ? channel.daysLeft + " " + t.bill.daysLeft : "");
  const priceText = livePlan ? (livePlan.currency === "USD" ? "$" + Math.round(livePlan.priceCents / 100) : Math.round(livePlan.priceCents / 100) + " " + livePlan.currency) : subPrice;
  return (
    <>
      <PageHead title={t.set.title} sub={t.set.sub} />
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={tab === "plan"} className={cx(tab === "plan" && "on")} onClick={() => setTab("plan")}><span className="ic"><Icon name="card" size={15} /></span><span>{t.set.tabs.plan}</span></button>
        <button role="tab" aria-selected={tab === "channel"} className={cx(tab === "channel" && "on")} onClick={() => setTab("channel")}><span className="ic"><Icon name="send" size={15} /></span><span>{t.set.tabs.channel}</span></button>
        <button role="tab" aria-selected={tab === "payments"} className={cx(tab === "payments" && "on")} onClick={() => setTab("payments")}><span className="ic"><Icon name="coin" size={15} /></span><span>{t.set.tabs.payments}</span></button>
        <button role="tab" aria-selected={tab === "workspace"} className={cx(tab === "workspace" && "on")} onClick={() => setTab("workspace")}><span className="ic"><Icon name="globe" size={15} /></span><span>{t.set.tabs.workspace}</span></button>
        <button role="tab" aria-selected={tab === "security"} className={cx(tab === "security" && "on")} onClick={() => setTab("security")}><span className="ic"><Icon name="shield" size={15} /></span><span>{t.set.tabs.security}</span></button>
      </div>
      {tab === "plan" ? (
        <div className="db-grid g-2">
        <div className="db-card"><CardHead title={t.set.appidoSub} /><div className="db-pad"><div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}><div><div style={{ fontWeight: 700, fontSize: 18 }}>{planLabel}{priceText ? " · " + priceText : ""}</div><div className="db-muted" style={{ fontSize: 12.5 }}>{t.bill.perCh}{daysText ? " · " + daysText : ""}</div></div><button className="db-btn db-btn-mint db-btn-sm" style={{ marginInlineStart: "auto" }} onClick={onBilling}>{t.set.manage}</button></div><div className="db-offer-roi"><div><div className="db-offer-roi-cap">{t.offer.roiCap}</div><div className="db-offer-roi-v">{money(32800)}</div></div><span className="db-offer-roi-x">{t.offer.roiX.replace("{x}", String(Math.round(32800 / (parseInt((subPrice || "$179").replace(/[^0-9]/g, ""), 10) || 179))))}</span></div><div className="db-offer-gt"><span className="db-offer-gt-ic"><Icon name="shield" size={15} /></span><div className="m"><div className="t">{t.offer.gtTitle}</div><div className="s">{t.offer.gtBody}</div></div></div><div className="db-noteline" style={{ marginTop: 14, marginBottom: 0 }}><Icon name="spark" size={14} /> {t.set.planNote}</div></div></div>
        <div className="db-card"><CardHead title={t.set.billWith} /><div className="db-pad"><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[...GATEWAYS, ...GATEWAYS_MORE].map((p) => <span key={p} className="db-chip"><Icon name="check" size={12} /> {p}</span>)}</div></div></div>
        </div>
      ) : tab === "channel" ? (
        <div className="db-grid g-2">
        <BotStatus t={t} channel={channel} onChanged={onChannelChanged} />
        <div className="db-card">
          <CardHead title={t.tgs.safeTitle} icon="shield" right={<span className="db-chip" style={{ background: "rgba(63,140,91,.16)", color: "var(--good)" }}><Icon name="check" size={12} /> {t.tgs.safeStatus}</span>} />
          <div className="db-pad">
            <div className="db-noteline" style={{ marginBottom: 16 }}><Icon name="shield" size={14} /> {t.tgs.safeIntro}</div>
            <div className="db-tgs-meter"><div className="r"><span>{t.tgs.safeHealthLab}</span><b style={{ color: "var(--good)" }}>94% · {t.tgs.safeRisk}</b></div><div className="tk"><i className="good" style={{ width: "94%" }} /></div></div>
            <div className="db-tgs-meter"><div className="r"><span>{t.tgs.safeBudgetLab}</span><b dir="ltr">340 / 4,000</b></div><div className="tk"><i style={{ width: "9%" }} /></div><div className="nt">{t.tgs.safeBudgetNote}</div></div>
            <div className="db-tgs-guards">{t.tgs.guards.map((g: string, i: number) => <div className="g" key={i}><Icon name="check" size={13} /> <span>{g}</span></div>)}</div>
            <div className="db-tgs-pace"><label>{t.tgs.paceLab}</label><div className="db-seg">{t.tgs.pace.map((p: string, i: number) => <button key={i} className={cx(pace === i && "on")} onClick={() => setPace(i)}>{p}</button>)}</div><div className="nt">{t.tgs.paceNote}</div></div>
          </div>
        </div>
        <div className="db-card">
          <CardHead title={t.tgs.natTitle} icon="send" />
          <div className="db-pad">
            <div className="db-tgs-tg"><div className="m"><div className="t">{t.tgs.miniLab}</div><div className="s">{t.tgs.miniNote}</div></div><Switch on={miniApp} onClick={() => setMiniApp((v: boolean) => !v)} /></div>
            {miniApp && <div className="db-tgs-link"><span dir="ltr" style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--text-2)" }}>t.me/brand_sales_bot/shop</span><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => { try { (navigator as any).clipboard?.writeText?.("https://t.me/brand_sales_bot/shop"); } catch (e) {} toast(t.tgs.copied); }}><Icon name="copy" size={13} /> {t.tgs.copy}</button></div>}
            <div className="db-tgs-tg" style={{ marginTop: 14 }}><div className="m"><div className="t">{t.tgs.starsLab}</div><div className="s">{t.tgs.starsNote}</div></div><Switch on={stars} onClick={() => setStars((v: boolean) => !v)} /></div>
          </div>
        </div>
        </div>
      ) : tab === "payments" ? (
        <PaymentGateways t={t} />
      ) : tab === "workspace" ? (
        <div className="db-grid g-2">
        <div className="db-card"><CardHead title={t.set.team} right={<button className="db-btn db-btn-ghost db-btn-sm" onClick={() => toast(t.toast.invited)}><Icon name="plus" size={14} /> {t.set.invite}</button>} /><div className="db-list">{TEAM.map((m, i) => <div className="db-li" key={i}><span className="db-av" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(m.n)}</span><div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.n}</div><div className="db-muted" style={{ fontSize: 12 }}>{m.e}</div></div><span className="db-chip" style={{ marginInlineStart: "auto" }}>{t.set.roles[m.role] || m.role}</span></div>)}</div></div>
        <div className="db-card"><CardHead title={t.prefs.prefsTitle} icon="globe" /><div className="db-pad">
          <div className="db-pref-row"><span className="db-pref-l">{t.prefs.language}</span><LangSwitch lang={lang} setLang={setLang} t={t} /></div>
          <div className="db-pref-row"><span className="db-pref-l">{t.prefs.appearance}</span><div className="db-seg"><button className={cx(theme !== "dark" && "on")} onClick={() => setTheme && setTheme("light")}><Icon name="sun" size={14} /> {t.prefs.light}</button><button className={cx(theme === "dark" && "on")} onClick={() => setTheme && setTheme("dark")}><Icon name="moon" size={14} /> {t.prefs.dark}</button></div></div>
          <div className="db-noteline" style={{ marginTop: 8, marginBottom: 0 }}><Icon name="globe" size={14} /> {t.prefs.syncNote}</div>
        </div></div>
        <NotificationSettings t={t} />
        <div className="db-card"><CardHead title={t.ref.title} icon="gift" /><div className="db-pad">
          <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 12 }}>{t.ref.subtitle} — {t.ref.body}</div>
          <button className="db-btn db-btn-mint" style={{ width: "100%" }} onClick={() => onRefer && onRefer()}><Icon name="gift" size={15} /> {t.ref.title}</button>
        </div></div>
        </div>
      ) : (<>
      <div className="db-card db-sec" style={{ marginTop: 18 }}>
        <CardHead title={t.security.title} icon="shield" />
        <div className="db-pad">
          <div className="db-sec-secttl">{t.security.sessions}</div>
          <div className="db-sesslist">
            <div className="db-sess">
              <span className="db-sess-ic"><Icon name={curIcon} size={16} /></span>
              <div className="db-sess-main"><div className="db-sess-t">{dev.os} · {dev.browser} <span className="db-sess-here">{t.security.thisDevice}</span></div><div className="db-sess-s"><Icon name="dot" size={9} /> {t.security.activeNow} · {dev.tz}</div></div>
            </div>
            {(sessions || []).map((sv: any) => (
              <div className="db-sess" key={sv.id}>
                <span className="db-sess-ic"><Icon name={sv.icon} size={16} /></span>
                <div className="db-sess-main"><div className="db-sess-t">{sv.os} · {sv.app}</div><div className="db-sess-s" dir="ltr">{sv.city} · {relWhen(sv.ago, t)}</div></div>
                <button className="db-btn db-btn-ghost db-btn-sm db-sess-revoke" onClick={() => { onRevoke && onRevoke(sv.id); toast(t.security.revoked); }}>{t.security.revoke}</button>
              </div>
            ))}
            {(sessions || []).length === 0 ? <div className="db-sess-empty">{t.security.noOthers}</div> : null}
          </div>
          {(sessions || []).length > 0 ? <button className="db-btn db-btn-ghost db-sec-revokeall" onClick={() => { onRevokeAll && onRevokeAll(); toast(t.security.revokedAll); }}><Icon name="logout" size={15} /> {t.security.revokeAll}</button> : null}
          <div className="db-sec-div" />
          <div className="db-sec-row">
            <span className="db-sec-ic"><Icon name="shield" size={16} /></span>
            <div className="db-sec-main"><div className="db-sec-t">{t.security.twoFA}</div><div className="db-sec-d">{t.security.twoFADesc}</div></div>
            <div className="db-sec-ctrl">{twoFA ? <span className="db-chip"><Icon name="check" size={12} /> {t.security.on}</span> : null}<button className={cx("db-btn db-btn-sm", twoFA ? "db-btn-ghost" : "db-btn-mint")} onClick={() => { if (twoFA) { setTwoFA && setTwoFA(false); toast(t.security.twoFAOff); } else { setFaOpen(true); } }}>{twoFA ? t.security.disable : t.security.enable}</button></div>
          </div>
          <div className="db-sec-row">
            <span className="db-sec-ic"><Icon name="key" size={16} /></span>
            <div className="db-sec-main"><div className="db-sec-t">{t.acct.password}</div><div className="db-sec-d">••••••••</div></div>
            <div className="db-sec-ctrl"><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => onManageAccount && onManageAccount()}>{t.acct.changePassword}</button></div>
          </div>
          <div className="db-sec-row">
            <span className="db-sec-ic"><Icon name="list" size={16} /></span>
            <div className="db-sec-main"><div className="db-sec-t">{t.consent.prefsTitle}</div><div className="db-sec-d">{t.consent.manageDesc}</div></div>
            <div className="db-sec-ctrl"><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setPrefsOpen(true)}>{t.consent.manage}</button></div>
          </div>
        </div>
      </div>
      <div className="db-card db-secstat" style={{ marginTop: 18 }}>
        <CardHead title={t.sec.security} icon="shield" />
        <div className="db-pad">
          <div className="db-secstat-grid">
            <div className="db-secstat-it ok"><span className="ic"><Icon name="check" size={14} /></span><div className="m"><div className="t">{t.sec.encryption}</div></div></div>
            <div className="db-secstat-it ok"><span className="ic"><Icon name="check" size={14} /></span><div className="m"><div className="t">{t.sec.webhook}</div></div></div>
            <div className="db-secstat-it"><span className="ic"><Icon name="clock" size={14} /></span><div className="m"><div className="t">{t.sec.rotated}</div><div className="s">{t.sec.rotatedV}</div></div></div>
            <div className={cx("db-secstat-it", twoFA && "ok")}><span className="ic"><Icon name="shield" size={14} /></span><div className="m"><div className="t">{t.sec.twofa}</div><div className="s">{twoFA ? t.security.on : t.security.off}</div></div></div>
            <div className="db-secstat-it ok"><span className="ic"><Icon name="check" size={14} /></span><div className="m"><div className="t">{t.sec.gateways}</div><div className="s">{t.sec.operational}</div></div></div>
          </div>
        </div>
      </div>
      </>)}
      {faOpen && <TwoFASetup t={t} email={account && account.email} onEnabled={() => { setTwoFA && setTwoFA(true); setFaOpen(false); toast(t.security.twoFAOn); }} onClose={() => setFaOpen(false)} />}
      {prefsOpen && <PrivacyPrefsModal t={t} value={consent} onSave={(c2: any) => { onConsentSave && onConsentSave(c2); setPrefsOpen(false); toast(t.consent.saved); }} onClose={() => setPrefsOpen(false)} />}
    </>
  );
}
