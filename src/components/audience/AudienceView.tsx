// AudienceView
import React, { useState } from "react";
import { cx, heatColor } from "../../lib/format";
import { Icon, Donut, PageHead, CardHead } from "../ui";
import { GENDER, AGES, GEO, HOURS, DAYS, HEAT } from "../../data";

export function AudienceView({ t, onImport }: any) {
  const gsegs = GENDER.map((g, i) => ({ l: t.aud.genders[i], v: g.v, c: g.c }));
  const [audTab, setAudTab] = useState("demo");
  return (
    <>
      <PageHead title={t.aud.title} sub={t.aud.sub}><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => onImport && onImport()}><Icon name="upload" size={14} /> {t.imp.audAdd}</button></PageHead>
      <div className="db-ovtabs" role="tablist">
        <button role="tab" aria-selected={audTab === "demo"} className={cx(audTab === "demo" && "on")} onClick={() => setAudTab("demo")}><span className="ic"><Icon name="users" size={15} /></span><span>{t.aud.tabs.demo}</span></button>
        <button role="tab" aria-selected={audTab === "hours"} className={cx(audTab === "hours" && "on")} onClick={() => setAudTab("hours")}><span className="ic"><Icon name="clock" size={15} /></span><span>{t.aud.tabs.hours}</span></button>
      </div>
      {audTab === "demo" ? (<>
      <div className="db-grid g-3" style={{ marginBottom: 24 }}>
        <div className="db-card"><CardHead title={t.aud.gender} /><div className="db-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Donut segs={gsegs} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{gsegs.map((g) => <div key={g.l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><span style={{ width: 10, height: 10, borderRadius: 99, background: g.c }} />{g.l}<b style={{ marginInlineStart: "auto", fontFamily: "var(--mono)" }}>{g.v}%</b></div>)}</div>
        </div></div>
        <div className="db-card"><CardHead title={t.aud.age} /><div className="db-pad"><div className="db-bars">{AGES.map((a) => <div key={a.l} className="b" style={{ height: (a.v / 40) * 100 + "%" }} title={a.v + "%"} />)}</div><div className="db-barlabels">{AGES.map((a) => <span key={a.l}>{a.l}</span>)}</div></div></div>
        <div className="db-card"><CardHead title={t.aud.geo} /><div className="db-pad"><div className="db-geo">{GEO.map((g, i) => <div className="db-georow" key={i}><span className="gl">{t.aud.geos[i]}</span><span className="db-gbar"><i style={{ width: (g.v / 41) * 100 + "%" }} /></span><span className="gt">{g.v}%</span></div>)}</div></div></div>
      </div>
      </>) : (<>
      <div className="db-card">
        <CardHead title={t.aud.heatmap} right={<span className="db-muted" style={{ fontSize: 12.5 }}>{t.aud.heatNote}</span>} />
        <div className="db-pad" style={{ overflowX: "auto" }}><div className="db-heat" style={{ minWidth: 420 }}>
          <span />{HOURS.map((h) => <span key={h} className="hl" style={{ justifyContent: "center" }}>{h}</span>)}
          {DAYS.map((d, di) => <React.Fragment key={d}><span className="hl">{t.aud.days[di]}</span>{HEAT[di].map((v, hi) => <span key={hi} className="hc" style={{ background: heatColor(v) }} title={t.aud.days[di] + " " + HOURS[hi]} />)}</React.Fragment>)}
        </div></div>
      </div>
      </>)}
    </>
  );
}
