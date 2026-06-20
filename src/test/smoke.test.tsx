import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import AppidoDashboard from "@/AppidoDashboard";
import { fmt, money, fmtDate } from "@/lib/format";
import { makeReceipt, seedOf } from "@/lib/receipt";
import { NAV, KPIS, TXNS } from "@/data";
import { Icon } from "@/components/ui";

// Foundation smoke tests — guard the extracted pure layer + a render.
describe("lib/format", () => {
  it("formats numbers in Western digits", () => {
    expect(money(32800)).toBe("$32,800");
    expect(fmt(127)).toBe("127");
  });
  it("renders locale calendars with Western digits", () => {
    const d = new Date(Date.UTC(2026, 5, 16));
    expect(fmtDate(d, "en")).toBe("2026/06/16");
    expect(fmtDate(d, "fa")).toMatch(/^14\d\d\/\d{2}\/\d{2}$/); // Jalali
    expect(fmtDate(d, "ar")).toMatch(/^14\d\d\/\d{2}\/\d{2}$/); // Hijri
  });
});

describe("lib/receipt", () => {
  it("builds a deterministic TRC20 receipt", () => {
    const txn = { name: "Elif A.", amount: "$90", gw: "USDT TRC20" };
    const a = makeReceipt(seedOf(txn), txn.gw);
    const b = makeReceipt(seedOf(txn), txn.gw);
    expect(a.hash).toBe(b.hash);
    expect(a.explorer).toBe("Tronscan");
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("data layer", () => {
  it("exposes seed data", () => {
    expect(Array.isArray(NAV)).toBe(true);
    expect(NAV.length).toBeGreaterThan(0);
    expect(KPIS.length).toBeGreaterThan(0);
    expect(TXNS.length).toBeGreaterThan(0);
  });
});

describe("ui primitives", () => {
  it("Icon renders an svg", () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });
});

describe("AppidoDashboard", () => {
  it("mounts without crashing", () => {
    const { container } = render(<AppidoDashboard />);
    expect(container.firstChild).toBeTruthy();
  });
});
