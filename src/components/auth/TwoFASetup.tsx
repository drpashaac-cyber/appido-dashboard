// TwoFASetup
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { Icon, Modal } from "../ui";
import { FauxQR } from "../share";
import { genBase32 } from "./genBase32";

export function TwoFASetup({ t, email, onEnabled, onClose }: any) {
  const a = t.fa;
  const [step, setStep] = useState("scan");
  const [secret] = useState(() => genBase32(16));
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [codes] = useState(() => Array.from({ length: 8 }, () => (genBase32(4) + "-" + genBase32(4)).toLowerCase()));
  const otpauth = "otpauth://totp/Appido:" + (email || "you") + "?secret=" + secret + "&issuer=Appido";
  const verify = () => { if (!/^\d{6}$/.test(code.trim())) { setErr(a.codeErr); return; } setErr(""); setStep("backup"); };
  return (
    <Modal title={a.title} onClose={onClose}>
      {step === "scan" && (<>
        <p className="db-fa-sub">{a.scanSub}</p>
        <div className="db-fa-qr"><FauxQR value={otpauth} /></div>
        <div className="db-fa-key"><span className="db-muted" style={{ fontSize: 11.5 }}>{a.manualKey}</span><code dir="ltr">{secret.replace(/(.{4})/g, "$1 ").trim()}</code></div>
        <div className="db-fa-note"><Icon name="shield" size={13} /> {a.qrNote}</div>
        <button className="db-btn db-btn-mint" style={{ width: "100%", marginTop: 14 }} onClick={() => setStep("verify")}>{a.next}</button>
      </>)}
      {step === "verify" && (<>
        <p className="db-fa-sub">{a.verifySub}</p>
        <input className="db-input db-fa-code" dir="ltr" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" aria-label={a.code} />
        <div className="db-auth-demo">{a.demo}</div>
        {err ? <div className="db-wiz-err"><Icon name="x" size={13} /> {err}</div> : null}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}><button className="db-btn db-btn-mint" style={{ flex: 1 }} onClick={verify}>{a.verifyBtn}</button><button className="db-btn db-btn-ghost" onClick={() => setStep("scan")}>{t.common.tourBack}</button></div>
      </>)}
      {step === "backup" && (<>
        <div className="db-fa-ok"><span className="db-fa-ok-ic"><Icon name="check" size={22} /></span><div className="db-fa-ok-t">{a.enabledTitle}</div></div>
        <p className="db-fa-sub">{a.backupSub}</p>
        <div className="db-fa-codes">{codes.map((cc, i) => <code key={i} dir="ltr">{cc}</code>)}</div>
        <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => { try { if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(codes.join("\n")); } catch (e) {} toast(a.copied); }}><Icon name="copy" size={14} /> {a.copyCodes}</button>
        <button className="db-btn db-btn-mint" style={{ width: "100%", marginTop: 12 }} onClick={() => onEnabled()}>{a.done}</button>
      </>)}
    </Modal>
  );
}
