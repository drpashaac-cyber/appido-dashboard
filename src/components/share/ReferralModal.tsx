// ReferralModal
import React from "react";
import { cx, initials } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";

export function ReferralModal({ t, account, onClose }: any) {
  const r = t.ref;
  const slug = (account.brand || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const suf = ((Array.from(account.brand || "Appido") as string[]).reduce((h: number, c: string) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7)).toString(36).toUpperCase().slice(0, 4);
  const link = "appido.io/r/" + slug + "-" + suf.toLowerCase();
  const cp = (txt: string, msg: string) => { try { (navigator as any) && (navigator as any).clipboard && (navigator as any).clipboard.writeText(txt); } catch (e) {} toast(msg); };
  const shareTg = () => { try { const u = "https://t.me/share/url?url=" + encodeURIComponent("https://" + link) + "&text=" + encodeURIComponent(r.shareText); (window as any) && (window as any).open && (window as any).open(u, "_blank"); } catch (e) {} toast(r.shared); };
  const friends = [{ n: "Saman R.", st: "subscribed" }, { n: "Olga V.", st: "subscribed" }, { n: "Mehdi K.", st: "joined" }, { n: "Anna S.", st: "invited" }];
  const subscribed = friends.filter((f) => f.st === "subscribed").length;
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-refw" onClick={(e) => e.stopPropagation()}>
        <div className="db-ref-h"><span className="db-ref-ic"><Icon name="gift" size={18} /></span><div style={{ minWidth: 0 }}><div className="db-ref-t">{r.title}</div><div className="db-ref-s">{r.subtitle}</div></div><button className="db-iconbtn" onClick={onClose} aria-label="Close" style={{ marginInlineStart: "auto" }}><Icon name="x" size={16} /></button></div>
        <div className="db-ref-body">{r.body}</div>
        <div className="db-ref-linkbox"><span className="db-ref-link" dir="ltr">{link}</span><button className="db-btn db-btn-mint db-btn-sm" onClick={() => cp(link, r.copied)}><Icon name="copy" size={13} /> {r.copy}</button></div>
        <button className="db-btn db-btn-ghost db-ref-share" onClick={shareTg}><Icon name="send" size={14} /> {r.shareTg}</button>
        <div className="db-ref-stats">
          <div className="db-ref-stat"><b>{friends.length}</b><span>{r.invited}</span></div>
          <div className="db-ref-stat"><b>{friends.filter((f) => f.st !== "invited").length}</b><span>{r.joined}</span></div>
          <div className="db-ref-stat hot"><b>{subscribed}</b><span>{r.subscribed}</span></div>
        </div>
        <div className="db-ref-earned"><Icon name="spark" size={14} /> {r.earned}: <b>${Math.floor(subscribed / 2) * 100}</b></div>
        <div className="db-ref-prog"><Icon name="zap" size={13} /> {r.progress}</div>
        <div className="db-ref-friends-t">{r.friends}</div>
        <div className="db-ref-friends">
          {friends.map((f, k) => (<div className="db-ref-fr" key={k}><span className="db-av" style={{ width: 28, height: 28, fontSize: 11 }}>{initials(f.n)}</span><span className="db-ref-fn">{f.n}</span><span className={cx("db-ref-st", f.st)}>{r[f.st]}</span></div>))}
        </div>
      </div>
    </div>
  );
}
