// SalesAdvisor
import React, { useState, useRef, useEffect } from "react";
import { cx, money } from "../../lib/format";
import { aiAdvisor } from "../../lib/api";
import { Icon } from "../ui";

export function SalesAdvisor({ t, lang, account, open, onClose, onUpgrade, onCapture }: any) {
  const a = t.adv;
  const LANGNAME: Record<string, string> = { en: "English", fa: "Persian (Farsi)", ar: "Arabic", tr: "Turkish", ru: "Russian" };
  const PRICE_REPS = [20, 65, 250, 800];
  const SALES_REPS = [12, 50, 250, 900];
  const LANGS = [
    { id: "en", label: "English" },
    { id: "fa", label: "?????" },
    { id: "ar", label: "???????" },
    { id: "tr", label: "T�rk�e" },
    { id: "ru", label: "???????" },
  ];
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>(() => [{ role: "ai", text: "Choose your language � ???? � ????? � Dil � ????", chips: true, langPicker: true }]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"q" | "done">("q");
  const [profile, setProfile] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const bodyRef = useRef<any>(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [messages, busy, open]);
  const pushAI = (text: string, chips?: any, cta?: boolean) => setMessages((m) => [...m, { role: "ai", text, chips, cta }]);
  const pushMe = (text: string) => setMessages((m) => [...m, { role: "me", text }]);
  const clearChips = () => setMessages((m) => m.map((x) => x.chips ? { ...x, chips: undefined } : x));
  const hon = (p: any) => { const nm = p.name || ""; if (!nm) return ""; if (lang === "fa") return (p.gender === "f" ? "خانمِ " : p.gender === "m" ? "آقای " : "") + nm; if (lang === "ar") return (p.gender === "f" ? "السيدة " : p.gender === "m" ? "السيد " : "") + nm; return nm; };
  const tmpl = (str: string, p: any) => { let x = String(str || ""); x = x.split("{hon}").join(hon(p) || (p.name || "")); x = x.split("{name}").join(p.name || ""); x = x.split("{current}").join(money(p.current || 0)); x = x.split("{lost}").join(money(p.lost || 0)); return x; };
  const qFor = (ns: number, p: any) => ns === 1 ? tmpl(a.qGender, p) : ns === 2 ? tmpl(a.qSell, p) : ns === 3 ? a.qPrice : ns === 4 ? a.qSales : ns === 5 ? a.qConcern : "";
  const chipsFor = (ns: number) => [null, a.genderOpts, a.sellOpts, a.priceOpts, a.salesOpts, a.concernOpts][ns];
  async function callAI(msgs: any[], sys: string) {
    // Route through the backend revenue advisor (/v1/ai/advisor) — the dashboard never calls an
    // LLM provider directly (no client-side keys, server-side metering + tenant context). Returns
    // null when no API base is configured or the call fails, so the scripted fallback still works.
    const lastUser = [...msgs].reverse().find((m) => m && m.role === "user");
    const question = (sys ? sys + "\n\n" : "") + (lastUser?.content ?? msgs.map((m: any) => m && m.content).filter(Boolean).join("\n"));
    return aiAdvisor(question);
  }
  function diagnose(p: any) {
    const P = PRICE_REPS[typeof p.priceIdx === "number" ? p.priceIdx : 1];
    const S = SALES_REPS[typeof p.salesIdx === "number" ? p.salesIdx : 1];
    const current = P * S; const lost = Math.round(current * 0.55);
    const full = { ...p, current, lost, capturedAt: Date.now() };
    setProfile(full); onCapture && onCapture(full);
    pushAI(a.crmSaved);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      pushAI(tmpl(a.diag, full));
      setTimeout(() => pushAI(tmpl(a.reveal, full)), 850);
      setTimeout(() => { pushAI(tmpl(a.pitch, full), undefined, true); setPhase("done"); }, 1750);
    }, 950);
  }
  function answer(label: string, idx?: number) {
    clearChips(); pushMe(label);
    const sNow = step; const np: any = { ...profile };
    if (sNow === 0) np.name = label;
    else if (sNow === 1) np.gender = idx === 0 ? "f" : idx === 1 ? "m" : np.gender;
    else if (sNow === 2) np.sell = label;
    else if (sNow === 3) np.priceIdx = (typeof idx === "number" ? idx : 1);
    else if (sNow === 4) { np.salesIdx = (typeof idx === "number" ? idx : 1); np.salesLabel = label; }
    else if (sNow === 5) np.concern = label;
    setProfile(np); onCapture && onCapture(np);
    if (sNow < 5) { const ns = sNow + 1; setStep(ns); setTimeout(() => pushAI(qFor(ns, np), chipsFor(ns)), 460); }
    else setTimeout(() => diagnose(np), 420);
  }
  async function askFreeQA(text: string) {
    clearChips(); pushMe(text); setBusy(true);
    const sys = "You are Appido's friendly AI sales advisor. Reply ONLY in " + (LANGNAME[lang] || "English") + ", under 50 words, warm and honest. The person's name is " + (profile.name || "there") + ". Gently tie back to how Appido's AI follows up and sells to their Telegram leads 24/7. Facts: plans Start $79/mo and Pro $179/mo; payments via USDT crypto, card, and Telegram Stars; 30-day revenue guarantee.";
    const hist = messages.filter((m) => m.role === "ai" || m.role === "me").slice(-6).map((m) => ({ role: m.role === "me" ? "user" : "assistant", content: m.text })).concat([{ role: "user", content: text }]);
    const ai = await callAI(hist, sys);
    setBusy(false); pushAI(ai || a.qaFallback);
  }
  const onSend = () => { const v = input.trim(); if (!v || busy) return; setInput(""); if (phase === "q") answer(v, undefined); else askFreeQA(v); };
  return (
    <div className="db-adv" role="dialog" aria-label={a.title} style={{ display: open ? "flex" : "none" }}>
      <div className="db-adv-head">
        <span className="db-adv-ava"><Icon name="bot" size={18} /></span>
        <div className="db-adv-hi"><span className="db-adv-name">{a.title}</span><span className="db-adv-pill">{a.aiPill}</span></div>
        <button className="db-adv-x" aria-label="Close" title="Close" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="db-adv-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={cx("db-adv-row", m.role)}>
            {m.role === "ai" ? <span className="db-adv-mava"><Icon name="bot" size={13} /></span> : null}
            <div className="db-adv-bcol">
              <div className={cx("db-adv-bub", m.role)} dir="auto">{m.text}</div>
              {m.chips && i === messages.length - 1 && phase === "q" ? <div className="db-adv-chips">{m.chips.map((c: string, k: number) => <button key={k} className="db-adv-chip" onClick={() => answer(c, k)}>{c}</button>)}</div> : null}
              {m.cta ? <div className="db-adv-cta"><button className="db-btn db-btn-mint db-btn-sm" onClick={onUpgrade}><Icon name="zap" size={14} /> {a.ctaStart}</button><button className="db-btn db-btn-ghost db-btn-sm" onClick={onClose}>{a.ctaLater}</button></div> : null}
            </div>
          </div>
        ))}
        {busy ? <div className="db-adv-row ai"><span className="db-adv-mava"><Icon name="bot" size={13} /></span><div className="db-adv-typing"><span /><span /><span /></div></div> : null}
      </div>
      <div className="db-adv-foot">
        <input className="db-adv-input" value={input} placeholder={a.inputPh} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onSend(); }} dir="auto" />
        <button className="db-adv-send" aria-label="Send" onClick={onSend} disabled={busy}><Icon name="send" size={16} /></button>
      </div>
    </div>
  );
}
