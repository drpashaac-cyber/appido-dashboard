// ActivityFeed
import React, { useState, useEffect } from "react";
import { cx } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";
import { FEED_PENDING, FEED_DONE, FEED_POOL } from "../../data";

export function ActivityFeed({ t, autonomy }: any) {
  const f = t.feed;
  const supervised = autonomy !== "auto";
  const seed = () => {
    const head = FEED_PENDING.map((e, k) => supervised
      ? { ...e, id: "fp" + k, ago: k, status: "pending" }
      : { ...e, id: "fp" + k, ago: k, status: "done", tkey: e.doneKey });
    const tail = FEED_DONE.map((e, k) => ({ ...e, id: "fd" + k, ago: k + 2, status: "done" }));
    return [...head, ...tail];
  };
  const [items, setItems] = useState<any[]>(seed);
  useEffect(() => { setItems(seed()); }, [autonomy]);
  useEffect(() => {
    const id = setInterval(() => {
      setItems((L) => { const p = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)]; const ni = { ...p, id: "fx" + Date.now(), ago: 0, status: "done" }; return [ni, ...L.map((x) => ({ ...x, ago: x.ago + 1 }))].slice(0, 8); });
    }, 4800);
    return () => clearInterval(id);
  }, []);
  const txt = (e: any) => (f[e.tkey] || "").replace("{who}", e.who || "").replace("{amt}", e.amt || "").replace("{n}", String(e.n || ""));
  const approve = (e: any) => { setItems((L) => L.map((x) => x.id === e.id ? { ...x, status: "done", tkey: x.doneKey || x.tkey, approved: true } : x)); toast(autonomy === "draft" ? f.sent : f.approved); };
  const pend = items.filter((x) => x.status === "pending").length;
  return (
    <div className="db-feed db-card" style={{ marginBottom: 24 }}>
      <div className="db-feed-h">
        <span className="db-feed-live"><span className="db-feed-dot" /> {f.live}</span>
        <span className="db-feed-t">{f.title}</span>
        {pend ? <span className="db-feed-wait"><Icon name="clock" size={12} /> {f.awaiting.replace("{n}", String(pend))}</span> : null}
      </div>
      <div className="db-feed-list">
        {items.map((e) => (
          <div className={cx("db-feed-it", e.status)} key={e.id}>
            <span className="db-feed-ic"><Icon name={e.ic} size={14} /></span>
            <div className="db-feed-m"><div className="tx">{txt(e)}</div></div>
            {e.status === "pending"
              ? <button className="db-btn db-btn-mint db-btn-sm db-feed-ok" onClick={() => approve(e)}>{autonomy === "draft" ? f.send : f.approve}</button>
              : <span className="db-feed-time">{e.ago === 0 ? f.now : e.ago + "m"}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
