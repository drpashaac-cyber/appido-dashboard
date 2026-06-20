// flowMeta
import { FLOW_STEP_META } from "../../data";

export const flowMeta = (type: string, F: any) => ({ ...(FLOW_STEP_META[type] || { icon: "send", kind: "action" }), name: F.ty[type][0] });
