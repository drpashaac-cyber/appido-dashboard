// AccountModal
import React, { useState, useMemo } from "react";
import { cx, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { deviceInfo } from "../../lib/device";
import { Icon, Modal, Field } from "../ui";

export function AccountModal({ t, account, setAccount, onLogout, onClose }: any) {
  const ac = t.acct;
  const dev = useMemo(deviceInfo, []);
  const gen = () => String(Math.floor(100000 + Math.random() * 900000));
  const [brand, setBrand] = useState(account.brand);
  const [owner, setOwner] = useState(account.owner);
  const [emOpen, setEmOpen] = useState(false); const [newEmail, setNewEmail] = useState(""); const [emCode, setEmCode] = useState(""); const [emSent, setEmSent] = useState("");
  const [phOpen, setPhOpen] = useState(false); const [newPhone, setNewPhone] = useState(""); const [phCode, setPhCode] = useState(""); const [phSent, setPhSent] = useState("");
  const [pwOpen, setPwOpen] = useState(false); const [curPw, setCurPw] = useState(""); const [newPw, setNewPw] = useState(""); const [viaCode, setViaCode] = useState(false); const [pwCode, setPwCode] = useState(""); const [pwSent, setPwSent] = useState("");
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail.trim());
  const phoneOk = newPhone.replace(/\D/g, "").length >= 8;
  const acctRows: [string, string, string][] = [["pin", `${dev.os} · ${dev.browser}`, ac.device], ["globe", dev.tz, ac.location], ["file", dev.screen, t.hub.screen]];
  const dirty = brand !== account.brand || owner !== account.owner;
  return (
    <Modal title={ac.title} onClose={onClose}>
      <div className="db-acct-id" style={{ marginBottom: 18 }}><span className="db-av">{initials(owner || "U")}</span><div style={{ minWidth: 0 }}><div style={{ fontWeight: 650, fontSize: 14 }}>{owner || account.owner}</div><div className="db-muted" style={{ fontSize: 12.5 }} dir="ltr">{account.email}</div></div></div>

      <div className="db-bill-sec">{ac.profile}</div>
      <Field label={ac.brandName} value={brand} onChange={setBrand} />
      <Field label={ac.managerName} value={owner} onChange={setOwner} />

      <div className="db-bill-sec">{ac.email}</div>
      <div className="db-acct-line"><div style={{ minWidth: 0 }}><div className="v" dir="ltr">{account.email}</div><span className={cx("db-acct-tag", account.emailVerified ? "ok" : "warn")}>{account.emailVerified ? ac.verified : ac.unverified}</span></div><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setEmOpen((o) => !o)}>{ac.changeEmail}</button></div>
      {emOpen ? (<div className="db-acct-flow">
        <Field label={ac.newEmail} value={newEmail} onChange={setNewEmail} dir="ltr" type="email" />
        {!emSent ? <button className="db-btn db-btn-mint db-btn-sm" disabled={!emailOk} onClick={() => { setEmSent(gen()); toast(ac.codeSent); }}>{ac.sendCode}</button> : (<>
          <div className="db-auth-demo">{t.auth.demo}: <b dir="ltr">{emSent}</b></div>
          <Field label={ac.code} value={emCode} onChange={(v: string) => setEmCode(v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
          <button className="db-btn db-btn-mint db-btn-sm" disabled={emCode.length !== 6} onClick={() => { setAccount((p: any) => ({ ...p, email: newEmail.trim(), emailVerified: true })); setEmOpen(false); setEmSent(""); setNewEmail(""); setEmCode(""); toast(ac.emailUpdated); }}>{ac.verify}</button>
        </>)}
      </div>) : null}

      <div className="db-bill-sec">{ac.phone}</div>
      <div className="db-acct-line"><div style={{ minWidth: 0 }}><div className="v" dir="ltr">{account.phone || ac.notSet}</div>{account.phone ? <span className={cx("db-acct-tag", account.phoneVerified ? "ok" : "warn")}>{account.phoneVerified ? ac.verified : ac.unverified}</span> : null}</div><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setPhOpen((o) => !o)}>{account.phone ? ac.changePhone : ac.addPhone}</button></div>
      {phOpen ? (<div className="db-acct-flow">
        <Field label={ac.newPhone} value={newPhone} onChange={setNewPhone} dir="ltr" ph="+1 555 000 0000" />
        {!phSent ? <button className="db-btn db-btn-mint db-btn-sm" disabled={!phoneOk} onClick={() => { setPhSent(gen()); toast(ac.codeSent); }}>{ac.sendCode}</button> : (<>
          <div className="db-auth-demo">{t.auth.demo}: <b dir="ltr">{phSent}</b></div>
          <Field label={ac.code} value={phCode} onChange={(v: string) => setPhCode(v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
          <button className="db-btn db-btn-mint db-btn-sm" disabled={phCode.length !== 6} onClick={() => { setAccount((p: any) => ({ ...p, phone: newPhone.trim(), phoneVerified: true })); setPhOpen(false); setPhSent(""); setNewPhone(""); setPhCode(""); toast(ac.phoneUpdated); }}>{ac.verify}</button>
        </>)}
      </div>) : null}

      <div className="db-bill-sec">{ac.password}</div>
      <div className="db-acct-line"><div className="v">••••••••</div><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setPwOpen((o) => !o)}>{ac.changePassword}</button></div>
      {pwOpen ? (<div className="db-acct-flow">
        {!viaCode ? (<>
          <Field label={ac.currentPassword} value={curPw} onChange={setCurPw} dir="ltr" type="password" />
          <Field label={ac.newPassword} value={newPw} onChange={setNewPw} dir="ltr" type="password" />
          <div className="db-acct-row2"><button className="db-btn db-btn-mint db-btn-sm" disabled={newPw.length < 6} onClick={() => { setAccount((p: any) => ({ ...p, password: newPw })); setPwOpen(false); setCurPw(""); setNewPw(""); toast(ac.passUpdated); }}>{ac.update}</button><button className="db-authlink" onClick={() => setViaCode(true)}>{ac.viaCode}</button></div>
        </>) : (!pwSent ? <button className="db-btn db-btn-mint db-btn-sm" onClick={() => { setPwSent(gen()); toast(ac.codeSent); }}>{ac.sendCode}</button> : (<>
          <div className="db-auth-demo">{t.auth.demo}: <b dir="ltr">{pwSent}</b></div>
          <Field label={ac.code} value={pwCode} onChange={(v: string) => setPwCode(v.replace(/\D/g, "").slice(0, 6))} dir="ltr" />
          <Field label={ac.newPassword} value={newPw} onChange={setNewPw} dir="ltr" type="password" />
          <button className="db-btn db-btn-mint db-btn-sm" disabled={pwCode.length !== 6 || newPw.length < 6} onClick={() => { setAccount((p: any) => ({ ...p, password: newPw })); setPwOpen(false); setViaCode(false); setPwSent(""); setPwCode(""); setNewPw(""); toast(ac.passUpdated); }}>{ac.update}</button>
        </>))}
      </div>) : null}

      <div className="db-bill-sec">{ac.device}</div>
      <div className="db-acct-grid">{acctRows.map(([ic, v, l], i) => <div className="db-acct-row" key={i}><span className="ai"><Icon name={ic} size={15} /></span><div style={{ minWidth: 0 }}><div className="al">{l}</div><div className="av2" dir="ltr">{v}</div></div></div>)}</div>

      <div className="db-acct-foot">
        <button className="db-btn db-btn-mint" disabled={!dirty} onClick={() => { setAccount((p: any) => ({ ...p, brand, owner })); toast(ac.saved); }}>{ac.save}</button>
        <button className="db-btn db-signout" onClick={onLogout}><Icon name="x" size={15} /> {ac.signOut}</button>
      </div>
    </Modal>
  );
}
