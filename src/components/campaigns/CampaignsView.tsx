// CampaignsView
import React, { useState, useEffect } from "react";
import { cx, fmt } from "../../lib/format";
import { Icon, PageHead } from "../ui";
import { useDataset } from "../../lib/dataset";
import { CampaignComposer } from "./CampaignComposer";

export function CampaignsView({ t, prefill, clearPrefill }: any) {
  const { CAMPAIGNS } = useDataset();
  const [open, setOpen] = useState(false);
  const [pf, setPf] = useState<number | null>(null);
  const [campTab, setCampTab] = useState("all");
  useEffect(() => { if (prefill !== null && prefill !== undefined) { setPf(prefill); setOpen(true); clearPrefill && clearPrefill(); } }, [prefill]);
  return (
    <>
      <PageHead title={t.camp.title} sub={t.camp.sub}><button className="db-btn db-btn-mint" onClick={() => { setPf(null); setOpen(true); }}><Icon name="plus" size={16} /> {t.comp.newBtn}</button></PageHead>
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={campTab === "all"} className={cx(campTab === "all" && "on")} onClick={() => setCampTab("all")}><span className="ic"><Icon name="grid" size={15} /></span><span>{t.camp.all}</span></button>
        <button role="tab" aria-selected={campTab === "active"} className={cx(campTab === "active" && "on")} onClick={() => setCampTab("active")}><span className="ic"><Icon name="flame" size={15} /></span><span>{t.camp.active}</span></button>
        <button role="tab" aria-selected={campTab === "draft"} className={cx(campTab === "draft" && "on")} onClick={() => setCampTab("draft")}><span className="ic"><Icon name="file" size={15} /></span><span>{t.camp.draft}</span></button>
      </div>
      <div className="db-grid g-2">
        {CAMPAIGNS.map((c, i) => ({ c, i })).filter((x) => campTab === "all" || (campTab === "active" ? x.c.status === "Active" : x.c.status !== "Active")).map(({ c, i }) => (
          <div className="db-card db-pad" key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{t.camp.items[i].n}</div><span className={cx("db-tag", c.status === "Active" ? "warm" : "cold")} style={{ marginInlineStart: "auto" }}>{c.status === "Active" ? t.camp.active : t.camp.draft}</span></div>
            <div className="db-muted" style={{ fontSize: 12.5, marginTop: 3 }}>{t.camp.items[i].kind}</div>
            <div style={{ display: "flex", gap: 22, marginTop: 18, flexWrap: "wrap" }}>
              <div><div className="db-muted" style={{ fontSize: 11.5 }}>{t.camp.sent}</div><div style={{ fontWeight: 750, fontFamily: "var(--mono)", fontSize: 18 }}>{fmt(c.sent)}</div></div>
              <div><div className="db-muted" style={{ fontSize: 11.5 }}>{t.camp.reply}</div><div style={{ fontWeight: 750, fontFamily: "var(--mono)", fontSize: 18, color: "var(--good)" }}>{c.reply}%</div></div>
              <div><div className="db-muted" style={{ fontSize: 11.5 }}>{t.camp.converted}</div><div style={{ fontWeight: 750, fontFamily: "var(--mono)", fontSize: 18 }}>{c.conv}%</div></div>
            </div>
            <div className="db-meter" style={{ marginTop: 16 }}><i style={{ width: c.conv * 4 + "%" }} /></div>
          </div>
        ))}
      </div>
      {open && <CampaignComposer t={t} prefill={pf} onClose={() => { setOpen(false); setPf(null); }} />}
    </>
  );
}
