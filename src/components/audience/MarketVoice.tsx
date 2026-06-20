// MarketVoice
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon, CardHead } from "../ui";
import { MARKET_VOICE } from "../../data";

export function MarketVoice({ t }: any) {
  const m = t.mv;
  const [active, setActive] = useState<string[]>(["fa", "ru", "tr"]);
  const [sel, setSel] = useState("fa");
  const cur = MARKET_VOICE.find((x) => x.id === sel) || MARKET_VOICE[0];
  const toggle = (id: string) => setActive((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  return (
    <div className="db-card db-mv" style={{ marginTop: 16 }}>
      <CardHead title={m.title} icon="globe" />
      <div className="db-pad">
        <div className="db-noteline" style={{ marginTop: 0, marginBottom: 16 }}><Icon name="globe" size={13} /> {m.sub}</div>
        <div className="db-mv-lab">{m.active}</div>
        <div className="db-mv-markets">{MARKET_VOICE.map((x) => <button key={x.id} type="button" className={cx("db-mv-chip", active.includes(x.id) && "on")} onClick={() => toggle(x.id)}>{active.includes(x.id) ? <Icon name="check" size={13} /> : null} {m.names[x.id]}</button>)}</div>
        <div className="db-mv-note">{m.activeNote}</div>
        <div className="db-mv-prev-head"><span className="db-mv-lab">{m.previewLab}</span><span className="db-mv-same">{m.sameOffer}</span></div>
        <div className="db-mv-tabs">{MARKET_VOICE.map((x) => <button key={x.id} type="button" className={cx("db-mv-tab", sel === x.id && "on")} onClick={() => setSel(x.id)}>{m.names[x.id]}</button>)}</div>
        <div className="db-mv-card">
          <div className="db-mv-meta"><span className="db-mv-tone"><Icon name="spark" size={12} /> {m.tones[cur.id]}</span></div>
          <div className={cx("db-mv-bubble", cur.rtl && "rtl")} dir={cur.rtl ? "rtl" : "ltr"}>{cur.sample}</div>
          <div className="db-mv-why"><Icon name="spark" size={13} /> <span>{m.why[cur.id]}</span></div>
        </div>
      </div>
    </div>
  );
}
