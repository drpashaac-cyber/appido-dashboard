# Appido — Dashboard (modular frontend)

Business-owner control panel for Appido. React + TypeScript, organized as a
modern, modular frontend. **This refactor changes only structure, types, and
tooling — business logic, product behaviour, copy, and visual design are
byte-for-byte unchanged** (verified; see “Zero-change guarantee” below).

## Stack
- **React 19** + **TypeScript** (strict)
- **Vite 6** (dev server + build)
- **Vitest** + Testing Library (unit/smoke tests)
- **ESLint 9** (flat config, typescript-eslint, react-hooks) + **Prettier**

## Quick start (for the deploy team)
Requires **Node ≥ 20** (see `.nvmrc`) and npm.
```bash
npm install        # install dependencies
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build → ./dist  (Vite + esbuild)
npm run preview    # serve the built ./dist locally to sanity-check
npm run test       # unit / component tests (Vitest)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (quality gate — see "Type debt" note)
npm run format     # Prettier
```

### Deploying
This is a **static single-page app** (no backend, no server-side routing — all
navigation is in-app state). `npm run build` emits a self-contained `./dist`
(an `index.html` + hashed JS/CSS). Deploy `./dist` to any static host:
- **Vercel / Netlify / Cloudflare Pages:** build command `npm run build`, output dir `dist`.
- **Nginx / S3 + CloudFront / any web server:** upload the contents of `dist/`.
No SPA-fallback rewrite rule is required (the app serves from a single `index.html`).

> **Build vs. type-check.** `npm run build` uses Vite/esbuild, which transpiles
> TypeScript (types stripped) and always produces a deployable bundle. Type
> checking is intentionally a **separate** gate (`npm run typecheck`); see the
> "Type debt" note in the roadmap — strict `tsc` currently flags `any`/unused
> items to clean up incrementally, and this does **not** block the build or deploy.

## Architecture
```
appido-dashboard/
├─ index.html
├─ vite.config.ts        # build + alias (@ -> src) + vitest
├─ tsconfig.json         # strict TS, bundler resolution, @ path alias
├─ eslint.config.js      # flat config
└─ src/
   ├─ main.tsx           # entry: mounts <AppidoDashboard/>
   ├─ AppidoDashboard.tsx# thin app shell (258 lines): state + routing, composes domains
   ├─ lib/               # pure / infrastructure helpers (no UI)
   │  ├─ format.ts       # cx, fmt, money, dates, initials, heatColor, maskCred, buzz…
   │  ├─ storage.ts      # store  (namespaced localStorage, guarded)
   │  ├─ receipt.ts      # on-chain receipt data (TRC20/BEP20/TON), deterministic
   │  ├─ toast.ts        # toast singleton (shell registers handler via setToastFn)
   │  ├─ score.ts        # lead scoring (leadScoreOf, scoreBand)
   │  ├─ catalog.ts      # product-catalogue lookup (catDeliver)
   │  ├─ device.ts       # device fingerprint for session display
   │  └─ telemetry.ts    # buffered analytics; public = track/identify/setTelemetryConsent
   ├─ types/             # domain types (Lang, Theme, Channel, Payment, Txn, Receipt, NotifPrefs…)
   ├─ styles/
   │  └─ dashboard.css   # the full stylesheet (moved out of the JS bundle)
   ├─ i18n/              # en / fa / ar / tr / ru translation graph (extracted ✓)
   │  └─ index.ts        # builds the merged T table at load; native, gap-free
   ├─ data/              # seed/config data (extracted ✓)
   │  ├─ navigation.ts   # NAV, sidebar groups
   │  ├─ seed.ts         # demo customers, products, transactions, audience…
   │  ├─ content.ts      # market voice, wins, AI closes, playbooks, feed
   │  ├─ config.ts       # endpoints, flow/payment maps, totals
   │  └─ index.ts        # barrel
   ├─ components/        # 17 feature domains + ui, each a folder + barrel (extracted ✓)
   │  ├─ ui/             # primitives: Icon, charts, Modal, Switch, PageHead, Kpi, SegRow, Field…
   │  ├─ layout/         # Sidebar, Topbar, BottomNav, ChannelSwitcher, LangSwitch, NotificationSettings
   │  ├─ overview/       # OverviewView, NeedsYou, AutomationLoop, ActivityFeed, GoalCard, Celebrate/FirstWin, OperatorMode
   │  ├─ inbox/          # InboxView, ActionInboxView
   │  ├─ crm/            # CrmView, Drawer, ImportWizard, TagAddModal, GrantModal
   │  ├─ audience/       # AudienceView, MarketVoice
   │  ├─ campaigns/      # CampaignsView, CampaignComposer
   │  ├─ journeys/       # JourneysView, Flow* builder, BlockPicker/StepEdit, PlaybookGallery
   │  ├─ products/       # ProductsView, ProductCard, ProductEditorModal
   │  ├─ transactions/   # TransactionsView, OnChainReceipt
   │  ├─ billing/        # ChannelBilling, OffersView, OfferSendModal
   │  ├─ agent/          # AgentView, AIExplainModal, SalesAdvisor
   │  ├─ insights/       # InsightsView
   │  ├─ auth/           # AuthScreen, AccountModal, TwoFASetup, BusinessHub, ChannelWizard…
   │  ├─ share/          # ShareCard, WallOfWins, ReferralModal, FauxQR
   │  ├─ settings/       # SettingsView, PaymentGateways, PrivacyPrefsModal, ConsentBanner
   │  ├─ mobile/         # SwipeCard, PullToRefresh, CoachTour
   │  └─ misc/           # DailyBrief
   └─ hooks/             # (Phase 5) extracted stateful hooks
```

### Principles applied
- **Separation of concerns** — pure helpers, styles, types, data, and UI live in
  distinct layers instead of one 6.3k-line file.
- **Pure core** — `lib/*` has no React, no globals, no side effects; trivially
  unit-testable and SSR-safe.
- **Styling out of JS** — the stylesheet is a real `.css` file (Vite-processed),
  not a runtime-injected template string.
- **Typed boundaries** — `types/` defines the domain model; props/state get typed
  progressively as components are extracted.
- **Locked design system** — the 5-colour brand palette and all rules are
  preserved verbatim in `styles/dashboard.css`.

## Zero-change guarantee (how it’s verified)
Every refactor step is validated by rendering the **modular** build and the
**original single file** to static HTML and diffing them byte-for-byte (ignoring
only the `<style>` block, which moved to `dashboard.css`). Phase 1 result:
identical output for the app shell, the i18n object, and every component that
consumes an extracted helper (`OnChainReceipt`, `DailyBrief`, `TransactionsView`
across en/fa/ar). The original single file is kept as the reference baseline.

## Roadmap (incremental, each phase re-proven identical)
- **Phase 1 ✅ (done)** — project scaffold + tooling; extract `lib/` (format,
  storage, receipt), `types/`, and the stylesheet. App file 6 293 → 4 631 lines.
- **Phase 2 ✅ (done)** — extract the `i18n/` translation graph (the full `T`
  table) into its own module. App file 4 631 → 3 516 lines. Verified: the entire
  merged translation table is byte-identical and all SSR output is unchanged.
- **Phase 2b ✅ (done)** — extract `data/` (seed + config constants, 46 in use)
  into domain modules behind a barrel. App file 3 516 → 3 245 lines. Verified:
  9 data-consuming views (overview, crm, audience, campaigns, journeys, products,
  insights, agent, transactions) render byte-identical, plus the Phase-1/2 suite.
- **Phase 3 ✅ (done)** — extract UI **primitives** (`Icon`, charts, `Modal`,
  `Switch`, `PageHead`, `CardHead`, `Delta`, `Kpi`) into `components/ui/` behind a
  barrel. App file 3 245 → 3 083 lines. Verified byte-identical (core suite + the
  9 data-consuming views, all of which render these primitives).
- **Phase 4 ✅ (done)** — extract **all** feature views into 17 domain folders
  under `components/<domain>/` (+ `ui/`), each behind a barrel. First completed
  the helper layer: pure helpers (`initials`, `heatColor`, `relWhen`, `flowUid`,
  `maskCred`, `todayKey`, `buzz`) and infrastructure (`toast`, `score`, `catalog`,
  `device`, `telemetry`) moved to `lib/`; shared primitives (`SegRow`, `Field`)
  to `ui/`; `LANGS`/`RTL` to `i18n/`. A reusable AST extractor runs a *blocker
  check* before each move — it refuses to extract a domain that still references a
  monolith helper or an out-of-domain component, so no extraction can silently
  break; it also auto-resolves cross-domain imports and `...spread` references.
  **App shell 6 293 → 258 lines (~96% smaller).** Verified byte-identical: the
  core suite, the 9 data-views, and **all 63 extracted components** rendered from
  their domain modules vs the original (`Math.random` seeded so the only
  non-deterministic component, `TwoFASetup`'s QR secret, also matches). The
  original single file is retained as the reference baseline.
- **Phase 5 ◑ (perf + clean-code pass — done where verifiable here)**
  - **Smoothness:** the root cause of jank was a `scrolling` state in the shell
    that flipped on every scroll event, re-rendering the whole tree. Extracted it
    into a self-contained `AdvisorFab` component, so scrolling now re-renders only
    that one button. Also stabilised the toast handler (`useCallback` + moved
    `setToastFn` out of the render body into an effect) and `goToChat`.
  - **Memoisation:** wrapped the heavy SVG primitives (`Sparkline`, `AreaChart`,
    `Donut`, `Kpi`) in `React.memo` so a parent re-render with unchanged data
    skips re-painting the charts.
  - **Clean code:** removed a dead module global (`_impId`) and, in doing so,
    found + fixed a latent bug — `ImportWizard` referenced that shell global after
    Phase 4 split them apart (it would have thrown on customer import); the counter
    now lives inside `ImportWizard`, its only user.
  - **Types + tests:** added `export type Translation` (the canonical `t` shape) as
    the foundation for replacing `any`, plus Vitest suites for `lib/format`,
    `lib/receipt`, and the UI primitives.
  - All of the above re-proven byte-identical (core + 9 views + all 63 components).
  - **Honestly still open (needs `npm install` + the dev toolchain, unavailable in
    this build sandbox):** ~190 `: any` remain — finishing them safely needs
    `tsc --noEmit` to catch mistakes, which needs `@types/react` from npm; blind
    tightening could introduce build-time type errors. Recommended next:
    `npm install && npx tsc --noEmit`, then replace `any` incrementally; run
    `npm run lint` and `npm test`; and profile with React DevTools before adding
    deeper memoisation (view switching is infrequent, so the scroll fix already
    removes the visible jank — avoid premature optimisation). Minor a11y: ~40
    clickable `<div>`s could become `<button>` for full keyboard support.

No business/product logic is altered in **the refactor phases** (1–5).

## Feature: plan entitlements (VIP gating)
Three user tiers, derived from the active channel's **Appido** subscription (this is
Appido's own plan that the manager pays Appido — distinct from the manager's own
products): **free** (14-day trial) and **start** ($79) share the *same* limited
access; **vip** (Pro, $179) unlocks everything. Logic lives in `src/lib/entitlements.ts`
(`tierOf`, `viewLocked`, `VIP_VIEWS`).

Mapped from the two pricing cards, the VIP-only sections are the AI-intelligence layer
— **AI Agent** (24/7 AI seller + smart support), **Campaigns** (smart campaign
manager), **Audience** (smart marketer) and **AI Insights** (smart CRM/analytics).
Everything on the Start card (bot/journeys, payments/transactions, product delivery/
offers, channel access/settings, inbox + basic CRM, overview, Today) stays open to all.

For free/start users those sidebar items render **disabled** with a lock badge and an
`aria-disabled` flag; clicking one shows a localised toast (“this section is on the VIP
plan”) instead of navigating, and a `LockedView` upsell panel (`src/components/access/`)
guards the route itself. Strings are in all five languages (Western digits throughout).

**Zero regression by design:** gating only activates when the tier is *known and
non-VIP*. An unknown tier or a VIP user renders the sidebar **byte-for-byte identical to
before** — verified (VIP sidebar === default sidebar; all 63 components still identical;
pre-existing translations unchanged after stripping the additive `locked` keys). Covered
by `src/test/entitlements.test.ts` and `src/test/gating.test.tsx`.
