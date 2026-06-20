// ProductCard
import React from "react";
import { cx } from "../../lib/format";
import { catDeliver } from "../../lib/catalog";
import { Icon } from "../ui";

export function ProductCard({ prod, t, onEdit, onDelete }: any) {
  const p = t.prod;
  return (
    <div className={cx("db-prodcard", prod.fromSetup && "from-setup")}>
      {prod.fromSetup ? <div className="db-prod-setuptag"><Icon name="bot" size={11} /> {p.setupBadge}</div> : null}
      <div className="db-prodcard-top">
        <div style={{ fontWeight: 700, fontSize: 15, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.name}</div>
        <span title={prod.active ? p.activeL : ""} style={{ marginInlineStart: "auto", flexShrink: 0, width: 9, height: 9, borderRadius: 99, background: prod.active ? "var(--good)" : "#D1C9BA" }} />
      </div>
      {prod.desc ? <div className="db-muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>{prod.desc}</div> : null}
      {prod.cat && catDeliver(prod.cat) ? <div style={{ marginTop: 8 }}><span className="db-deliver-badge"><Icon name="send" size={11} /> {p.deliver[catDeliver(prod.cat) as string]}</span></div> : null}
      <div className="db-prodcard-plans">
        {prod.plans && prod.plans.length ? prod.plans.map((pl: any) => (
          <span key={pl.id} className="db-planpill"><b dir="ltr">{pl.price}</b> <span className="db-muted">{p.per[pl.period] || pl.period}</span></span>
        )) : <span className="db-muted" style={{ fontSize: 12.5 }}>{p.noPlans}</span>}
      </div>
      {prod.discounts && prod.discounts.length ? <div className="db-prodcard-discs">{prod.discounts.map((d: any) => <span key={d.id} className="db-disc-chip"><Icon name="gift" size={11} /> {d.code} −{d.percent}%</span>)}</div> : null}
      <div className="db-prodcard-doc">{(prod.doc && prod.doc.trim()) || (prod.files && prod.files.length) ? <span className="db-doc-on"><Icon name="file" size={12} /> {p.docOn}{prod.files && prod.files.length ? " · " + prod.files.length : ""}</span> : <span className="db-muted" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}><Icon name="file" size={12} /> {p.docOff}</span>}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button className="db-btn db-btn-ghost db-btn-sm" style={{ flex: 1 }} onClick={onEdit}><Icon name="edit" size={14} /> {p.edit}</button>
        <button className="db-btn db-btn-ghost db-btn-sm" aria-label={t.drawer.del} onClick={onDelete}><Icon name="trash" size={15} /></button>
      </div>
    </div>
  );
}
