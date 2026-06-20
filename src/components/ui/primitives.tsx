// Small presentational primitives: switch, heads, delta, kpi card.
import React from "react";
import { cx } from "../../lib/format";
import { Icon } from "./Icon";
import { Sparkline } from "./charts";

export function Delta({ v, goodDown = false }: { v: number; goodDown?: boolean }) {
  const up = v >= 0; const good = goodDown ? !up : up;
  return <span className={cx("db-delta", good ? "up" : "down")}><Icon name={up ? "arrowUp" : "arrowDown"} size={13} />{Math.abs(v)}%</span>;
}

export function Switch({ on, onClick, label }: { on: boolean; onClick?: () => void; label?: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={cx("db-sw", on && "on")} />;
}

export function PageHead({ title, sub, children }: any) {
  return <div className="db-pagehead"><div><div className="ttl">{title}</div><div className="sub">{sub}</div></div>{children ? <><span className="sp" />{children}</> : null}</div>;
}

export function CardHead({ title, icon, right }: any) {
  return <div className="db-ch"><span className="t">{icon ? <><Icon name={icon} size={16} /> </> : null}{title}</span>{right ? <><span className="sp" />{right}</> : null}</div>;
}

export const Kpi = React.memo(function Kpi({ label, k }: any) {
  return (
    <div className="db-kpi">
      <div className="k">{label}</div>
      <div className="v" style={k.tone === "mint" ? { color: "var(--good)" } : undefined}>{k.v}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 4 }}>
        <Delta v={k.delta} goodDown={k.tone === "down-good"} />
        <Sparkline data={k.spark} color={k.tone === "down-good" ? "#D4694F" : "var(--mint-bri)"} />
      </div>
    </div>
  );
});

export function SegRow({ tone, icon, title, sub, action, footer, align }: any) {
  return (
    <div className={cx("db-segrow", tone)} style={align ? { alignItems: "flex-start" } : undefined}>
      <span className="ic"><Icon name={icon} size={18} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        {sub ? <div className="db-muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{sub}</div> : null}
        {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
      </div>
      {action ? <span style={{ marginInlineStart: "auto", flexShrink: 0 }}>{action}</span> : null}
    </div>
  );
}

export function Field({ label, value, onChange, dir, type = "text", ph }: any) {
  return (
    <div className="db-field">
      <label>{label}</label>
      <input className="db-wiz-input" type={type} dir={dir} value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
