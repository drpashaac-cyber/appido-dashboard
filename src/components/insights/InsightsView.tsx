// InsightsView
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { PageHead, SegRow } from "../ui";
import { INSIGHTS } from "../../data";

export function InsightsView({ t }: any) {
  const [hidden, setHidden] = useState<number[]>([]);
  return (
    <>
      <PageHead title={t.ins.title} sub={t.ins.sub} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860 }}>
        {INSIGHTS.map((ins, i) => hidden.includes(i) ? null : (
          <SegRow key={i} tone={ins.tone} icon={ins.icon} align title={t.ins.items[i].t} sub={t.ins.items[i].d}
            footer={<div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}><button className="db-btn db-btn-mint db-btn-sm" onClick={() => toast(i === 1 ? t.toast.scheduled : t.toast.applied)}>{t.ins.items[i].cta}</button><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => { setHidden((p) => [...p, i]); toast(t.toast.dismissed); }}>{t.common.dismiss}</button></div>} />
        ))}
      </div>
    </>
  );
}
