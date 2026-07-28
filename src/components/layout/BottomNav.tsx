// BottomNav
import React from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";
import { useDataset } from "../../lib/dataset";

export function BottomNav({ view, setView, openMore, t }: any) {
  const { CONVOS, live } = useDataset();
  const inboxBadge = CONVOS.reduce(
    (sum: number, conversation: any) =>
      sum + Number(conversation.unread || 0),
    0
  );
  const tabs = [
    { id: "overview", icon: "grid" },
    { id: "actions", icon: "zap", badge: live ? 0 : 6 },
    { id: "inbox", icon: "inbox", badge: live ? inboxBadge : 7 },
    { id: "crm", icon: "pipe" },
  ];
  const primary = tabs.map((x) => x.id);
  return (
    <nav className="db-bottomnav" role="navigation" aria-label="Primary">
      {tabs.map((x: any) => (
        <button key={x.id} className={cx("db-bnitem", view === x.id && "on")} aria-current={view === x.id ? "page" : undefined} onClick={() => setView(x.id)}>
          <span className="ic"><Icon name={x.icon} size={23} />{x.badge ? <span className="bdg">{x.badge}</span> : null}</span>
          <span className="lb">{t.bnav[x.id]}</span>
        </button>
      ))}
      <button className={cx("db-bnitem", !primary.includes(view) && "on")} aria-current={!primary.includes(view) ? "page" : undefined} aria-label={t.bnav.more} onClick={openMore}>
        <span className="ic"><Icon name="more" size={22} /></span>
        <span className="lb">{t.bnav.more}</span>
      </button>
    </nav>
  );
}
