// starterFlow
import { newFlowStep } from "./newFlowStep";

export const starterFlow = (F: any, region: string) => ["welcome", "askName", "askPhone", "askChoice", "aiEval", "condition", "payment"].map((ty) => newFlowStep(ty, F, region));
