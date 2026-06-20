// PwField
import React, { useState } from "react";
import { cx } from "../../lib/format";
import { Icon } from "../ui";

export function PwField({ label, value, onChange, ph, hint, error }: any) {
  const [show, setShow] = useState(false);
  // English letters & numbers only — block other scripts (e.g. Persian/Arabic) and symbols at input time
  const sanitize = (v: string) => v.replace(/[^A-Za-z0-9]/g, "");
  return (
    <div className="db-field">
      {label ? <label>{label}</label> : null}
      <div className="db-pwwrap" dir="ltr">
        <input className={cx("db-wiz-input db-pwinput", error && "err")} type={show ? "text" : "password"} value={value} placeholder={ph} inputMode="latin" autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={(e) => onChange(sanitize(e.target.value))} />
        <button type="button" className="db-pweye" aria-label="Show password" onClick={() => setShow((s) => !s)}><Icon name={show ? "eyeoff" : "eye"} size={17} /></button>
      </div>
      {error ? <div className="db-pwerr"><Icon name="x" size={12} /> {error}</div> : (hint ? <div className="db-pwhint">{hint}</div> : null)}
    </div>
  );
}
