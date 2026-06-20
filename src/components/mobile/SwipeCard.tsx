// SwipeCard
import React, { useState, useRef } from "react";
import { cx, buzz } from "../../lib/format";
import { Icon } from "../ui";

export function SwipeCard({ children, onApprove, onSkip, approveLabel, skipLabel }: any) {
  const [dx, setDx] = useState(0);
  const [gone, setGone] = useState<string | null>(null);
  const sx = useRef(0), sy = useRef(0), md = useRef("none"), bz = useRef(false);
  const TH = 92;
  const begin = (x: number, y: number, target: any) => {
    if (gone) return;
    if (target && target.closest && target.closest("textarea,button,a,select,input,.db-op-reply")) { md.current = "none"; return; }
    sx.current = x; sy.current = y; md.current = "pending"; bz.current = false;
  };
  const move = (x: number, y: number, e: any) => {
    if (md.current === "none" || md.current === "abort" || gone) return;
    const dxx = x - sx.current, dyy = y - sy.current;
    if (md.current === "pending") {
      if (Math.abs(dxx) > 7 && Math.abs(dxx) > Math.abs(dyy)) { md.current = "drag"; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_e) {} }
      else if (Math.abs(dyy) > 7) { md.current = "abort"; return; }
      else return;
    }
    if (md.current === "drag") {
      if (e.cancelable) e.preventDefault();
      setDx(dxx);
      const over = Math.abs(dxx) > TH;
      if (over && !bz.current) { buzz(10); bz.current = true; }
      if (!over) bz.current = false;
    }
  };
  const end = () => {
    if (md.current !== "drag") { md.current = "none"; return; }
    md.current = "none";
    if (dx > TH) { setGone("approve"); buzz(18); setTimeout(() => onApprove && onApprove(), 200); }
    else if (dx < -TH) { setGone("skip"); buzz(12); setTimeout(() => onSkip && onSkip(), 200); }
    else setDx(0);
  };
  const tx = gone === "approve" ? 560 : gone === "skip" ? -560 : dx;
  const dragging = md.current === "drag";
  return (
    <div className="db-swipe-wrap">
      <div className="db-swipe-bg">
        <span className={cx("db-swipe-hint app", dx > 26 && "on")}><Icon name="check" size={15} /> {approveLabel}</span>
        <span className={cx("db-swipe-hint skip", dx < -26 && "on")}>{skipLabel} <Icon name="x" size={15} /></span>
      </div>
      <div className="db-swipe-card" style={{ transform: "translateX(" + tx + "px) rotate(" + (tx / 24) + "deg)", transition: dragging ? "none" : "transform .24s cubic-bezier(.2,.8,.2,1), opacity .2s ease", opacity: gone ? 0 : 1 }}
        onPointerDown={(e: any) => begin(e.clientX, e.clientY, e.target)}
        onPointerMove={(e: any) => move(e.clientX, e.clientY, e)}
        onPointerUp={end} onPointerCancel={() => { md.current = "none"; setDx(0); }}>
        {children}
      </div>
    </div>
  );
}
