// OnChainReceipt
import React, { useMemo } from "react";
import { fmt, fmtDateTime } from "../../lib/format";
import { agoToDate, seedOf, makeReceipt } from "../../lib/receipt";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";

export function OnChainReceipt({ t, lang, txn, onClose, mode, z }: any) {
  const c = t.chain;
  const rc = useMemo(() => makeReceipt(seedOf(txn), txn.gw), [txn]);
  const usdt = String(txn.amount || "").replace("$", "");
  const bt = fmtDateTime(agoToDate(txn.time), lang);
  const short = (v: string) => (v && v.length > 24 ? v.slice(0, 12) + "\u2026" + v.slice(-8) : v);
  const cp = (v: string) => { try { (navigator as any) && (navigator as any).clipboard && (navigator as any).clipboard.writeText(v); } catch (e) {} toast(c.copied); };
  const row = (label: string, value: string, full?: string) => (
    <div className="db-chain-row"><span className="db-chain-rl">{label}</span><span className="db-chain-rv" dir="ltr">{value}{full ? <button className="db-chain-cp" aria-label={c.copied} onClick={() => cp(full)}><Icon name="copy" size={13} /></button> : null}</span></div>
  );
  return (
    <div className="db-celeb" style={z ? { zIndex: z } : undefined} role="dialog" aria-modal="true" aria-label={c.title} onClick={onClose}>
      <div className="db-chain-card" onClick={(e) => e.stopPropagation()}>
        <button className="db-celeb-close" aria-label="Close" onClick={onClose}><Icon name="x" size={18} /></button>
        <div className="db-chain-vbadge"><Icon name="check" size={26} /></div>
        <div className="db-chain-vtitle">{c.verified}</div>
        <div className="db-chain-conf">{c.confirmations.replace("{n}", String(rc.conf))}</div>
        <div className="db-chain-amt" dir="ltr">{usdt} USDT</div>
        <div className="db-chain-fiat">{"\u2248 "}{txn.amount}</div>
        <div className="db-chain-rows">
          {row(c.network, rc.token + " \u00b7 " + rc.net + " (" + rc.chain + ")")}
          {row(c.txHash, short(rc.hash), rc.hash)}
          {row(c.from, short(rc.from), rc.from)}
          {row(mode === "out" ? c.toAppido : c.to, short(rc.to), rc.to)}
          {row(c.block, "#" + fmt(rc.block))}
          {row(c.time, bt)}
        </div>
        <a className="db-btn db-btn-mint db-chain-explore" href={rc.url + rc.hash} target="_blank" rel="noopener noreferrer">{c.viewExplorer.replace("{x}", rc.explorer)} <span aria-hidden="true">{"\u2197"}</span></a>
        <div className="db-chain-note"><Icon name="shield" size={14} /> {mode === "out" ? c.outNote : c.nonCustodial}</div>
      </div>
    </div>
  );
}
