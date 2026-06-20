// Plan entitlements for the manager's OWN Appido subscription (NOT the manager's
// products). Three tiers: free (14-day trial) and start ($79) share the SAME
// limited access; vip (Pro / $179) unlocks everything.
// PLAN_NAMES is fixed English ["Start","Pro"], so a plain string match is safe.

export type Tier = "free" | "start" | "vip";

// Sections gated to VIP — the AI-intelligence layer (per the Pro feature list):
// 24/7 AI seller + AI support (agent), smart marketer (audience),
// smart campaign manager (campaigns), smart/AI insights (insights).
export const VIP_VIEWS = new Set<string>(["agent", "campaigns", "audience", "insights"]);

export function tierOf(channel: any): Tier {
  if (!channel || !channel.paid) return "free";          // trial / unpaid
  const plan = String(channel.planName || "").toLowerCase();
  if (plan.includes("pro")) return "vip";                // $179
  return "start";                                        // $79 (or invite-code Start)
}

export const isVip = (tier: Tier | undefined) => tier === "vip";

// Locked only when the tier is KNOWN and non-vip. Unknown tier (undefined) renders
// unlocked → the default / VIP experience is byte-for-byte unchanged (zero regression).
export const viewLocked = (view: string, tier: Tier | undefined) =>
  !!tier && tier !== "vip" && VIP_VIEWS.has(view);
