import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sidebar } from "../components/layout";
import { LockedView } from "../components/access";
import { T } from "../i18n";

const sidebarProps = (tier?: string) => ({
  view: "audience", setView: () => {}, open: true, lang: "fa", setLang: () => {},
  langOpen: false, setLangOpen: () => {}, account: { owner: "Owner", email: "o@x.io" },
  channel: { name: "Ch", planName: "Pro", daysLeft: 21 }, onAccount: () => {},
  onPlan: () => {}, onLogout: () => {}, tier, onLocked: () => {}, t: T.fa,
});

describe("VIP gating UI", () => {
  it("renders the VIP sidebar identically to the default (no locks) — zero regression", () => {
    const vip = renderToStaticMarkup(<Sidebar {...sidebarProps("vip")} />);
    const def = renderToStaticMarkup(<Sidebar {...sidebarProps(undefined)} />);
    expect(vip).toBe(def);
    expect(vip).not.toContain("db-nav-lock");
  });
  it("locks VIP sections + marks them aria-disabled for free/start users", () => {
    const free = renderToStaticMarkup(<Sidebar {...sidebarProps("free")} />);
    expect(free).toContain("db-nav-lock");
    expect(free).toContain('aria-disabled="true"');
  });
  it("LockedView shows the upsell title + CTA", () => {
    const html = renderToStaticMarkup(<LockedView t={T.fa} onUpgrade={() => {}} />);
    expect(html).toContain(T.fa.locked.title);
    expect(html).toContain(T.fa.locked.upgrade);
  });
});
