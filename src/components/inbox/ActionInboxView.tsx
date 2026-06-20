// ActionInboxView
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon, PageHead } from "../ui";
import { ACTION_META, ACT_NAV_TO } from "../../data";

export function ActionInboxView({ t, setView }: any) {
  const a = t.act;
  const [done, setDone] = useState<number[]>([]);
  const left = ACTION_META.length - done.length;
  const resolve = (i: number) => { setDone((p) => [...p, i]); toast(a.approved); };
  return (
    <>
      <PageHead title={a.title} sub={a.sub} />
      <div className="db-noteline" style={{ marginBottom: 18 }}><Icon name="bot" size={14} /> {a.intro}</div>
      <div className="db-act-stat"><span className="big">{left}</span><span className="lab">{a.waiting}</span><span className="sep">·</span><span className="auto"><Icon name="zap" size={13} /> 23 {a.autoToday}</span></div>
      {left === 0 ? (
        <div className="db-act-zero"><div className="ic"><Icon name="check" size={34} /></div><div className="zt">{a.zeroT}</div><div className="zs">{a.zeroS}</div></div>
      ) : (
        <div className="db-act-list">
          {ACTION_META.map((m, i) => done.includes(i) ? null : (
            <div className="db-act-card" key={i}>
              <span className={cx("db-act-ic", m.type)}><Icon name={m.icon} size={18} /></span>
              <div className="db-act-body">
                <div className="db-act-top"><span className="tt">{a.items[i].t}</span><span className="vv">{a.items[i].v}</span></div>
                <div className="db-act-why">{a.items[i].w}</div>
                <div className="db-act-actions">
                  <button className="db-btn db-btn-mint db-btn-sm" onClick={() => resolve(i)}>{a.items[i].c}</button>
                  <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setView(ACT_NAV_TO[m.type] || "inbox")}>{a.items[i].a}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
