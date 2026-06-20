// FlowSummary
import React from "react";
import { Icon } from "../ui";

export function FlowSummary({ step: s, t }: any) {
  const F = t.flow;
  if (s.type === "condition") return (<><div className="st" dir="auto">{F.cm[s.metric || "intent"]} {F.co[s.op || "gte"]} {s.value || "70"}{s.metric === "intent" || !s.metric ? "%" : ""}</div><div className="db-flowbranch"><span className="db-tag warm">{F.yes}</span><span className="db-tag cold">{F.no}</span></div></>);
  if (s.type === "aiEval") return <div className="st">{F.ty.aiEval[1]}</div>;
  if (s.type === "delay") return <div className="st">{s.amount || "1"} {F.un[s.unit || "hour"]}</div>;
  if (s.type === "deliver") return <div className="st"><Icon name="gift" size={12} /> {F.dv[s.deliverType || "channel"]}{s.deliverValue ? ` · ${s.deliverValue}` : ""}</div>;
  if (s.type === "payment") return (<>
    <div className="st">{s.text || F.ty.payment[2]}</div>
    <div className="db-chips">{(s.methods || []).map((m: string) => <span key={m} className="db-chip">{F.mNames[m] || m}</span>)}</div>
    <div className="db-flowflags">{s.autoConnect ? <span className="fl"><Icon name="check" size={11} /> {F.autoConn}</span> : null}{s.autoConfirm ? <span className="fl"><Icon name="check" size={11} /> {F.autoConf}</span> : null}{s.autoDeliver ? <span className="fl"><Icon name="check" size={11} /> {F.autoDeliver}</span> : null}</div>
    {s.autoDeliver ? <div className="st">→ {F.dv[s.deliverType || "channel"]}{s.deliverValue ? ` · ${s.deliverValue}` : ""}</div> : null}
  </>);
  if (s.type === "askChoice") return (<>
    <div className="st">{s.text || F.ty.askChoice[2]}</div>
    <div className="db-chips"><span className="db-chip alt"><Icon name={s.style === "inline" ? "spark" : "list"} size={11} /> {F.st[s.style || "reply"]}</span>{(s.options || []).map((o: string, i: number) => <span key={i} className="db-chip">{o}</span>)}</div>
  </>);
  if (s.type === "askPhone") return (<><div className="st">{s.text || F.ty.askPhone[2]}</div><div className="db-chips"><span className="db-chip alt"><Icon name="phone" size={11} /> {F.st.contact}</span></div></>);
  const txt = s.text || (s.type === "welcome" ? F.ty.welcome[2] : s.type === "askName" ? F.ty.askName[2] : F.ty.message[2]);
  return (<>
    <div className="st">{txt}</div>
    {s.type === "message" && s.style && s.style !== "text" && (s.options || []).length ? <div className="db-chips"><span className="db-chip alt">{F.st[s.style]}</span>{(s.options || []).map((o: string, i: number) => <span key={i} className="db-chip">{o}</span>)}</div> : null}
  </>);
}
