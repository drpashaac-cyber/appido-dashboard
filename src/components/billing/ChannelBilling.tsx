// ChannelBilling
import React, { useState, useEffect } from "react";
import { cx } from "../../lib/format";
import { api, type PublicPlan } from "../../lib/api";
import { Icon, Modal } from "../ui";
import { GATEWAYS, PLAN_NAMES, PLAN_PRICES, GATEWAYS_MORE } from "../../i18n";
import { OnChainReceipt } from "../transactions";

export function ChannelBilling({ channel, t, lang, onClose, onPay }: any) {
  const b = t.bill;
  const [plan, setPlan] = useState(1);
  const [gw, setGw] = useState(GATEWAYS[0]);
  const [more, setMore] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const live = api.enabled();
  const [livePlans, setLivePlans] = useState<PublicPlan[] | null>(null);
  const [paying, setPaying] = useState(false);
  useEffect(() => { if (live) api.plans().then(setLivePlans).catch(() => {}); }, [live]);
  const fmtPrice = (cents: number, cur: string) => (cur === "USD" ? "$" + Math.round(cents / 100) : Math.round(cents / 100) + " " + cur);
  // Live catalog drives the picker (owner-edited prices show here too); falls back to constants in demo.
  const plansList = (livePlans && livePlans.length)
    ? livePlans.map((pl) => ({ name: pl.name, price: fmtPrice(pl.priceCents, pl.currency), key: pl.key }))
    : PLAN_NAMES.map((nm: string, i: number) => ({ name: nm, price: PLAN_PRICES[i], key: ["start", "pro"][i] || nm.toLowerCase() }));
  const sel = Math.max(0, Math.min(plan, plansList.length - 1));
  const doPay = async () => {
    if (live) {
      setPaying(true);
      try {
        const r = await api.billing.checkout(plansList[sel].key);
        if (r && r.redirectUrl) { window.location.href = r.redirectUrl; return; }
      } catch { /* fall through to the local handler below */ }
      setPaying(false);
    }
    onPay(sel, gw);
  };
  if (!channel) return null;
  const pct = Math.min(100, Math.round((channel.daysLeft / (channel.daysTotal || 1)) * 100));
  const low = channel.daysLeft < 7;
  return (
    <>
    <Modal title={b.title + " · " + channel.name} onClose={onClose}>
      <div className="db-bill-status">
        <div className="row"><span className="pl">{channel.planName || (channel.paid ? PLAN_NAMES[0] : b.trial)}</span><span className={cx("dl", low && "warn")}>{`${channel.daysLeft} ${b.daysLeft}`}</span></div>
        <div className="bar"><span className={cx(low && "warn")} style={{ width: pct + "%" }} /></div>
      </div>
      <div className="db-offer-gt db-offer-gt-bill"><span className="db-offer-gt-ic"><Icon name="shield" size={15} /></span><div className="m"><div className="t">{t.offer.gtTitle}</div><div className="s">{t.offer.gtBody}</div></div></div>
      <div className="db-bill-sec">{b.history}</div>
      <div className="db-bill-hist">
        {(channel.payments && channel.payments.length) ? channel.payments.map((p: any, i: number) => { const isCrypto = /USDT/.test(p.gw); return (
          <div className={cx("db-bill-row", isCrypto && "db-bill-tap")} key={i} onClick={isCrypto ? () => setReceipt({ name: (channel.name || "Appido") + "#" + i, amount: p.amt, gw: p.gw, time: p.d }) : undefined} role={isCrypto ? "button" : undefined} tabIndex={isCrypto ? 0 : undefined} aria-label={isCrypto ? t.chain.verifyHint : undefined}><span className="ok"><Icon name="check" size={12} /></span><span className="d">{p.d}</span><span className="g" dir="ltr">{p.gw}</span><span className="a" dir="ltr">{p.amt}</span>{isCrypto ? <span className="db-bill-cv"><Icon name="chevron" size={13} /></span> : null}</div>
        ); }) : <div className="db-bill-empty">{b.noHistory}</div>}
      </div>
      <div className="db-bill-sec">{b.renew}</div>
      <div className="db-bill-plans">
        {plansList.map((pl, i: number) => <button key={i} className={cx("db-bill-plan", sel === i && "on")} onClick={() => setPlan(i)}><span className="pd">{pl.name}</span><span className="pp">{pl.price}</span><span className="psub">{t.ch.perMonth} · {b.perCh}</span></button>)}
      </div>
      <div className="db-bill-sec sm">{b.method}</div>
      <div className="db-bill-gw">{[...GATEWAYS, ...(more ? GATEWAYS_MORE : [])].map((g) => <button key={g} className={cx("db-gw", gw === g && "on")} onClick={() => setGw(g)}><Icon name="check" size={12} /> {g}</button>)}{!more ? <button className="db-gw db-gw-add" onClick={() => setMore(true)}><Icon name="plus" size={12} /> {t.common.moreMethods}</button> : null}</div>
      <button className="db-btn db-btn-mint" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} disabled={paying} onClick={doPay}><Icon name="card" size={16} /> {b.pay} {plansList[sel].price}</button>
    </Modal>
    {receipt ? <OnChainReceipt t={t} lang={lang} txn={receipt} mode="out" z={130} onClose={() => setReceipt(null)} /> : null}
    </>
  );
}
