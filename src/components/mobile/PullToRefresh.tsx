// PullToRefresh
import React, { useState, useRef } from "react";
import { cx, buzz } from "../../lib/format";
import { Icon } from "../ui";

export function PullToRefresh({ onRefresh, label, releaseLabel, refreshingLabel, children }: any) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startY = useRef<number | null>(null);
  const scroller = useRef<any>(null);
  const bz = useRef(false);
  const MAX = 88, TRIG = 62;
  const onStart = (e: any) => {
    if (refreshing) return;
    const sc = (e.currentTarget.closest && e.currentTarget.closest(".db-content")) || e.currentTarget.parentElement;
    scroller.current = sc;
    if (sc && sc.scrollTop > 0) { startY.current = null; return; }
    startY.current = e.touches[0].clientY; bz.current = false;
  };
  const onMove = (e: any) => {
    if (startY.current == null || refreshing) return;
    const sc = scroller.current;
    if (sc && sc.scrollTop > 0) { startY.current = null; setPull(0); setDragging(false); return; }
    const d = e.touches[0].clientY - startY.current;
    if (d > 0) {
      if (e.cancelable) e.preventDefault();
      if (!dragging) setDragging(true);
      const p = Math.min(MAX, d * 0.5);
      setPull(p);
      if (p >= TRIG && !bz.current) { buzz(10); bz.current = true; }
      if (p < TRIG) bz.current = false;
    } else setPull(0);
  };
  const onEnd = () => {
    if (startY.current == null) { setDragging(false); return; }
    startY.current = null; setDragging(false);
    if (pull >= TRIG) {
      setRefreshing(true); setPull(TRIG); buzz(16);
      Promise.resolve(onRefresh && onRefresh()).then(() => setTimeout(() => { setRefreshing(false); setPull(0); }, 650));
    } else setPull(0);
  };
  return (
    <div className="db-ptr" onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}>
      <div className="db-ptr-ind" style={{ height: refreshing ? TRIG : pull, opacity: (pull > 5 || refreshing) ? 1 : 0, transition: dragging ? "none" : "height .25s ease, opacity .2s ease" }}>
        <span className={cx("db-ptr-spin", refreshing && "spin")} style={refreshing ? {} : { transform: "rotate(" + (pull * 3) + "deg)" }}><Icon name={refreshing ? "spark" : (pull >= TRIG ? "arrowUp" : "arrowDown")} size={16} /></span>
        <span className="db-ptr-txt">{refreshing ? refreshingLabel : (pull >= TRIG ? releaseLabel : label)}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
