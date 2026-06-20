import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sparkline, Delta } from "../components/ui";

describe("ui primitives render", () => {
  it("Sparkline renders an svg chart", () => {
    const html = renderToStaticMarkup(<Sparkline data={[1, 2, 3, 4, 5]} />);
    expect(html).toContain("<svg");
    expect(html).toContain('width="90"');
  });
  it("Delta shows the value and an up/down direction", () => {
    const up = renderToStaticMarkup(<Delta v={12} />);
    expect(up).toContain("12%");
    expect(up).toContain("db-delta up");
  });
});
