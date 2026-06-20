// ChannelSwitcher
import React, { useState } from "react";
import { cx, fmt, initials } from "../../lib/format";
import { Icon } from "../ui";

export function ChannelSwitcher({ channels, activeId, onSwitch, onAdd, onHub, t }: any) {
  const [open, setOpen] = useState(false);
  const active = channels.find((c: any) => c.id === activeId) || channels[0];
  if (!active) return null;
  return (
    <div className="db-chsw">
      <button className="db-chsw-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="listbox">
        <span className="db-chsw-av">{initials(active.name)}</span>
        <span className="db-chsw-nm">{active.name}</span>
        <Icon name="chevrond" size={15} />
      </button>
      {open && (<>
        <div style={{ position: "fixed", inset: 0, zIndex: 58 }} onClick={() => setOpen(false)} />
        <div className="db-chsw-pop" role="listbox">
          {onHub ? <button className="db-chsw-hub" onClick={() => { onHub(); setOpen(false); }}><span className="hi"><Icon name="grid" size={15} /></span> {t.hub.title}</button> : null}
          <div className="db-chsw-head">{t.ch.your}</div>
          {channels.map((c: any) => (
            <button key={c.id} role="option" aria-selected={c.id === activeId} className={cx("db-chsw-item", c.id === activeId && "on")} onClick={() => { onSwitch(c.id); setOpen(false); }}>
              <span className="db-chsw-av">{initials(c.name)}</span>
              <div style={{ minWidth: 0, textAlign: "start" }}><div className="nm">{c.name}</div><div className="mt" dir="ltr">{fmt(c.members)} {t.ch.members}</div></div>
              {c.id === activeId ? <span className="ck"><Icon name="check" size={15} /></span> : null}
            </button>
          ))}
          <button className="db-chsw-add" onClick={() => { onAdd(); setOpen(false); }}><span className="pl"><Icon name="plus" size={16} /></span> {t.ch.add}</button>
        </div>
      </>)}
    </div>
  );
}
