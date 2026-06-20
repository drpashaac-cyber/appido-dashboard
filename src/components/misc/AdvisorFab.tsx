// AdvisorFab — floating launcher. Owns its own scroll-reactive state so that
// scrolling re-renders ONLY this button, not the whole dashboard tree.
import React, { useState, useEffect } from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";

export function AdvisorFab({ label, onOpen }: { label: string; onOpen: () => void }) {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let toid: ReturnType<typeof setTimeout>;
    const onScroll = () => { setScrolling(true); clearTimeout(toid); toid = setTimeout(() => setScrolling(false), 600); };
    if (typeof window !== "undefined") window.addEventListener("scroll", onScroll, true);
    return () => { if (typeof window !== "undefined") window.removeEventListener("scroll", onScroll, true); clearTimeout(toid); };
  }, []);
  return (
    <button className={cx("db-adv-glass", scrolling && "scrolling")} aria-label={label} onClick={onOpen}>
      <Icon name="bot" size={24} /><span className="db-adv-glass-dot" />
    </button>
  );
}
