// WallOfWins
import React from "react";
import { money, initials } from "../../lib/format";
import { Icon } from "../ui";
import { WINS } from "../../data";

export function WallOfWins({ t, account, lang, onShare, onClose }: any) {
  const w = t.wall;
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-wallw" onClick={(e) => e.stopPropagation()}>
        <div className="db-wall-h">
          <div style={{ minWidth: 0 }}><div className="db-wall-t"><span className="db-wall-flame"><Icon name="flame" size={16} /></span> {w.title}</div><div className="db-wall-sub">{w.sub}</div></div>
          <button className="db-iconbtn" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
        </div>
        <div className="db-wall-feed">
          <div className="db-win db-win-you">
            <span className="db-win-av">{initials(account.brand)}</span>
            <div className="db-win-main"><div className="db-win-h"><b>{account.brand}</b><span className="db-win-you-tag">{w.youTag}</span></div><div className="db-win-m">{w.youMetric}</div></div>
            <div className="db-win-r"><div className="db-win-amt">{money(32800)}</div><button className="db-win-feat" onClick={onShare}><Icon name="share" size={11} /> {w.featureCta}</button></div>
          </div>
          {WINS.map((win, i) => (
            <div className="db-win" key={i}>
              <span className="db-win-av">{win.fg}</span>
              <div className="db-win-main"><div className="db-win-h"><b dir="ltr">{win.h}</b><span className="db-win-chip"><Icon name="check" size={10} /> {w.verified}</span></div><div className="db-win-m">{w.metrics[win.m]} · {w.whens[win.w]}</div></div>
              <div className="db-win-r"><div className="db-win-amt">{money(win.amt)}</div></div>
            </div>
          ))}
        </div>
        <div className="db-wall-foot"><span className="db-wall-join">{w.joinLine}</span><span className="db-wall-powered"><Icon name="bot" size={12} /> {t.share.poweredBy}</span></div>
      </div>
    </div>
  );
}
