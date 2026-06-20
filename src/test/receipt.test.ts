import { describe, it, expect } from "vitest";
import { makeReceipt, seedOf } from "../lib/receipt";

describe("lib/receipt", () => {
  it("is deterministic for a given seed + gateway", () => {
    expect(makeReceipt(424242, "USDT TRC20")).toEqual(makeReceipt(424242, "USDT TRC20"));
  });
  it("maps each gateway to the right network", () => {
    expect(makeReceipt(1, "USDT TRC20").net).toBe("TRC20");
    expect(makeReceipt(1, "USDT BEP20").net).toBe("BEP20");
    expect(makeReceipt(1, "TON").net).toBe("TON");
  });
  it("BEP20 hashes are 0x-prefixed; TRC20 are not", () => {
    expect(makeReceipt(1, "USDT BEP20").hash.startsWith("0x")).toBe(true);
    expect(makeReceipt(1, "USDT TRC20").hash.startsWith("0x")).toBe(false);
  });
  it("seedOf is stable and non-zero", () => {
    const args = { name: "Elif", amount: "$90", gw: "USDT TRC20" };
    expect(seedOf(args)).toBe(seedOf(args));
    expect(seedOf(args)).toBeGreaterThan(0);
  });
});
