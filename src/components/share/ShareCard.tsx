// ShareCard
import React from "react";
import { money } from "../../lib/format";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";
import { KPIS } from "../../data";
import { wrapText } from "./wrapText";

export function ShareCard({ t, account, lang, onRefer, onWall, onClose }: any) {
  const s = t.share;
  const slug = (account.brand || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const link = "appido.io/r/" + slug;
  const amt = money(32800);
  const caption = s.caption.replace("{amt}", amt).replace("{brand}", account.brand || "");
  const isRTL = lang === "fa" || lang === "ar";
  const downloadImage = () => {
    try {
      const W = 1080, H = 1080;
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const ctx: any = c.getContext("2d");
      if (!ctx) { toast(s.saved); return; }
      try { ctx.direction = isRTL ? "rtl" : "ltr"; } catch (e) {}
      ctx.fillStyle = "#1A312B"; ctx.fillRect(0, 0, W, H);
      const gr = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.4, 640);
      gr.addColorStop(0, "rgba(103,225,141,0.2)"); gr.addColorStop(1, "rgba(103,225,141,0)");
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(209,201,186,0.25)"; ctx.lineWidth = 2; ctx.strokeRect(44, 44, W - 88, H - 88);
      ctx.textAlign = "center";
      ctx.fillStyle = "#F4F1E6"; ctx.font = "600 42px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      ctx.fillText(account.brand || "Brand", W / 2, 198);
      ctx.fillStyle = "#D1C9BA"; ctx.font = "500 27px system-ui, sans-serif";
      ctx.fillText(s.period, W / 2, 246);
      ctx.fillStyle = "#67E18D"; ctx.font = "800 158px system-ui, sans-serif";
      ctx.fillText(amt, W / 2, 474);
      ctx.fillStyle = "#F4F1E6"; ctx.font = "500 34px system-ui, sans-serif";
      wrapText(ctx, s.recovered, W / 2, 560, W - 240, 46);
      const stats = [["127", s.statSales], ["+" + KPIS[0].delta + "%", s.statLift], ["$0", s.statAd]];
      const xs = [W * 0.26, W * 0.5, W * 0.74];
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "#67E18D"; ctx.font = "800 58px system-ui, sans-serif"; ctx.fillText(stats[i][0], xs[i], 814);
        ctx.fillStyle = "#D1C9BA"; ctx.font = "500 24px system-ui, sans-serif"; ctx.fillText(stats[i][1], xs[i], 858);
      }
      ctx.strokeStyle = "rgba(209,201,186,0.2)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(130, 930); ctx.lineTo(W - 130, 930); ctx.stroke();
      ctx.fillStyle = "#67E18D"; ctx.font = "700 36px system-ui, sans-serif"; ctx.fillText(s.poweredBy, W / 2, 1006);
      ctx.fillStyle = "#D1C9BA"; ctx.font = "500 27px system-ui, sans-serif"; ctx.fillText("appido.io", W / 2, 1048);
      const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = (slug || "appido") + "-win.png";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast(s.saved);
    } catch (e) { toast(s.saved); }
  };

  const cp = (txt: string, msg: string) => { try { (navigator as any) && (navigator as any).clipboard && (navigator as any).clipboard.writeText(txt); } catch (e) {} toast(msg); };
  const shareTg = () => { try { const u = "https://t.me/share/url?url=" + encodeURIComponent("https://" + link) + "&text=" + encodeURIComponent(caption); (window as any) && (window as any).open && (window as any).open(u, "_blank"); } catch (e) {} toast(s.shared); };
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-sharew" onClick={(e) => e.stopPropagation()}>
        <div className="db-share-h"><div className="db-share-t">{s.title}</div><button className="db-iconbtn" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button></div>
        <div className="db-sharecard">
          <div className="db-sc-top"><span className="db-sc-brand">{account.brand}</span><span className="db-sc-period">{s.period}</span></div>
          <div className="db-sc-amt">{amt}</div>
          <div className="db-sc-cap">{s.recovered}</div>
          <div className="db-sc-stats">
            <div className="db-sc-stat"><b>127</b><span>{s.statSales}</span></div>
            <div className="db-sc-stat"><b>+{KPIS[0].delta}%</b><span>{s.statLift}</span></div>
            <div className="db-sc-stat"><b>$0</b><span>{s.statAd}</span></div>
          </div>
          <div className="db-sc-foot"><span className="db-sc-logo"><Icon name="bot" size={13} /> Appido</span><span className="db-sc-url">appido.io</span></div>
        </div>
        <div className="db-share-acts">
          <button className="db-btn db-btn-mint db-share-primary" onClick={shareTg}><Icon name="send" size={15} /> {s.shareTg}</button>
          <div className="db-share-row">
            <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => cp(caption, s.capCopied)}><Icon name="copy" size={12} /> {s.copyCap}</button>
            <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => cp(link, s.linkCopied)}><Icon name="globe" size={12} /> {s.copyLink}</button>
            <button className="db-btn db-btn-ghost db-btn-sm" onClick={downloadImage}><Icon name="upload" size={12} /> {s.download}</button>
          </div>
        </div>
        <button className="db-share-wall" onClick={onWall}><span className="db-share-wall-ic"><Icon name="flame" size={16} /></span><div className="m"><div className="t">{s.wallCta}</div></div><Icon name="chevron" size={15} /></button>
        <button className="db-share-ref" onClick={onRefer}><span className="db-share-ref-ic"><Icon name="gift" size={16} /></span><div className="m"><div className="t">{s.refNudge}</div></div><Icon name="chevron" size={15} /></button>
      </div>
    </div>
  );
}
