// InboxView
import React, { useState, useRef, useEffect } from "react";
import { cx, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { leadScoreOf, scoreBand } from "../../lib/score";
import { Icon, Switch } from "../ui";
import { THREAD } from "../../data";
import { useDataset } from "../../lib/dataset";
import { api, type ThreadMsg } from "../../lib/api";

export function InboxView({ t, target, autopilot }: any) {
  const { CONVOS, live } = useDataset();
  const [liveThread, setLiveThread] = useState<ThreadMsg[] | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(0);
  const [seg, setSeg] = useState("all");
  const [ai, setAi] = useState(autopilot !== false);
  const [openChat, setOpenChat] = useState(false);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [mktConsent, setMktConsent] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  useEffect(() => { if (!recording) { setRecSecs(0); return; } const id = setInterval(() => setRecSecs((s) => s + 1), 1000); return () => clearInterval(id); }, [recording]);

  const list = CONVOS.filter((c: any) => seg === "all" || c.seg === seg);
  const c = list[active] || CONVOS[0];

  // Live: load + toggle this customer's marketing consent (drives the campaign opt-in gate).
  useEffect(() => {
    if (!live || !c?.id) { setMktConsent(null); return; }
    let alive = true;
    api.data.listConsent(c.id).then((rows) => { if (alive) setMktConsent(!!rows.find((r) => r.purpose === "marketing" && r.granted)); }).catch(() => { if (alive) setMktConsent(null); });
    return () => { alive = false; };
  }, [live, c && c.id]);
  const toggleConsent = () => {
    if (!c?.id) return;
    const next = !mktConsent;
    setMktConsent(next);
    api.data.setConsent(c.id, { purpose: "marketing", granted: next, source: "operator" }).catch(() => setMktConsent(!next));
  };
  const msgsRef = useRef<HTMLDivElement>(null);
  const tabIds = ["all", "needs", "ai", "vip"];
  useEffect(() => {
    if (target == null) return;
    const idx = CONVOS.findIndex((c) => c.id === target);
    if (idx >= 0) { setSeg("all"); setActive(idx); setOpenChat(true); }
  }, [target]);
  // Live mode: load this customer's real chat thread; reset reply target on conversation switch.
  useEffect(() => {
    setReplyTo(null);
    if (!live || !c?.id) { setLiveThread(null); return; }
    let alive = true;
    api.data.customerMessages(c.id, { limit: 100 }).then((ms) => { if (alive) setLiveThread(ms ?? []); }).catch(() => { if (alive) setLiveThread([]); });
    api.data.markRead(c.id).catch(() => {});
    setReadIds((s) => { const n = new Set(s); n.add(c.id); return n; });
    return () => { alive = false; };
  }, [live, c?.id]);
  // Unified thread for rendering: real messages in live mode (empty while loading), seed in demo.
  const threadRows: { from: string; text: string; time: string; conf?: number }[] = live
    ? (liveThread ?? []).map((m) => ({
        from: m.direction === "in" ? "them" : m.author === "ai" ? "ai" : "you",
        text: m.body,
        time: new Date(m.at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      }))
    : THREAD.map((m: any, i: number) => ({ from: m.from, text: t.inbox.thread[i], time: m.time, conf: m.conf as number | undefined }));
  useEffect(() => { const el = msgsRef.current; if (el) el.scrollTop = el.scrollHeight; }, [active, ai, openChat, replyTo]);
  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    if (live && c?.id) {
      setDraft(""); setReplyTo(null);
      try {
        const msg = await api.data.sendReply(c.id, text);
        setLiveThread((cur) => [...(cur ?? []), msg]);
      } catch {
        setDraft(text); // restore so the operator can retry — never a false "sent"
      }
      return;
    }
    toast(t.toast.sent); setDraft(""); setReplyTo(null);
  };
  return (
    <div className={cx("db-inbox", openChat && "show-chat")}>
      <div className="db-convlist">
        <div className="db-segtabs">{tabIds.map((id, i) => <button key={id} className={cx("db-segtab", seg === id && "on")} onClick={() => { setSeg(id); setActive(0); }}>{t.inbox.tabs[i]}</button>)}</div>
        <div className="db-convs">
          {list.map((cv, i) => { const score = leadScoreOf(cv); const band = scoreBand(score); return (
            <div key={cv.id} className={cx("db-conv", i === active && "on")} onClick={() => { setActive(i); setOpenChat(true); }}>
              <span className="db-av">{initials(cv.name)}</span>
              <div style={{ minWidth: 0 }}><div className="nm">{cv.name} <span className={cx("db-tag", cv.tag.toLowerCase())}>{t.tags[cv.tag]}</span></div><div className="ms">{cv.ai ? "🤖 " : ""}{live ? (cv.last || "") : t.inbox.snips[CONVOS.indexOf(cv)]}</div></div>
              <div className="rt"><span className="tm">{cv.time}</span>{(readIds.has(cv.id) ? 0 : cv.unread) ? <span className="un">{readIds.has(cv.id) ? 0 : cv.unread}</span> : null}<span className="db-conv-score" data-band={band} title={t.crm.score}>{score}</span></div>
            </div>
          ); })}
        </div>
      </div>
      <div className="db-chat">
        <div className="db-chathead">
          <button className="db-back" aria-label={t.common.back} onClick={() => setOpenChat(false)}><Icon name="chevron" size={20} /></button>
          <span className="db-av">{initials(c.name)}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ch-nm">{c.name}</div>
            <div className="ch-sub">{ai ? t.inbox.statusAI : t.inbox.statusYou} · {c.intent}% {t.inbox.intent}</div>
          </div>
          <label className="db-aitoggle" title={t.inbox.autoReply}><span className="db-hide-sm">{t.inbox.autoReply}</span><Switch on={ai} onClick={() => setAi((v) => !v)} label={t.inbox.autoReply} /></label>
          {live ? (
            <button type="button" title={t.inbox.consent} onClick={toggleConsent} style={{ marginInlineStart: 8, fontSize: 11.5, padding: "4px 9px", borderRadius: 9, border: "1px solid #D1C9BA", background: mktConsent ? "#67E18D" : "transparent", color: mktConsent ? "#1A312B" : "inherit", cursor: "pointer", whiteSpace: "nowrap" }}>
              {t.inbox.consent}: {mktConsent ? t.inbox.consentOn : t.inbox.consentOff}
            </button>
          ) : null}
        </div>
        <div className="db-msgs" ref={msgsRef}>
          {threadRows.map((m, i) => {
            const grouped = i > 0 && threadRows[i - 1].from === m.from;
            return (
              <div key={i} className={cx("db-msg", m.from, grouped && "grp")}>
                {m.from === "ai" && !grouped ? <div className="who"><Icon name="bot" size={12} /> Appido AI{m.conf ? <span className="db-conf-inline">{m.conf}% {t.inbox.conf}</span> : null}</div> : null}
                <span className="tx">{m.text}</span>
                <span className="meta"><button className="rep" onClick={() => setReplyTo(i)} aria-label={t.replyTo}><Icon name="reply" size={13} /></button><span className="mt">{m.time}</span></span>
              </div>
            );
          })}
        </div>
        <div className="db-composer">
          {!ai && (
            <div className="db-suggest">
              <span className="lab"><Icon name="spark" size={14} /> {t.inbox.draft}<span className="db-conf-inline">94% {t.inbox.conf}</span></span>
              <span style={{ color: "var(--text-2)" }}>{t.inbox.suggest}</span>
              <div style={{ display: "flex", gap: 6, marginInlineStart: "auto", flexShrink: 0 }}>
                <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => toast(t.inbox.rewrite)}><Icon name="more" size={14} /> {t.inbox.rewrite}</button>
                <button className="db-btn db-btn-mint db-btn-sm" onClick={() => setDraft(t.inbox.suggest)}><Icon name="check" size={14} /> {t.common.use}</button>
              </div>
            </div>
          )}
          {replyTo !== null && threadRows[replyTo] && (
            <div className="db-replybar">
              <span className="bar" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="rt-to">{t.replyTo} {threadRows[replyTo].from === "ai" ? "Appido AI" : c.name}</div>
                <div className="rt-tx">{threadRows[replyTo].text}</div>
              </div>
              <button className="db-iconbtn" aria-label={t.comp.cancel} onClick={() => setReplyTo(null)}><Icon name="x" size={16} /></button>
            </div>
          )}
          {recording ? (
            <div className="db-recbar">
              <button className="db-iconbtn" aria-label="Cancel" onClick={() => setRecording(false)}><Icon name="trash" size={18} /></button>
              <span className="db-recdot" />
              <span className="db-rectime" dir="ltr">{Math.floor(recSecs / 60)}:{String(recSecs % 60).padStart(2, "0")}</span>
              <span className="db-reclabel">{t.inbox.recording}</span>
              <span style={{ marginInlineStart: "auto" }} />
              <button className="db-sendbtn" aria-label={t.common.send} onClick={() => { setRecording(false); toast(t.inbox.voiceSent); }}><Icon name="send" size={18} /></button>
            </div>
          ) : (
          <div className="db-inputrow">
            <button className="db-iconbtn" aria-label="Attach"><Icon name="clip" size={20} /></button>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={ai ? t.inbox.phHandling : t.inbox.phReply} onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) send(); }} />
            {draft.trim()
              ? <button className="db-sendbtn" aria-label={t.common.send} onClick={send}><Icon name="send" size={18} /></button>
              : <button className="db-sendbtn ghost" aria-label="Voice message" onClick={() => setRecording(true)}><Icon name="mic" size={19} /></button>}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
