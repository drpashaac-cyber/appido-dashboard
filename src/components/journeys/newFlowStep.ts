// newFlowStep
import { flowUid } from "../../lib/format";
import { FLOW_REGION_METHODS } from "../../data";

export function newFlowStep(type: string, F: any, region: string): any {
  const s: any = { id: flowUid(), type };
  if (type === "welcome") s.text = F.ty.welcome[2];
  else if (type === "askName") s.text = F.ty.askName[2];
  else if (type === "askPhone") { s.text = F.ty.askPhone[2]; s.style = "contact"; }
  else if (type === "askChoice") { s.text = F.ty.askChoice[2]; s.style = "reply"; s.options = [...F.genderOpts]; }
  else if (type === "message") { s.text = F.ty.message[2]; s.style = "text"; s.options = []; }
  else if (type === "payment") { s.text = F.ty.payment[2]; s.style = "inline"; s.methods = [...(FLOW_REGION_METHODS[region] || FLOW_REGION_METHODS.global)]; s.autoConnect = true; s.autoConfirm = true; s.autoDeliver = true; s.deliverType = "channel"; s.deliverValue = ""; }
  else if (type === "deliver") { s.deliverType = "channel"; s.deliverValue = ""; }
  else if (type === "condition") { s.metric = "intent"; s.op = "gte"; s.value = "70"; }
  else if (type === "delay") { s.amount = "1"; s.unit = "hour"; }
  return s;
}
