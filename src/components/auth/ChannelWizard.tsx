// ChannelWizard
import React, { useState, useEffect } from "react";
import { cx, fmt, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";
import { GATEWAYS, PLAN_NAMES, PLAN_PRICES, GATEWAYS_MORE } from "../../i18n";
import { api } from "../../lib/api";

export function ChannelWizard({ t, onConnect, onClose, email }: any) {
  const c = t.ch;
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"pay" | "code">("pay");
  const [planIdx, setPlanIdx] = useState(0);
  const [gw, setGw] = useState(GATEWAYS[0]);
  const [more, setMore] = useState(false);
  const [paid, setPaid] = useState(false);
  const [genCode, setGenCode] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [v5, setV5] = useState<"idle" | "checking" | "ok">("idle");
  const [sel, setSel] = useState<number | null>(0);
  const live = api.enabled();
  const [botInfo, setBotInfo] = useState<{ username?: string; firstName?: string } | null>(null);
  const [connected, setConnected] = useState<{ channelId: string; botUsername: string | null; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [trialDays, setTrialDays] = useState(14);
  useEffect(() => { if (live) api.settings().then((s: any) => setTrialDays(s.trialDays || 14)).catch(() => {}); }, [live]);
  const TOTAL = 7;
  const tokenOk = /^\d{6,12}:[A-Za-z0-9_-]{30,}$/.test(token.trim());
  const tokenErr = token.trim().length > 0 && !tokenOk;
  const codeOk = /^APD-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/i.test(code.trim());
  const codeErr = code.trim().length > 0 && !codeOk;
  const isFree = mode === "pay" && planIdx === 2;
  const activated = (mode === "pay" && (isFree || paid)) || (mode === "code" && codeOk);
  const mem = [4200, 9100, 6700];
  const PLANS = [{ name: PLAN_NAMES[0], price: PLAN_PRICES[0], sub: c.perMonth + " · " + t.bill.perCh }, { name: PLAN_NAMES[1], price: PLAN_PRICES[1], sub: c.perMonth + " · " + t.bill.perCh }, { name: c.freeTrial, price: c.free, sub: c.noCard, free: true }];
  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const POOL = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const rnd = (n: number) => Array.from({ length: n }, () => POOL[Math.floor(Math.random() * POOL.length)]).join("");
  const gen = () => "APD-" + rnd(4) + "-" + rnd(4);
  const doPay = () => { setPaid(true); setGenCode(gen()); };
  const copyCode = () => { try { (navigator as any).clipboard?.writeText(genCode); } catch (e) { /* noop */ } toast(c.copied); };
  // Live: validate the token against Telegram (getMe) before advancing.
  const verifyTokenLive = () => {
    setBusy(true); setErr("");
    api.telegram.verifyToken(token.trim())
      .then((info: any) => { setBotInfo(info); setBusy(false); next(); })
      .catch(() => { setBusy(false); setErr(c.s2err); });
  };
  // Live: this is the real connection — stores the token and registers the Telegram webhook so the
  // dashboard becomes the command room for the tenant's bot. Demo keeps the simulated check.
  const verify5 = () => {
    if (live) {
      setV5("checking"); setErr("");
      api.telegram.connect(token.trim(), botInfo?.username)
        .then((res: any) => { setConnected(res); setV5("ok"); })
        .catch(() => { setV5("idle"); toast(c.s2err); });
      return;
    }
    setV5("checking"); setTimeout(() => setV5("ok"), 900);
  };
  const connect = () => {
    if (live) {
      const uname = connected?.botUsername || botInfo?.username || "";
      onConnect({ id: connected?.channelId || ("ch" + Date.now()), name: botInfo?.username || c.discover[0], username: uname ? "@" + uname : "", botUsername: uname || null, members: 0, date: t.common.today, rev: 0, growth: 0, paid: !isFree, planName: isFree ? t.bill.trial : (PLAN_NAMES[planIdx] || PLAN_NAMES[0]), daysLeft: isFree ? trialDays : 30, daysTotal: isFree ? trialDays : 30, payments: [], live: true });
      return;
    }
    const nm = c.discover[0], members = mem[0];
    const free = isFree, code_ = mode === "code";
    const method = code_ ? "Code" : (free ? "Trial" : gw);
    const planName = free ? t.bill.trial : (code_ ? PLAN_NAMES[0] : PLAN_NAMES[planIdx]);
    const days = free ? trialDays : 30;
    onConnect({ id: "ch" + Date.now(), name: nm, username: "@" + nm.toLowerCase().replace(/\s+/g, "_"), members, date: t.common.today, rev: Math.round(members * 3.6), growth: 16, paid: !free, planName, daysLeft: days, daysTotal: days, payments: free ? [] : [{ d: t.common.today, amt: code_ ? "—" : PLAN_PRICES[planIdx], gw: method, st: "ok" }] });
  };
  const num = (n: number) => <span className="db-wiz-num">{n}</span>;
  const body = () => {
    switch (step) {
      case 1: return (<>
        <div className="db-wiz-hh"><h3>{c.actT}</h3><p>{c.actS}</p></div>
        <div className="db-wiz-seg">
          <button className={cx(mode === "pay" && "on")} onClick={() => setMode("pay")}>{c.payNow}</button>
          <button className={cx(mode === "code" && "on")} onClick={() => setMode("code")}>{c.haveCode}</button>
        </div>
        {mode === "pay" ? (paid ? (
          <div className="db-wiz-codebox">
            <span className="db-wiz-badge sm"><Icon name="check" size={22} /></span>
            <div className="ttl">{c.emailed}</div>
            <div className="code-row"><span className="code" dir="ltr">{genCode}</span><button className="db-copybtn" aria-label={c.copied} onClick={copyCode}><Icon name="copy" size={15} /></button></div>
            {email ? <div className="eml" dir="ltr">{email}</div> : null}
          </div>
        ) : (<>
          <div className="db-bill-sec">{c.choosePlan}</div>
          <div className="db-bill-plans">{PLANS.map((p: any, i: number) => <button key={i} className={cx("db-bill-plan", planIdx === i && "on", p.free && "free")} onClick={() => setPlanIdx(i)}><span className="pd">{p.name}</span><span className="pp">{p.price}</span><span className="psub">{p.sub}</span></button>)}</div>
          {!isFree ? (<>
            <div className="db-bill-sec sm">{t.bill.method}</div>
            <div className="db-bill-gw">{[...GATEWAYS, ...(more ? GATEWAYS_MORE : [])].map((g) => <button key={g} className={cx("db-gw", gw === g && "on")} onClick={() => setGw(g)}><Icon name="check" size={12} /> {g}</button>)}{!more ? <button className="db-gw db-gw-add" onClick={() => setMore(true)}><Icon name="plus" size={12} /> {t.common.moreMethods}</button> : null}</div>
          </>) : null}
        </>)) : (<>
          <label className="db-wiz-label">{c.codeLabel}</label>
          <input className={cx("db-wiz-input", codeErr && "err")} dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} placeholder="APD-XXXX-XXXX" />
          {codeErr ? <div className="db-wiz-err"><Icon name="x" size={13} /> {c.codeErr}</div> : null}
          {codeOk ? <div className="db-wiz-okline"><Icon name="check" size={13} /> {c.codeOk}</div> : null}
        </>)}
      </>);
      case 2: return (<>
        <div className="db-wiz-hh"><h3>{c.s1t}</h3><p>{c.s1s}</p></div>
        <ol className="db-wiz-steps">{c.s1.map((x: string, i: number) => <li key={i}>{num(i + 1)}<span>{x}</span></li>)}</ol>
        <a className="db-btn db-btn-ghost db-wiz-link" href="https://t.me/BotFather" target="_blank" rel="noreferrer"><Icon name="send" size={15} /> {c.openBF}</a>
      </>);
      case 3: return (<>
        <div className="db-wiz-hh"><h3>{c.s2t}</h3><p>{c.s2s}</p></div>
        <label className="db-wiz-label">{c.s2l}</label>
        <input className={cx("db-wiz-input", tokenErr && "err")} dir="ltr" value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456789:ABCdef…" />
        {tokenErr ? <div className="db-wiz-err"><Icon name="x" size={13} /> {c.s2err}</div> : null}
        {err && !tokenErr ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
        {tokenOk && !err ? <div className="db-wiz-okline"><Icon name="check" size={13} /> {c.verified}{botInfo?.username ? " · @" + botInfo.username : ""}</div> : null}
      </>);
      case 4: return (<>
        <div className="db-wiz-hh"><h3>{c.s3t}</h3><p>{c.s3s}</p></div>
        <ol className="db-wiz-steps">{c.s3.map((x: string, i: number) => <li key={i}>{num(i + 1)}<span>{x}</span></li>)}</ol>
      </>);
      case 5: return (<>
        <div className="db-wiz-hh"><h3>{c.s4t}</h3><p>{c.s4s}</p></div>
        <div className="db-wiz-checks">{c.s4.map((x: string, i: number) => { const done = v5 === "ok"; const load = v5 === "checking"; return <div className={cx("db-wiz-check", done && "ok", load && "load")} key={i}><span className="ci">{done ? <Icon name="check" size={14} /> : load ? <span className="db-spin" /> : <span className="dotc" />}</span><span>{x}</span></div>; })}</div>
      </>);
      case 6: return (<>
        <div className="db-wiz-hh"><h3>{c.s5t}</h3><p>{c.s5s}</p></div>
        <div className="db-wiz-radios">
          <button className="db-wiz-radio on" onClick={() => setSel(0)}>
            <span className="db-chsw-av">{initials(c.discover[0])}</span>
            <div style={{ minWidth: 0, textAlign: "start" }}><div className="nm">{c.discover[0]}</div><div className="mt" dir="ltr">{fmt(mem[0])} {c.members}</div></div>
            <span className="db-wiz-dot"><Icon name="check" size={13} /></span>
          </button>
        </div>
        <div className="db-wiz-detected"><Icon name="check" size={13} /> {c.detected}</div>
      </>);
      default: { const nm = c.discover[0]; return (<>
        <div className="db-wiz-success"><span className="db-wiz-badge"><Icon name="check" size={30} /></span><h3>{c.s6t}</h3></div>
        <div className="db-wiz-info">{[[c.s6name, nm], [c.s6user, "@" + nm.toLowerCase().replace(/\s+/g, "_")], [c.s6members, fmt(mem[0])], [c.s6date, t.common.today]].map((r, k) => <div key={k} className="row"><span className="k">{r[0]}</span><span className="v" dir="ltr">{r[1]}</span></div>)}</div>
      </>); }
    }
  };
  const foot = () => {
    if (step === 1) {
      if (mode === "pay" && isFree) return <button className="db-btn db-btn-mint db-wiz-cta" onClick={next}>{c.startFree}</button>;
      if (mode === "pay" && !paid) return <button className="db-btn db-btn-mint db-wiz-cta" onClick={doPay}><Icon name="card" size={16} /> {t.bill.pay} {PLAN_PRICES[planIdx]}</button>;
      return <button className="db-btn db-btn-mint db-wiz-cta" disabled={!activated} onClick={next}>{c.cont}</button>;
    }
    if (step === 3) return <button className="db-btn db-btn-mint db-wiz-cta" disabled={!tokenOk || busy} onClick={live ? verifyTokenLive : next}>{busy ? c.verifying : c.s2cta}</button>;
    if (step === 5) return v5 === "ok" ? <button className="db-btn db-btn-mint db-wiz-cta" onClick={next}>{c.cont}</button> : <button className="db-btn db-btn-mint db-wiz-cta" disabled={v5 === "checking"} onClick={verify5}>{v5 === "checking" ? c.verifying : c.s4cta}</button>;
    if (step === 6) return <button className="db-btn db-btn-mint db-wiz-cta" disabled={sel === null} onClick={next}>{c.s5cta}</button>;
    if (step === 7) return <button className="db-btn db-btn-mint db-wiz-cta" onClick={connect}>{c.s6cta}</button>;
    return <button className="db-btn db-btn-mint db-wiz-cta" onClick={next}>{step === 4 ? c.cont : c.next}</button>;
  };
  return (
    <div className="db-wiz-bg" onClick={onClose}>
      <div className="db-wiz" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={c.wizTitle}>
        <div className="db-wiz-grip" />
        <div className="db-wiz-top">
          <div style={{ minWidth: 0 }}><div className="db-wiz-title">{c.wizTitle}</div><div className="db-wiz-step">{c.step} {step} {c.of} {TOTAL}</div></div>
          <button className="db-iconbtn" aria-label="Close" onClick={onClose} style={{ width: 32, height: 32, marginInlineStart: "auto" }}><Icon name="x" size={16} /></button>
        </div>
        <div className="db-wiz-bar">{Array.from({ length: TOTAL }).map((_, i) => <span key={i} className={cx(i < step && "on")} />)}</div>
        <div className="db-wiz-body">{body()}</div>
        <div className="db-wiz-foot">
          {step > 1 && step < 7 ? <button className="db-btn db-btn-ghost" onClick={() => setStep((s) => s - 1)}>{c.back}</button> : null}
          {foot()}
        </div>
      </div>
    </div>
  );
}/ /   f i x :   r e m o v e d   d u p l i c a t e   v e r i f y 5  
 