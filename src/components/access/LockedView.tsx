// LockedView — shown when a non-VIP user reaches a VIP-only section (defense in depth;
// the sidebar already blocks navigation). Pure presentational.
import React from "react";
import { Icon } from "../ui";

export function LockedView({ t, onUpgrade }: { t: any; onUpgrade: () => void }) {
  return (
    <div className="db-locked" role="region" aria-label={t.locked.title}>
      <div className="db-locked-badge"><Icon name="lock" size={30} /></div>
      <span className="db-locked-tag">{t.locked.badge}</span>
      <h2 className="db-locked-title">{t.locked.title}</h2>
      <p className="db-locked-body">{t.locked.body}</p>
      <button className="db-btn db-btn-mint db-locked-cta" onClick={onUpgrade}>
        <Icon name="spark" size={16} /> {t.locked.upgrade}
      </button>
    </div>
  );
}
