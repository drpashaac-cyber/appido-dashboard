// PlaybookGallery
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";
import { PLAYBOOKS } from "../../data";

export function PlaybookGallery({ t, onClose, onUse }: any) {
  const p = t.pb;
  const types = ["all", "course", "signals", "coach", "membership", "digital", "agency"];
  const [filter, setFilter] = useState("all");
  const list = PLAYBOOKS.map((pb, i) => ({ ...pb, ...p.list[i], idx: i }));
  const shown = filter === "all" ? list : list.filter((x: any) => x.type === filter);
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-pbw" onClick={(e) => e.stopPropagation()}>
        <div className="db-pb-h"><span className="db-pb-ic"><Icon name="grid" size={16} /></span><div style={{ minWidth: 0 }}><div className="db-pb-t">{p.title}</div><div className="db-pb-s">{p.sub}</div></div><button className="db-iconbtn" onClick={onClose} aria-label="Close" style={{ marginInlineStart: "auto" }}><Icon name="x" size={16} /></button></div>
        <div className="db-pb-filter">{types.map((ty) => <button key={ty} className={cx("db-pb-chip", filter === ty && "on")} onClick={() => setFilter(ty)}>{ty === "all" ? p.all : p.types[ty]}</button>)}</div>
        <div className="db-pb-list">
          {shown.map((pb: any) => (
            <div className="db-pb-card" key={pb.idx}>
              <div className="db-pb-card-h"><span className="db-pb-card-ic"><Icon name={pb.icon} size={18} /></span><div style={{ minWidth: 0 }}><div className="db-pb-card-t">{pb.t}</div><span className="db-pb-badge">{p.types[pb.type]}</span></div></div>
              <div className="db-pb-desc">{pb.d}</div>
              <div className="db-pb-inside">{p.inside}</div>
              <div className="db-pb-steps">{pb.s.map((st: string, k: number) => <div className="db-pb-step" key={k}><span className="n">{k + 1}</span><span>{st}</span></div>)}</div>
              <div className="db-pb-impact"><Icon name="arrowUp" size={12} /> {p.impact}: <b>{pb.imp}</b></div>
              <button className="db-btn db-btn-mint db-pb-use" onClick={() => onUse && onUse(pb)}><Icon name="zap" size={14} /> {p.use}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
