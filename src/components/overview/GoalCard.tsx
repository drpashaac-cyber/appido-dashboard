// GoalCard
import React, { useState } from "react";
import { cx, fmt, money } from "../../lib/format";
import { Icon, CardHead } from "../ui";
import { CUR_REV, CUR_SALES } from "../../data";

export function GoalCard({ t, goal: goalProp, setGoal, onCelebrate }: any) {
  const g = t.goal;
  const goal = goalProp || { type: "revenue", target: 50000 };
  const sg = setGoal || (() => {});
  const oc = onCelebrate || (() => {});
  const cur = goal.type === "sales" ? CUR_SALES : CUR_REV;
  const pct = Math.min(100, Math.round((cur / goal.target) * 100));
  const reached = cur >= goal.target;
  const remain = Math.max(0, goal.target - cur);
  const [edit, setEdit] = useState(false);
  const [type, setType] = useState(goal.type);
  const [amt, setAmt] = useState(String(goal.target));
  const show = (n: number) => goal.type === "sales" ? fmt(n) : money(n);
  const save = () => {
    const tg = Math.max(1, parseInt((amt || "").replace(/[^0-9]/g, ""), 10) || goal.target);
    sg({ type, target: tg }); setEdit(false);
    const cv = type === "sales" ? CUR_SALES : CUR_REV;
    if (cv >= tg) oc({ kind: type, value: cv });
  };
  return (
    <div className="db-card db-goal" style={{ marginBottom: 24 }}>
      <CardHead title={g.title} icon="target" right={!edit ? <button className="db-btn db-btn-ghost db-btn-sm" onClick={() => { setType(goal.type); setAmt(String(goal.target)); setEdit(true); }}><Icon name="settings" size={13} /> {g.edit}</button> : null} />
      <div className="db-pad">
        {edit ? (
          <div className="db-goal-edit">
            <div className="db-seg" style={{ marginBottom: 12 }}><button type="button" className={cx(type === "revenue" && "on")} onClick={() => setType("revenue")}>{g.revenue}</button><button type="button" className={cx(type === "sales" && "on")} onClick={() => setType("sales")}>{g.sales}</button></div>
            <label className="db-goal-lbl">{type === "sales" ? g.salesTarget : g.revTarget}</label>
            <input className="db-wiz-input" dir="ltr" inputMode="numeric" value={amt} onChange={(e) => setAmt(e.target.value.replace(/[^0-9]/g, ""))} placeholder={type === "sales" ? "150" : "50000"} />
            <div className="db-goal-eact"><button className="db-btn db-btn-mint db-btn-sm" onClick={save}>{g.set}</button><button className="db-btn db-btn-ghost db-btn-sm" onClick={() => setEdit(false)}>{g.cancel}</button></div>
          </div>
        ) : (
          <div className="db-goal-body">
            <div className={cx("db-goal-ring", reached && "done")}>
              <svg viewBox="0 0 100 100"><circle className="bg" cx="50" cy="50" r="42" fill="none" /><circle className="fg" cx="50" cy="50" r="42" fill="none" style={{ strokeDasharray: 263.9, strokeDashoffset: 263.9 * (1 - pct / 100) }} /></svg>
              <div className="db-goal-rc"><span className="pct">{pct}%</span><span className="lab">{reached ? g.reached : g.toGoal}</span></div>
            </div>
            <div className="db-goal-info">
              <div className="db-goal-nums"><b>{show(cur)}</b><span> / {show(goal.target)}</span></div>
              <div className="db-goal-sub">{reached ? g.reachedSub : g.remain.replace("{v}", show(remain))}</div>
              <div className="db-goal-bar"><i style={{ width: pct + "%" }} /></div>
              {reached ? <button className="db-btn db-btn-mint db-btn-sm db-goal-cel" onClick={() => oc({ kind: goal.type, value: cur })}><Icon name="zap" size={13} /> {g.celebrate}</button> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
