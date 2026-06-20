// OperatorMode
import React, { useState } from "react";
import { cx, money } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";
import { ACTION_META } from "../../data";
import { SwipeCard } from "../mobile";

export function OperatorMode({ t, autopilot, onClose }: any) {
  const o = t.op; const a = t.act;
  const [done, setDone] = useState<number[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const left = ACTION_META.length - done.length;
  const total = ACTION_META.length;
  const REPLY = new Set(["msg", "hot", "renew"]);
  const resolve = (i: number, msg: string) => { setDone((p) => [...p, i]); toast(msg); };
  return (
    <div className="db-op" role="dialog" aria-modal="true">
      <div className="db-op-head">
        <div className="db-op-h-l"><div className="db-op-title">{o.title}</div><div className="db-op-sub">{o.sub}</div></div>
        <button className="db-op-close" aria-label="Close" onClick={onClose}><Icon name="x" size={20} /></button>
      </div>
      <div className="db-op-stat">
        <span className={cx("db-op-auto", autopilot && "on")}><Icon name="zap" size={13} /> {autopilot ? o.autopilotOn : t.airun.manual}</span>
        <span className="db-op-today"><Icon name="bot" size={13} /> {o.todayLab}: {money(2340)}</span>
        <span className="db-op-prog">{total - left} {o.of} {total} {o.handled}</span>
      </div>
      {left > 0 ? <div className="db-op-tip"><Icon name="reply" size={13} /> {o.swipeTip}</div> : null}
      <div className="db-op-list">
        {left === 0 ? (
          <div className="db-op-clear"><div className="ic"><Icon name="check" size={30} /></div><div className="t">{o.allClearT}</div><div className="s">{o.allClearS}</div></div>
        ) : ACTION_META.map((m, i) => done.includes(i) ? null : (
          <SwipeCard key={i} approveLabel={o.swApprove} skipLabel={o.swSkip} onApprove={() => resolve(i, REPLY.has(m.type) ? o.sent : o.done)} onSkip={() => resolve(i, o.skipped)}>
            <div className="db-op-card">
            <div className="db-op-c-top"><span className={cx("db-op-ic", m.type)}><Icon name={m.icon} size={16} /></span><span className="db-op-c-tt">{a.items[i].t}</span><span className="db-op-c-v">{a.items[i].v}</span></div>
            {REPLY.has(m.type) ? (
              <><textarea className="db-op-reply" rows={2} value={drafts[i] != null ? drafts[i] : (o.drafts[i] || "")} onChange={(e) => setDrafts((p) => ({ ...p, [i]: e.target.value }))} placeholder={o.replyPh} dir="auto" /><div className="db-op-acts"><button className="db-btn db-btn-mint db-op-primary" onClick={() => resolve(i, o.sent)}><Icon name="send" size={15} /> {o.send}</button><button className="db-btn db-btn-ghost db-op-skip" onClick={() => resolve(i, o.skipped)}>{o.skip}</button></div></>
            ) : (
              <><div className="db-op-why">{a.items[i].w}</div><div className="db-op-acts"><button className="db-btn db-btn-mint db-op-primary" onClick={() => resolve(i, o.done)}><Icon name="check" size={15} /> {a.items[i].c}</button><button className="db-btn db-btn-ghost db-op-skip" onClick={() => resolve(i, o.skipped)}>{o.skip}</button></div></>
            )}
            </div>
          </SwipeCard>
        ))}
      </div>
    </div>
  );
}
