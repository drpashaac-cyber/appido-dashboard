// TransactionsView
import React, { useState } from "react";
import { cx, fmt, initials } from "../../lib/format";
import { Icon, PageHead } from "../ui";
import { useDataset } from "../../lib/dataset";
import { OnChainReceipt } from "./OnChainReceipt";

export function TransactionsView({ t, lang }: any) {
  const { TXNS } = useDataset();
  const ok = TXNS.filter((x) => x.status === "ok").length;
  const fail = TXNS.length - ok;
  const [f, setF] = useState("all");
  const [receipt, setReceipt] = useState<any>(null);
  const list = TXNS.filter((x) => f === "all" || x.status === f);
  return (
    <>
      <PageHead title={t.txns.title} sub={t.txns.sub} />
      <div className="db-grid g-3" style={{ marginBottom: 18 }}>
        <div className="db-kpi"><div className="k">{t.txns.total}</div><div className="v">{fmt(TXNS.length)}</div></div>
        <div className="db-kpi"><div className="k">{t.txns.ok}</div><div className="v" style={{ color: "var(--good)" }}>{fmt(ok)}</div></div>
        <div className="db-kpi"><div className="k">{t.txns.failed}</div><div className="v" style={{ color: "#D4694F" }}>{fmt(fail)}</div></div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{["all", "ok", "fail"].map((id, i) => <button key={id} className={cx("db-segtab", f === id && "on")} onClick={() => setF(id)}>{t.txns.filters[i]}</button>)}</div>
      <div className="db-card"><div className="db-list">
        {list.map((x, i) => { const isCrypto = /USDT/.test(x.gw) && x.status === "ok"; return (
          <div className={cx("db-li", isCrypto && "db-li-tap")} key={i} onClick={isCrypto ? () => setReceipt(x) : undefined} onKeyDown={isCrypto ? (e: any) => { if (e.key === "Enter") setReceipt(x); } : undefined} role={isCrypto ? "button" : undefined} tabIndex={isCrypto ? 0 : undefined} aria-label={isCrypto ? t.chain.verifyHint : undefined}>
            <span className="db-av" style={{ width: 34, height: 34, fontSize: 12 }}>{initials(x.name)}</span>
            <div style={{ minWidth: 0 }}><div style={{ fontWeight: 650, fontSize: 13.5 }}>{x.name}</div><div className="db-muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.offers.names[x.plan]} · {x.gw}</div>{isCrypto ? <div className="db-chain-tag"><Icon name="shield" size={10} /> {t.chain.verifyHint}</div> : null}</div>
            <div style={{ marginInlineStart: "auto", textAlign: "end", flexShrink: 0 }}><div style={{ fontWeight: 700, fontFamily: "var(--mono)", fontSize: 13.5 }} dir="ltr">{x.amount}</div><div className="db-muted" style={{ fontSize: 11 }}>{t.txns.time[x.time]}</div></div>
            <span className="db-chip" style={{ flexShrink: 0, background: x.status === "ok" ? "rgba(103,225,141,.18)" : "rgba(212,105,79,.16)", color: x.status === "ok" ? "#1A312B" : "#D4694F" }}>{x.status === "ok" ? t.txns.statusOk : t.txns.statusFail}</span>
          </div>
        ); })}
      </div></div>
      {receipt ? <OnChainReceipt t={t} lang={lang} txn={receipt} onClose={() => setReceipt(null)} /> : null}
    </>
  );
}
