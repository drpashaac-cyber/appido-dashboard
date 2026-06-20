// AuthScreen
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { Icon, Field } from "../ui";
import { LangSwitch } from "../layout";
import { PwField } from "./PwField";
import { api, apiEnabled, accountFromMe } from "../../lib/api";

export function AuthScreen({ t, theme, setTheme, lang, setLang, account, onAuthed, requires2FA }: any) {
  const a = t.auth;
  const [mode, setMode] = useState<"signin" | "signup" | "verify" | "forgot" | "reset" | "twofa">("signin");
  const [brand, setBrand] = useState("");
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [npass, setNpass] = useState("");
  const [code, setCode] = useState("");
  const [rec, setRec] = useState(false);
  const [sent, setSent] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const pwOk = (pw: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pw);
  const gen = () => String(Math.floor(100000 + Math.random() * 900000));
  const go = (m: any) => { setErr(""); setCode(""); setMode(m); };
  const signin = async () => {
    if (!emailOk) return setErr(a.errEmail);
    if (!pass) return setErr(a.errFields);
    if (!pwOk(pass)) { setErr(""); return; }
    if (apiEnabled()) {
      // Live: real session via the backend. Password may trigger a 2FA email-code challenge.
      setErr(""); setBusy(true);
      try {
        await api.auth.ensureCsrf();
        const r: any = await api.auth.loginWithPassword(email.trim(), pass);
        if (r && r.next === "twofa") { setBusy(false); setErr(""); setCode(""); setRec(false); setMode("twofa"); return; }
        const me = await api.me();
        onAuthed(accountFromMe(me, account), true);
      } catch {
        setErr(a.errLogin || a.errFields);
      } finally {
        setBusy(false);
      }
      return;
    }
    if (requires2FA) { setErr(""); setCode(""); setRec(false); setMode("twofa"); return; }
    onAuthed({ ...account, email: email.trim() }, true);
  };
  const twofa = async () => {
    const v = code.trim();
    if (rec ? v.length < 6 : !/^\d{6}$/.test(v)) return setErr(a.twofaErr);
    if (apiEnabled()) {
      // Live: verify the 2FA email code, which establishes the session.
      setErr(""); setBusy(true);
      try {
        await api.auth.loginWithCode(email.trim(), v);
        const me = await api.me();
        onAuthed(accountFromMe(me, account), true);
      } catch {
        setErr(a.twofaErr); setBusy(false);
      }
      return;
    }
    onAuthed({ ...account, email: email.trim() }, true);
  };
  const signup = async () => {
    if (!brand.trim() || !owner.trim()) return setErr(a.errFields);
    if (!emailOk) return setErr(a.errEmail);
    if (!pwOk(pass)) return setErr(a.errPass);
    setErr("");
    if (apiEnabled()) {
      // Live: create the business + admin account and start a session immediately (no email-code step).
      setBusy(true);
      try {
        await api.auth.ensureCsrf();
        await api.auth.register({ email: email.trim(), password: pass, name: owner.trim(), brand: brand.trim() });
        const me = await api.me();
        onAuthed(accountFromMe(me, account), true);
      } catch (e: any) {
        setErr(e?.status === 409 ? (a.errEmailTaken || a.errLogin || a.errFields) : (a.errLogin || a.errFields));
        setBusy(false);
      }
      return;
    }
    setSent(gen()); setMode("verify");
  };
  const verify = () => { if (code.trim().length !== 6) return setErr(a.errCode); onAuthed({ ...account, brand: brand.trim(), owner: owner.trim(), email: email.trim(), emailVerified: true, password: pass }, false); };
  const forgot = async () => {
    if (!emailOk) return setErr(a.errEmail);
    setErr("");
    if (apiEnabled()) {
      setBusy(true);
      try { await api.auth.ensureCsrf(); await api.auth.requestReset(email.trim()); setMode("reset"); }
      catch { setErr(a.errLogin || a.errFields); }
      finally { setBusy(false); }
      return;
    }
    setSent(gen()); setMode("reset");
  };
  const reset = async () => {
    if (code.trim().length !== 6) return setErr(a.errCode);
    if (!pwOk(npass)) return setErr(a.errPass);
    if (apiEnabled()) {
      setErr(""); setBusy(true);
      try { await api.auth.resetPassword(email.trim(), code.trim(), npass); toast(a.updatePass); setPass(""); setCode(""); go("signin"); }
      catch { setErr(a.errCode); }
      finally { setBusy(false); }
      return;
    }
    toast(a.updatePass); setPass(""); go("signin");
  };
  return (
    <div className="db-auth">
      <div className="db-auth-top">
        <div className="db-brand" style={{ color: "var(--text)" }}>Appido<span className="os">OS</span></div>
        <span style={{ marginInlineStart: "auto" }} />
        <LangSwitch lang={lang} setLang={setLang} t={t} />
        <button className="db-iconbtn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Theme"><Icon name={theme === "dark" ? "sun" : "moon"} size={18} /></button>
      </div>
      <div className="db-auth-wrap">
        <div className="db-auth-card">
          {mode === "signin" && (<>
            <h2>{a.welcome}</h2><p>{a.signinSub}</p>
            <Field label={a.email} value={email} onChange={setEmail} dir="ltr" type="email" />
            <PwField label={a.password} value={pass} onChange={setPass} hint={a.pwHint} error={pass.length > 0 && !pwOk(pass) ? a.errPass : ""} />
            <button className="db-authlink right" onClick={() => go("forgot")}>{a.forgot}</button>
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={signin} disabled={busy}>{a.signin}</button>
            <div className="db-auth-foot">{a.newHere} <button onClick={() => go("signup")}>{a.createOne}</button></div>
            <div className="db-auth-sync"><Icon name="globe" size={13} /> {a.syncNote}</div>
          </>)}
          {mode === "twofa" && (<>
            <h2>{a.twofaTitle}</h2><p>{rec ? a.recoverySub : a.twofaSub}</p>
            <Field label={rec ? a.recoveryLabel : a.code} value={code} onChange={(v: string) => setCode(rec ? v.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 9) : v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
            {!apiEnabled() ? <button className="db-authlink right" onClick={() => { setRec((v) => !v); setCode(""); setErr(""); }}>{rec ? a.useApp : a.useRecovery}</button> : null}
            {!apiEnabled() ? <div className="db-auth-demo">{rec ? a.recoveryDemo : a.twofaDemo}</div> : null}
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={twofa} disabled={busy}>{a.twofaVerify}</button>
            <div className="db-auth-foot"><button onClick={() => { setMode("signin"); setCode(""); setErr(""); setRec(false); }}>{a.back}</button></div>
          </>)}
          {mode === "signup" && (<>
            <h2>{a.createTitle}</h2><p>{a.createSub}</p>
            <Field label={a.brandName} value={brand} onChange={setBrand} />
            <Field label={a.ownerName} value={owner} onChange={setOwner} />
            <Field label={a.email} value={email} onChange={setEmail} dir="ltr" type="email" />
            <PwField label={a.password} value={pass} onChange={setPass} hint={a.pwHint} error={pass.length > 0 && !pwOk(pass) ? a.errPass : ""} />
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={signup} disabled={busy}>{a.signup}</button>
            <div className="db-auth-foot">{a.haveAcc} <button onClick={() => go("signin")}>{a.signinLink}</button></div>
          </>)}
          {mode === "verify" && (<>
            <h2>{a.verifyTitle}</h2><p>{a.verifySub} <span dir="ltr" style={{ fontWeight: 600 }}>{email}</span></p>
            <Field label={a.code} value={code} onChange={(v: string) => setCode(v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
            <div className="db-auth-demo">{a.demo}: <b dir="ltr">{sent}</b></div>
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={verify}>{a.verify}</button>
            <div className="db-auth-foot"><button onClick={() => setSent(gen())}>{a.resend}</button></div>
          </>)}
          {mode === "forgot" && (<>
            <h2>{a.forgotTitle}</h2><p>{a.forgotSub}</p>
            <Field label={a.email} value={email} onChange={setEmail} dir="ltr" type="email" />
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={forgot} disabled={busy}>{a.sendCode}</button>
            <div className="db-auth-foot"><button onClick={() => go("signin")}>{a.back}</button></div>
          </>)}
          {mode === "reset" && (<>
            <h2>{a.resetTitle}</h2><p>{a.verifySub} <span dir="ltr" style={{ fontWeight: 600 }}>{email}</span></p>
            <Field label={a.code} value={code} onChange={(v: string) => setCode(v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
            {!apiEnabled() ? <div className="db-auth-demo">{a.demo}: <b dir="ltr">{sent}</b></div> : null}
            <PwField label={a.newPassword} value={npass} onChange={setNpass} hint={a.pwHint} error={npass.length > 0 && !pwOk(npass) ? a.errPass : ""} />
            {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
            <button className="db-btn db-btn-mint db-auth-cta" onClick={reset} disabled={busy}>{a.updatePass}</button>
            <div className="db-auth-foot"><button onClick={() => go("signin")}>{a.back}</button></div>
          </>)}
        </div>
      </div>
    </div>
  );
}
