// BotStatus — the tenant's Telegram bot, live: webhook health, backlog, last error, disconnect.
// In demo mode it shows the seeded channel's bot without calling the backend.
import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Icon, CardHead } from "../ui";
import { toast } from "../../lib/toast";

export function BotStatus({ t, channel, onChanged }: any) {
  const live = api.enabled();
  const [st, setSt] = useState<{ url?: string; pendingUpdates?: number; lastError?: string | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const uname = channel?.botUsername || (channel?.username ? String(channel.username).replace(/^@/, "") : "");

  useEffect(() => {
    if (live && channel?.id) api.telegram.status(channel.id).then((s: any) => setSt(s)).catch(() => setSt(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, channel?.id]);

  const connected = live ? (st ? !!st.url : !!(channel?.connectedAt || uname)) : true;
  const healthy = st ? !!st.url && !st.lastError : connected;

  const disconnect = () => {
    if (!live || !channel?.id) { toast(t.toast.soon); return; }
    setBusy(true);
    api.telegram
      .disconnect(channel.id)
      .then(() => { toast(t.set.disconnected); onChanged && onChanged(); })
      .catch(() => toast(t.toast.soon))
      .finally(() => setBusy(false));
  };

  return (
    <div className="db-card">
      <CardHead title={t.set.tg} />
      <div className="db-pad" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span className="db-av" style={{ background: "var(--mint-bri)", color: "var(--forest)" }}><Icon name="send" size={16} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 650 }} dir="ltr">{uname ? "@" + uname : "—"}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
            <span className="db-chip" style={!healthy ? { color: "var(--warn)" } : undefined}>
              <Icon name={healthy ? "check" : "alert"} size={12} /> {connected ? (healthy ? t.set.connected : t.set.webhookIssue) : t.set.notConnected}
            </span>
            {live && st && typeof st.pendingUpdates === "number" && st.pendingUpdates > 0 ? (
              <span className="db-chip"><Icon name="clock" size={12} /> {st.pendingUpdates}</span>
            ) : null}
          </div>
          {live && st && st.lastError ? <div className="db-muted" style={{ fontSize: 12, marginTop: 4 }} dir="ltr">{st.lastError}</div> : null}
        </div>
        {live && channel?.id ? (
          <button className="db-btn db-btn-ghost db-btn-sm" style={{ marginInlineStart: "auto" }} disabled={busy} onClick={disconnect}>{t.set.disconnect}</button>
        ) : (
          <button className="db-btn db-btn-ghost db-btn-sm" style={{ marginInlineStart: "auto" }} onClick={() => toast(t.toast.soon)}>{t.set.manage}</button>
        )}
      </div>
    </div>
  );
}
