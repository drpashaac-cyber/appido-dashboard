// PrivacyPrefsModal
import React, { useState } from "react";
import { Icon, Switch } from "../ui";

export function PrivacyPrefsModal({ t, value, onSave, onClose }: any) {
  const c = t.consent;
  const [analytics, setAnalytics] = useState(value ? !!value.analytics : true);
  const [marketing, setMarketing] = useState(value ? !!value.marketing : true);
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal db-consent-prefs" onClick={(e) => e.stopPropagation()}>
        <div className="db-consent-ph"><span className="db-consent-ic"><Icon name="shield" size={16} /></span><div style={{ minWidth: 0 }}><div className="db-consent-t">{c.prefsTitle}</div><div className="db-consent-s">{c.prefsBody}</div></div></div>
        <div className="db-consent-cat">
          <div className="db-consent-catrow"><div className="m"><div className="t">{c.necessary}</div><div className="s">{c.necessaryDesc}</div></div><span className="db-consent-always">{c.always}</span></div>
          <div className="db-consent-catrow"><div className="m"><div className="t">{c.analytics}</div><div className="s">{c.analyticsDesc}</div></div><Switch on={analytics} onClick={() => setAnalytics((v) => !v)} label={c.analytics} /></div>
          <div className="db-consent-catrow"><div className="m"><div className="t">{c.marketing}</div><div className="s">{c.marketingDesc}</div></div><Switch on={marketing} onClick={() => setMarketing((v) => !v)} label={c.marketing} /></div>
        </div>
        <button className="db-btn db-btn-mint" style={{ width: "100%", marginTop: 16 }} onClick={() => onSave({ analytics, marketing })}>{c.save}</button>
      </div>
    </div>
  );
}
