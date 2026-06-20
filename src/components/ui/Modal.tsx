// Modal + confirm-dialog primitives.
import React from "react";
import { cx } from "../../lib/format";
import { Icon } from "./Icon";

export function Modal({ title, onClose, children }: any) {
  return (
    <div className="db-modal-bg" onClick={onClose}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}><div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div><span style={{ marginInlineStart: "auto" }} /><button className="db-iconbtn" onClick={onClose} aria-label="Close" style={{ width: 32, height: 32 }}><Icon name="x" size={16} /></button></div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ title, body, confirmLabel, cancelLabel, danger, onConfirm, onClose }: any) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ margin: "0 0 22px", fontSize: 14, lineHeight: 1.75, color: "var(--text-2)" }}>{body}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="db-btn db-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>{cancelLabel}</button>
        <button className={cx("db-btn", danger ? "db-btn-danger" : "db-btn-mint")} style={{ flex: 1, justifyContent: "center" }} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
