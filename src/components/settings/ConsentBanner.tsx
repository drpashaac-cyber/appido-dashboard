// ConsentBanner
import React, { useState } from "react";
import { toast } from "../../lib/toast";
import { Icon } from "../ui";
import { PrivacyPrefsModal } from "./PrivacyPrefsModal";

export function ConsentBanner({ t, onDecide }: any) {
  const c = t.consent;
  const [prefs, setPrefs] = useState(false);
  if (prefs) return <PrivacyPrefsModal t={t} onSave={(v: any) => onDecide(v)} onClose={() => setPrefs(false)} />;
  return (
    <div className="db-consent" role="dialog" aria-label={c.title}>
      <div className="db-consent-main"><span className="db-consent-ic"><Icon name="shield" size={16} /></span><div style={{ minWidth: 0 }}><div className="db-consent-t">{c.title}</div><div className="db-consent-s">{c.body} <button className="db-consent-link" onClick={() => toast(t.toast.soon)}>{c.policy}</button></div></div></div>
      <div className="db-consent-acts"><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setPrefs(true)}>{c.customize}</button><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => onDecide({ analytics: false, marketing: false })}>{c.necessaryOnly}</button><button className="db-btn db-btn-mint db-btn-sm" onClick={() => onDecide({ analytics: true, marketing: true })}>{c.acceptAll}</button></div>
    </div>
  );
}
