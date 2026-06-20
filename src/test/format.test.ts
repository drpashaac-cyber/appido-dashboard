import { describe, it, expect } from "vitest";
import { cx, fmt, money, fmtDate, initials, maskCred, todayKey } from "../lib/format";

describe("lib/format", () => {
  it("cx joins only truthy class names", () => {
    expect(cx("a", false, "b", undefined, "c")).toBe("a b c");
  });
  it("fmt / money use Western digit grouping", () => {
    expect(fmt(1234567)).toBe("1,234,567");
    expect(money(1234)).toBe("$1,234");
  });
  it("fmtDate renders numeric YYYY/MM/DD", () => {
    expect(fmtDate(new Date(2026, 5, 17, 12), "en")).toBe("2026/06/17");
  });
  it("initials takes up to two leading letters, ignoring @handles", () => {
    expect(initials("Brand Owner")).toBe("BO");
    expect(initials("Elif")).toBe("E");
  });
  it("maskCred hides all but the last four", () => {
    expect(maskCred("ABCD1234WXYZ")).toBe("\u2022\u2022\u2022\u2022\u2022\u2022WXYZ");
    expect(maskCred("123")).toBe("\u2022\u2022\u2022\u2022");
    expect(maskCred("")).toBe("");
  });
  it("todayKey is an ISO date (YYYY-MM-DD)", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
