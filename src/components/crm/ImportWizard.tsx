// ImportWizard
import React, { useState, useMemo, useRef } from "react";
import { cx, initials } from "../../lib/format";
import { Icon } from "../ui";

// Local monotonic counter for generated import ids (was a shell-level global).
let _impId = 0;

export function ImportWizard({ t, onClose, onNav, onDone }: any) {
  const i = t.imp;
  const [mode, setMode] = useState("file");
  const [step, setStep] = useState("input");
  const [cols, setCols] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [skipDup, setSkipDup] = useState(true);
  const [paste, setPaste] = useState("");
  const [mName, setMName] = useState(""); const [mTg, setMTg] = useState(""); const [mPhone, setMPhone] = useState(""); const [mTag, setMTag] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const [doneN, setDoneN] = useState(0);
  const [dest, setDest] = useState("cold");
  const fileRef = useRef<HTMLInputElement>(null);
  const autoField = (h: string) => { const x = (h || "").toLowerCase(); if (/(name|نام|الاسم|^ad$|имя|isim)/.test(x)) return "name"; if (/(tele|user|@|یوزر|معرّف|kullan|юзер)/.test(x)) return "tg"; if (/(phone|mobile|^tel|تلفن|موبایل|هاتف|telefon|телеф)/.test(x)) return "phone"; if (/(tag|note|یادداشت|تگ|وسم|ملاحظ|etiket|not|тег|замет)/.test(x)) return "tag"; return "skip"; };
  const ingest = (text: string) => { const lines = (text || "").replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean); if (!lines.length) { setErr(i.need); return; } const cut = (l: string) => l.split(/[,\t؛;]/).map((c) => c.trim().replace(/^["']|["']$/g, "")); const hdr = cut(lines[0]); const looksHeader = hdr.some((h) => autoField(h) !== "skip") && !/^\+?\d/.test(hdr[0]); const colNames = looksHeader ? hdr : hdr.map((_, idx) => "Column " + (idx + 1)); const dataLines = looksHeader ? lines.slice(1) : lines; const rws = dataLines.map((l) => { const cells = cut(l); const o: any = {}; colNames.forEach((c, idx) => (o[c] = cells[idx] || "")); return o; }); const mp: any = {}; colNames.forEach((c) => (mp[c] = autoField(c))); setCols(colNames); setRows(rws); setMapping(mp); setErr(""); setStep("map"); };
  const onFile = (f: File) => { const r = new FileReader(); r.onload = () => ingest(String(r.result || "")); r.onerror = () => setErr(i.need); r.readAsText(f); };
  const SAMPLE = "name, telegram, phone, note\nReza Karimi, @reza_k, , asked about VIP last month\nOlga P., , +7 921 555 0192, bought once then churned\nMehdi T., @mehdi_trades, , wanted the signals plan\nAnna S., , +7 903 118 2244, support ticket about refund\nKaveh N., @kaveh_n, +98 912 770 9090, long-time follower\nDmitry L., , +7 916 442 7781, asked about pricing";
  const dlTemplate = () => { try { const blob = new Blob(["name,telegram,phone,note\nJohn Doe,@john,,VIP interest\nJane Smith,,+1 555 0100,from old CRM"], { type: "text/csv" }); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = "appido-contacts-template.csv"; a.click(); URL.revokeObjectURL(u); } catch (e) {} };
  const fieldOf = (kind: string) => Object.keys(mapping).find((c) => mapping[c] === kind);
  const resolved = useMemo(() => { const nC = fieldOf("name"), tC = fieldOf("tg"), pC = fieldOf("phone"), gC = fieldOf("tag"); const seen = new Set<string>(); const out: any[] = []; let dup = 0; rows.forEach((r) => { const name = (nC ? r[nC] : "").trim(); const uname = (tC ? r[tC] : "").replace(/^@/, "").trim(); const phone = (pC ? r[pC] : "").trim(); const note = (gC ? r[gC] : "").trim(); if (!name || (!uname && !phone)) return; const key = (uname || phone).toLowerCase(); if (seen.has(key)) { dup++; return; } seen.add(key); out.push({ name, uname, phone, note }); }); return { valid: out, dup }; }, [rows, mapping]);
  const withUser = resolved.valid.filter((c) => c.uname).length;
  const byPhone = resolved.valid.filter((c) => !c.uname && c.phone).length;
  const toLead = (c: any) => ({ id: "imp_" + (++_impId) + "_" + Date.now(), n: c.name, handle: c.uname ? "@" + c.uname : (c.phone || ""), who: c.note || i.who, v: 0, intent: 45, t: i.newT, ltv: 0, points: 0, phone: c.phone || "", email: "", plan: null, tags: ["imported"], imported: true, stage: dest, match: c.uname ? "user" : "phone", tl: [{ e: "imported", t: i.newT }, { e: "talkedSupport", t: "—" }] });
  const finishFile = () => { const leads = resolved.valid.map(toLead); setDoneN(leads.length); onDone(leads); setStep("done"); };
  const addManual = () => { const name = mName.trim(); const uname = mTg.replace(/^@/, "").trim(); const phone = mPhone.trim(); if (!name || (!uname && !phone)) { setErr(i.need); return; } setList((L) => [...L, { name, uname, phone, note: mTag.trim() }]); setMName(""); setMTg(""); setMPhone(""); setMTag(""); setErr(""); };
  const finishManual = () => { const leads = list.map(toLead); setDoneN(leads.length); onDone(leads); setStep("done"); };
  const STAGE_IDS = ["cold", "warm", "hot", "won"];
  const destPicker = (<div className="db-impw-dest"><div className="db-impw-secttl">{i.destTitle}</div><div className="db-impw-secsub">{i.destHint}</div><div className="db-seg db-impw-destseg">{STAGE_IDS.map((sid, k) => <button key={sid} className={cx(dest === sid && "on")} onClick={() => setDest(sid)}>{t.crm.stages[k]}</button>)}</div></div>);
  return (
    <div className="db-modal-bg" onClick={() => onClose()}>
      <div className="db-modal db-impw" onClick={(e) => e.stopPropagation()}>
        <div className="db-impw-h"><span className="db-impw-ic"><Icon name="upload" size={16} /></span><div style={{ minWidth: 0 }}><div className="db-impw-t">{i.title}</div><div className="db-impw-s">{i.sub}</div></div><button className="db-iconbtn" onClick={() => onClose()} aria-label="Close" style={{ width: 32, height: 32, marginInlineStart: "auto", flexShrink: 0 }}><Icon name="x" size={16} /></button></div>
        {step === "input" && (<>
          <div className="db-seg db-impw-seg"><button className={cx(mode === "file" && "on")} onClick={() => { setMode("file"); setErr(""); }}>{i.tabFile}</button><button className={cx(mode === "manual" && "on")} onClick={() => { setMode("manual"); setErr(""); }}>{i.tabManual}</button></div>
          {mode === "file" ? (<>
            <button className="db-dropzone" onClick={() => fileRef.current && fileRef.current.click()}><Icon name="upload" size={22} /><div className="dz-t">{i.drop}</div><div className="dz-s">{i.dropHint}</div></button>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.txt" style={{ display: "none" }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) onFile(f); }} />
            <div className="db-impw-links"><button className="db-link" onClick={dlTemplate}><Icon name="file" size={13} /> {i.template}</button><button className="db-link" onClick={() => ingest(SAMPLE)}><Icon name="spark" size={13} /> {i.sample}</button></div>
            <div className="db-impw-or">{i.orPaste}</div>
            <textarea className="db-area" rows={3} value={paste} placeholder={i.pastePh} onChange={(e) => setPaste(e.target.value)} />
            <button className="db-btn db-btn-mint" style={{ width: "100%", marginTop: 12 }} disabled={!paste.trim()} onClick={() => ingest(paste)}>{t.common.tourNext}</button>
            {err ? <div className="db-impw-err">{err}</div> : null}
          </>) : (<>
            <div className="db-grid g-2" style={{ marginTop: 8 }}>
              <div className="db-field" style={{ margin: 0 }}><label>{i.mName}</label><input className="db-input" value={mName} onChange={(e) => setMName(e.target.value)} /></div>
              <div className="db-field" style={{ margin: 0 }}><label>{i.mTg}</label><input className="db-input" dir="ltr" value={mTg} onChange={(e) => setMTg(e.target.value)} /></div>
              <div className="db-field" style={{ margin: 0 }}><label>{i.mPhone}</label><input className="db-input" dir="ltr" value={mPhone} onChange={(e) => setMPhone(e.target.value)} /></div>
              <div className="db-field" style={{ margin: 0 }}><label>{i.mTag}</label><input className="db-input" value={mTag} onChange={(e) => setMTag(e.target.value)} /></div>
            </div>
            {err ? <div className="db-impw-err">{err}</div> : null}
            <button className="db-btn db-btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={addManual}><Icon name="plus" size={15} /> {i.addBtn}</button>
            <div className="db-impw-list">{list.length ? list.map((c, k) => (<div className="db-impw-li" key={k}><span className="db-av" style={{ width: 26, height: 26, fontSize: 10 }}>{initials(c.name)}</span><div style={{ minWidth: 0 }}><div className="li-n">{c.name}</div><div className="li-s" dir="ltr">{c.uname ? "@" + c.uname : c.phone}</div></div><button className="db-iconbtn" style={{ width: 26, height: 26, marginInlineStart: "auto" }} onClick={() => setList((L) => L.filter((_, j) => j !== k))}><Icon name="x" size={13} /></button></div>)) : <div className="db-impw-empty">{i.emptyList}</div>}</div>
            {destPicker}
            <button className="db-btn db-btn-mint" style={{ width: "100%", marginTop: 12 }} disabled={!list.length} onClick={finishManual}>{i.doImport.replace("{n}", String(list.length))}</button>
          </>)}
        </>)}
        {step === "map" && (<>
          <div className="db-impw-secttl">{i.mapTitle}</div><div className="db-impw-secsub">{i.mapHint}</div>
          <div className="db-impw-map">{cols.map((c) => (<div className="db-impw-maprow" key={c}><span className="mc" dir="ltr">{c}</span><Icon name="chevron" size={13} /><select className="db-select" value={mapping[c]} onChange={(e) => setMapping((m) => ({ ...m, [c]: e.target.value }))}>{["name", "tg", "phone", "tag", "skip"].map((f) => <option key={f} value={f}>{i.f[f]}</option>)}</select></div>))}</div>
          <div className="db-impw-secttl" style={{ marginTop: 18 }}>{i.previewTitle}</div>
          <div className="db-impw-stats"><div className="st"><b>{resolved.valid.length}</b><span>{i.sTotal}</span></div><div className="st"><b>{withUser}</b><span>{i.sUser}</span></div><div className="st"><b>{byPhone}</b><span>{i.sMatch}</span></div><div className="st"><b>{resolved.dup}</b><span>{i.sDup}</span></div></div>
          <div className="db-impw-rows">{resolved.valid.slice(0, 4).map((c, k) => (<div className="db-impw-prow" key={k}><span className="db-av" style={{ width: 24, height: 24, fontSize: 10 }}>{initials(c.name)}</span><span className="pn">{c.name}</span><span className={cx("db-matchchip", c.uname ? "u" : "p")}><Icon name={c.uname ? "bot" : "phone"} size={11} /> {c.uname ? "@" + c.uname : i.matchPhone}</span></div>))}{resolved.valid.length > 4 ? <div className="db-impw-more">+{resolved.valid.length - 4}</div> : null}</div>
          <label className="db-impw-check"><input type="checkbox" checked={skipDup} onChange={(e) => setSkipDup(e.target.checked)} /> {i.skipDup}</label>
          {destPicker}
          <div className="db-impw-foot"><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setStep("input")}>{t.common.tourBack}</button><button className="db-btn db-btn-mint db-btn-sm" disabled={!resolved.valid.length} onClick={finishFile}>{i.doImport.replace("{n}", String(resolved.valid.length))}</button></div>
        </>)}
        {step === "done" && (<div className="db-impw-done"><span className="db-impw-done-ic"><Icon name="check" size={26} /></span><div className="db-impw-done-t">{i.doneTitle.replace("{n}", String(doneN))}</div><div className="db-impw-done-b">{i.doneBody}</div><div className="db-impw-done-acts"><button className="db-btn db-btn-mint" onClick={() => onNav("crm")}>{i.viewCrm}</button><button className="db-btn db-btn-ghost" onClick={() => onNav("journeys")}><Icon name="flow" size={15} /> {i.nurture}</button></div></div>)}
      </div>
    </div>
  );
}
