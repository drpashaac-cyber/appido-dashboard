import { describe, it, expect } from "vitest";
import { tierOf, viewLocked, isVip, VIP_VIEWS } from "../lib/entitlements";

describe("lib/entitlements (plan gating)", () => {
  it("derives the tier from the active channel's Appido plan", () => {
    expect(tierOf(null)).toBe("free");                               // 14-day trial
    expect(tierOf({ paid: false, planName: "Start" })).toBe("free"); // unpaid trial
    expect(tierOf({ paid: true, planName: "Start" })).toBe("start"); // $79
    expect(tierOf({ paid: true, planName: "Pro" })).toBe("vip");     // $179
  });
  it("free and start share the SAME limited access (VIP sections locked)", () => {
    for (const v of VIP_VIEWS) {
      expect(viewLocked(v, "free")).toBe(true);
      expect(viewLocked(v, "start")).toBe(true);
      expect(viewLocked(v, "vip")).toBe(false);
    }
  });
  it("keeps non-VIP sections open to everyone", () => {
    for (const v of ["overview", "inbox", "crm", "offers", "transactions", "journeys", "settings", "actions"]) {
      expect(viewLocked(v, "free")).toBe(false);
      expect(viewLocked(v, "vip")).toBe(false);
    }
  });
  it("treats an unknown tier as unlocked (zero-regression default)", () => {
    expect(viewLocked("agent", undefined)).toBe(false);
    expect(isVip(undefined)).toBe(false);
  });
});
