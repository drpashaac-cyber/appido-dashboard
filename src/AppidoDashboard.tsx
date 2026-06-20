'use client';
// AppidoDashboard.tsx — APPIDO business owner control panel (React, not indexed / no SEO).
// Single-file component. Default export. No required props. Light/Dark. Brand palette locked.
// Modeled after AmoCRM / HubSpot / Intercom / Linear, applied to Telegram-native revenue ops.

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";

import { cx, fmt, money, fmtDateTime, detectLang, initials, heatColor, relWhen, flowUid, maskCred, todayKey, buzz } from "./lib/format";
import { store } from "./lib/storage";
import { agoToDate, seedOf, makeReceipt } from "./lib/receipt";
import "./styles/dashboard.css";
import { DailyBrief, AdvisorFab } from "./components/misc";
import { LockedView } from "./components/access";
import { SettingsView, ConsentBanner } from "./components/settings";
import { AuthScreen, AccountModal, TwoFASetup, BusinessHub, ChannelWizard, ChannelEmpty } from "./components/auth";
import { Sidebar, Topbar, BottomNav, LangSwitch, NotificationSettings } from "./components/layout";
import { OverviewView, CelebrateModal, FirstWinModal, OperatorMode } from "./components/overview";
import { SwipeCard, PullToRefresh, CoachTour } from "./components/mobile";
import { ShareCard, WallOfWins, ReferralModal, FauxQR } from "./components/share";
import { JourneysView, PlaybookGallery } from "./components/journeys";
import { CrmView } from "./components/crm";
import { AgentView, AIExplainModal, SalesAdvisor } from "./components/agent";
import { ChannelBilling, OfferSendModal } from "./components/billing";
import { InboxView, ActionInboxView } from "./components/inbox";
import { ProductsView } from "./components/products";
import { InsightsView } from "./components/insights";
import { CampaignsView, CampaignComposer } from "./components/campaigns";
import { AudienceView, MarketVoice } from "./components/audience";
import { OnChainReceipt, TransactionsView } from "./components/transactions";
import { toast, setToastFn } from "./lib/toast";
import { leadScoreOf, scoreBand } from "./lib/score";
import { catDeliver } from "./lib/catalog";
import { deviceInfo } from "./lib/device";
import { track, identify, setTelemetryConsent } from "./lib/telemetry";
import { tierOf, viewLocked } from "./lib/entitlements";
import { api, apiEnabled, accountFromMe } from "./lib/api";
import { channelFromApi } from "./lib/dataset";
import { Icon, Sparkline, AreaChart, Donut, Modal, ConfirmModal, Switch, PageHead, CardHead, Kpi, SegRow, Field } from "./components/ui";
import { ACTION_META, ACT_NAV_TO, NAV, SIDE_GROUPS, SIDE_DESKONLY, SIDE_ID2G, KPIS, REVENUE, FUNNEL, FUNNEL_PREFILL, OTHER_SESSIONS, CONVOS, THREAD, CHANNELS_INIT, STAGES, SEGMENTS, CATS, PRODUCTS, OFFERS, TXNS, GENDER, AGES, GEO, HOURS, DAYS, HEAT, CAMPAIGNS, FILES, INSIGHTS, TEAM, LOOP_ICONS, LOOP_VIEWS, BENCH, FEED_PENDING, FEED_DONE, FEED_POOL, PLAYBOOKS, MARKET_VOICE, WINS, AI_CLOSES, FLOW_REGION_METHODS, FLOW_STEP_META, PAY_METHODS, CUR_REV, CUR_SALES } from "./data";
import { T, GATEWAYS, PLAN_NAMES, PLAN_PRICES, PLAN_DAYS, GATEWAYS_MORE, BRIEF_STATS, NOTIF_META, AI_MODELS, LANGS, RTL } from "./i18n";


/* ---------------- i18n: EN / FA / TR / RU (+RTL for FA) ---------------- */

/* ---------------- icon set (inline, stroke = currentColor) ---------------- */

/* ---------------- mock data (Telegram / CIS-MENA flavored) ---------------- */



/* ---------------- prospect telemetry (Appido growth/sales instrumentation) ----------------
   Every dashboard user is a potential Appido tenant. We capture an anonymous prospect profile
   + a behavioral event log (geo via tz/device, locale, referrer/UTM, email once known) and would
   stream it to a server-side collector (sendBeacon/batch -> ClickHouse/BigQuery or PostHog/Segment)
   for future sales follow-up. PROD must pair this with a privacy disclosure + consent.            */





// activity heatmap: 7 days x 6 time buckets (intensity 0..4)






/* ---------------- styles (one consolidated block) ---------------- */


/* ---------------- chart + ui primitives ---------------- */



/* ---------------- shared building blocks (DRY) ---------------- */

/* ---------------- sidebar + topbar ---------------- */

/* ---------------- views ---------------- */















/* ---------------- adopted-idea components ---------------- */








/* ---------------- channel-management layer ---------------- */







/* ---------------- auth + account management ---------------- */



/* ---------------- app shell ---------------- */




export default function AppidoDashboard() {
  const [theme, setTheme] = useState<"light" | "dark">(() => store.get("theme", "light"));
  const [view, setView] = useState("overview");
  const [sideOpen, setSideOpen] = useState(false);
  const [lang, setLang] = useState(() => store.get("lang", detectLang()));
  const [langOpen, setLangOpen] = useState(false);
  useEffect(() => { store.set("theme", theme); }, [theme]);
  useEffect(() => { store.set("lang", lang); }, [lang]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [campaignPrefill, setCampaignPrefill] = useState<number | null>(null);
  const [twoFA, setTwoFA] = useState(false);
  const [otherSessions, setOtherSessions] = useState(OTHER_SESSIONS);
  const [chatTarget, setChatTarget] = useState<number | null>(null);
  const [channels, setChannels] = useState<any[]>(CHANNELS_INIT);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [billingId, setBillingId] = useState<string | null>(null);
  const [wizard, setWizard] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [account, setAccount] = useState({ brand: "Brand.io", owner: "Brand Owner", email: "owner@brand.io", phone: "", emailVerified: true, phoneVerified: false, password: "", prefs: null });
  const [accountOpen, setAccountOpen] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [imported, setImported] = useState<any[]>([]);
  const [importReq, setImportReq] = useState(false);
  const [toursSeen, setToursSeen] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState({ decided: false, analytics: false, marketing: false });
  const [tourView, setTourView] = useState<string | null>(null);
  const [autopilot, setAutopilot] = useState(true);
  const [autonomy, setAutonomy] = useState<"draft" | "approve" | "auto">("auto");
  const [shareOpen, setShareOpen] = useState(false);
  const [wallOpen, setWallOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [pbOpen, setPbOpen] = useState(false);
  const [goal, setGoal] = useState<{ type: string; target: number }>({ type: "revenue", target: 50000 });
  const [celebrate, setCelebrate] = useState<any>(null);
  const [opMode, setOpMode] = useState(false);
  const [firstWin, setFirstWin] = useState<any>(null);
  const [xaiOpen, setXaiOpen] = useState(false);
  const toastTimer = useRef<any>(null);
  const show = useCallback((m: string) => { setToastMsg(m); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMsg(null), 2200); }, []);
  useEffect(() => { setToastFn(show); }, [show]);
  const t = T[lang];
  const dir = RTL.includes(lang) ? "rtl" : "ltr";
  const goToChat = useCallback((id: number) => { setChatTarget(id); setView("inbox"); setSideOpen(false); }, []);
  const connectChannel = (nc: any) => { const firstTime = channels.length === 0; if (nc && nc.live && apiEnabled()) { loadChannels(); setActiveId(nc.id); setWizard(false); setView("overview"); track("channel_connected", { plan: nc.planName, paid: true }); show(t.toast.created); return; } setChannels((p) => [...p, nc]); setActiveId(nc.id); setWizard(false); setView("overview"); track("channel_connected", { plan: nc.planName, paid: !!nc.paid }); if (firstTime) { setFirstWin({ leads: nc.members || 820 }); } else { show(t.toast.created); } };
  const payChannel = (id: string, planIdx: number, gw: string) => {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, paid: true, planName: PLAN_NAMES[planIdx] || c.planName, daysLeft: (c.daysLeft || 0) + PLAN_DAYS[planIdx], daysTotal: PLAN_DAYS[planIdx], payments: [{ d: t.common.today, amt: PLAN_PRICES[planIdx], gw, st: "ok" }, ...(c.payments || [])] } : c));
    show(t.bill.paidOk);
  };
  const logout = () => { if (apiEnabled()) { api.auth.logout().catch(() => {}); } track("logout"); setAuthed(false); setAccountOpen(false); setActiveId(null); setBillingId(null); setWizard(false); };
  // Load the tenant's real channels (+ subscription for the billing card) in live mode.
  const loadChannels = useCallback(() => {
    Promise.all([api.channels(), api.data.summary()]).then(([chs, summary]) => {
      const sub = summary?.subscription ?? null;
      const mapped = (chs ?? []).map((c) => channelFromApi(c, sub));
      setChannels(mapped);
      setActiveId((cur: any) => (mapped.length === 1 ? mapped[0].id : cur));
    }).catch(() => {});
  }, []);
  // Restore an existing backend session on load (live mode only); otherwise stay on the sign-in screen.
  useEffect(() => {
    if (!apiEnabled()) return;
    let alive = true;
    api.me().then((me) => {
      if (!alive || !me) return;
      setAccount((acc: any) => accountFromMe(me, acc));
      setAuthed(true);
      loadChannels();
    }).catch(() => {});
    return () => { alive = false; };
  }, [loadChannels]);
  useEffect(() => { if (authed) track("page_view", { view }); }, [view, authed]);
  useEffect(() => { if (!authed) return; setAccount((a: any) => (a.prefs && a.prefs.lang === lang && a.prefs.theme === theme) ? a : { ...a, prefs: { lang, theme } }); }, [lang, theme, authed]);
  useEffect(() => { if (authed && activeChannel && t.tours && t.tours[view] && !toursSeen[view]) setTourView(view); }, [view, activeId, authed]);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [advisorSeen, setAdvisorSeen] = useState(false);
  const [advisorProfile, setAdvisorProfile] = useState<any>(null);
  useEffect(() => {
    if (!authed) return;
    const np: any = store.get("notifPrefs", {}); const briefOn = np.brief !== false;
    const showBrief = briefOn && channels.length > 0 && !firstWin && store.get("briefSeen", "") !== todayKey();
    if (showBrief) {
      const bid = setTimeout(() => setBriefOpen(true), 700);
      return () => clearTimeout(bid);
    }
    const id = setTimeout(() => { setAdvisorOpen(true); try { track("advisor_opened"); } catch (e) {} }, 10000);
    return () => clearTimeout(id);
  }, [authed, channels.length, firstWin]);
  const activeChannel = channels.find((c) => c.id === activeId);
  const tier = useMemo(() => tierOf(activeChannel), [activeChannel]);
  const onLocked = useCallback(() => show(t.locked.vipOnly), [show, t]);
  // Central navigation guard: every user-facing setView/onNav routes through this,
  // so a non-VIP user is shown the upsell toast instead of reaching any VIP section.
  const navTo = useCallback((v: string) => { if (viewLocked(v, tier)) { onLocked(); return; } setView(v); setSideOpen(false); }, [tier, onLocked]);

  const setupProduct = useMemo(() => {
    const pf: any = advisorProfile;
    if (!pf || !pf.sell) return null;
    const REPS = [20, 65, 250, 800];
    const price = typeof pf.priceIdx === "number" && REPS[pf.priceIdx] ? "$" + REPS[pf.priceIdx] : "";
    return { id: "setup-prod", name: pf.sell, cat: "", active: true, fromSetup: true, desc: t.adv.setupDesc, doc: "", plans: price ? [{ id: "setup-pl", period: "monthly", price }] : [], discounts: [] };
  }, [advisorProfile, t]);
  const views: Record<string, React.ReactNode> = {
    overview: <OverviewView t={t} setView={navTo} openComposer={() => { if (viewLocked("campaigns", tier)) { onLocked(); return; } setComposer(true); }} goToChat={goToChat} autopilot={autopilot} setAutopilot={setAutopilot} autonomy={autonomy} setAutonomy={setAutonomy} onShare={() => setShareOpen(true)} onPlaybooks={() => setPbOpen(true)} isPreview={channels.length === 0} onAddChannel={() => setWizard(true)} onExplain={() => setXaiOpen(true)} goal={goal} setGoal={setGoal} onCelebrate={(p: any) => setCelebrate(p)} onFunnelAction={(idx: number) => { if (viewLocked("campaigns", tier)) { onLocked(); return; } setCampaignPrefill(idx); setView("campaigns"); }} />, actions: <ActionInboxView t={t} setView={navTo} />, inbox: <InboxView t={t} target={chatTarget} autopilot={autopilot} />, crm: <CrmView t={t} goToChat={goToChat} setView={navTo} imported={imported} setImported={setImported} importReq={importReq} clearImportReq={() => setImportReq(false)} />,
    audience: <AudienceView t={t} onImport={() => { setView("crm"); setImportReq(true); }} />, offers: <ProductsView t={t} prefill={setupProduct} />, transactions: <TransactionsView t={t} lang={lang} />, campaigns: <CampaignsView t={t} prefill={campaignPrefill} clearPrefill={() => setCampaignPrefill(null)} />, journeys: <JourneysView t={t} onPlaybooks={() => setPbOpen(true)} />,
    agent: <AgentView t={t} lang={lang} setView={navTo} channel={activeChannel} onChannelChanged={loadChannels} />, insights: <InsightsView t={t} />, settings: <SettingsView t={t} channel={activeChannel} onBilling={() => setBillingId(activeId)} twoFA={twoFA} setTwoFA={setTwoFA} sessions={otherSessions} onRevoke={(id: string) => setOtherSessions((p) => p.filter((x) => x.id !== id))} onRevokeAll={() => setOtherSessions([])} onManageAccount={() => setAccountOpen(true)} account={account} consent={consent} onConsentSave={(c: any) => { setConsent({ decided: true, analytics: !!c.analytics, marketing: !!c.marketing }); setTelemetryConsent({ analytics: !!c.analytics, marketing: !!c.marketing }); }} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onRefer={() => setRefOpen(true)} onChannelChanged={loadChannels} />,
  };

  return (
    <div className="db-root" data-theme={theme} dir={dir}>
      {!authed ? (
        <AuthScreen t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} account={account} requires2FA={twoFA} onAuthed={(acc: any, returning?: boolean) => {
          setAccount(acc); setAuthed(true); identify({ email: acc.email, brand: acc.brand }); track("login", { returning: !!returning }); if (acc && acc.prefs) { if (acc.prefs.lang) setLang(acc.prefs.lang); if (acc.prefs.theme) setTheme(acc.prefs.theme); }
          if (apiEnabled()) { loadChannels(); setView("overview"); return; }
          if (returning) {
            const bn = String(acc.brand || "My channel");
            const uname = "@" + (bn.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "mychannel");
            const ch = { id: "ch_main", name: bn, username: uname, members: 4820, date: t.common.today, rev: 17350, growth: 14, paid: true, planName: PLAN_NAMES[1], daysLeft: 21, daysTotal: 30, payments: [{ d: t.common.today, amt: PLAN_PRICES[1], gw: "card", st: "ok" }] };
            setChannels([ch]); setActiveId(ch.id); setView("overview"); show(t.auth.restored);
          }
        }} />
      ) : channels.length === 0 ? (
        <ChannelEmpty t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} onAdd={() => setWizard(true)} />
      ) : (!activeChannel) ? (
        <BusinessHub channels={channels} t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} account={account} onManageAccount={() => setAccountOpen(true)} onOpen={(id: string) => { setActiveId(id); setView("overview"); }} onAdd={() => setWizard(true)} onBilling={(id: string) => setBillingId(id)} />
      ) : (
        <>
          <div className="db-app">
            <Sidebar view={view} setView={navTo} open={sideOpen} lang={lang} setLang={setLang} langOpen={langOpen} setLangOpen={setLangOpen} account={account} channel={activeChannel} onAccount={() => { setAccountOpen(true); setSideOpen(false); }} onPlan={() => { setBillingId(activeId); setSideOpen(false); }} onLogout={() => setConfirmOut(true)} tier={tier} onLocked={onLocked} t={t} />
            {sideOpen && <div className="db-scrim" onClick={() => setSideOpen(false)} />}
            <div className="db-main">
              <Topbar theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} onPick={goToChat} channels={channels} activeId={activeId} onSwitch={setActiveId} onAddChannel={() => setWizard(true)} onHub={() => setActiveId(null)} onOperator={() => setOpMode(true)} onNav={navTo} t={t} />
              <div className="db-content"><PullToRefresh onRefresh={() => { try { track("pull_refresh"); } catch (e) {} toast(t.ptr.refreshed); }} label={t.ptr.pull} releaseLabel={t.ptr.release} refreshingLabel={t.ptr.refreshing}>{viewLocked(view, tier) ? <LockedView t={t} onUpgrade={() => setBillingId(activeId)} /> : views[view]}</PullToRefresh></div>
            </div>
          </div>
          <BottomNav view={view} setView={navTo} openMore={() => setSideOpen(true)} t={t} />
        </>
      )}
      {authed && accountOpen && <AccountModal t={t} account={account} setAccount={setAccount} onLogout={() => setConfirmOut(true)} onClose={() => setAccountOpen(false)} />}
      {authed && confirmOut && <ConfirmModal title={t.acct.outT} body={t.acct.outB} confirmLabel={t.acct.outConfirm} cancelLabel={t.acct.outCancel} danger onConfirm={() => { setConfirmOut(false); logout(); }} onClose={() => setConfirmOut(false)} />}
      {authed && activeChannel && consent.decided && tourView && t.tours[tourView] && <CoachTour steps={t.tours[tourView]} t={t} onClose={() => { setToursSeen((p: any) => ({ ...p, [tourView as string]: true })); setTourView(null); }} />}
      {authed && wizard && <ChannelWizard t={t} email={account.email} onClose={() => setWizard(false)} onConnect={connectChannel} />}
      {authed && billingId && <ChannelBilling channel={channels.find((c) => c.id === billingId)} t={t} lang={lang} onClose={() => setBillingId(null)} onPay={(pi: number, gw: string) => payChannel(billingId, pi, gw)} />}
      {authed && composer && <CampaignComposer t={t} onClose={() => setComposer(false)} />}
      {authed && !consent.decided && <ConsentBanner t={t} onDecide={(ch: any) => { setConsent({ decided: true, analytics: !!ch.analytics, marketing: !!ch.marketing }); setTelemetryConsent({ analytics: !!ch.analytics, marketing: !!ch.marketing }); if (ch.analytics) { identify({ email: account.email, brand: account.brand }); track("consent_granted", { marketing: !!ch.marketing }); } toast(t.consent.saved); }} />}
      {authed && shareOpen && <ShareCard t={t} account={account} lang={lang} onRefer={() => { setShareOpen(false); setRefOpen(true); }} onWall={() => { setShareOpen(false); setWallOpen(true); }} onClose={() => setShareOpen(false)} />}
      {authed && wallOpen && <WallOfWins t={t} account={account} lang={lang} onShare={() => { setWallOpen(false); setShareOpen(true); }} onClose={() => setWallOpen(false)} />}
      {authed && refOpen && <ReferralModal t={t} account={account} onClose={() => setRefOpen(false)} />}
      {authed && pbOpen && <PlaybookGallery t={t} onClose={() => setPbOpen(false)} onUse={() => { setPbOpen(false); setView("journeys"); toast(t.pb.activated); }} />}
      {authed && celebrate && <CelebrateModal t={t} kind={celebrate.kind} value={celebrate.value} onClose={() => setCelebrate(null)} onShare={() => { setCelebrate(null); setShareOpen(true); }} onNewGoal={() => setCelebrate(null)} />}
      {authed && opMode && <OperatorMode t={t} autopilot={autopilot} onClose={() => setOpMode(false)} />}
      {authed && firstWin && <FirstWinModal t={t} leads={firstWin.leads} onActivate={() => { setFirstWin(null); toast(t.toast.created); }} onClose={() => setFirstWin(null)} />}
      {authed && briefOpen && <DailyBrief t={t} decisions={ACTION_META.length} onClose={() => { setBriefOpen(false); store.set("briefSeen", todayKey()); }} onGoTasks={() => { setBriefOpen(false); store.set("briefSeen", todayKey()); setView("actions"); }} />}
      {authed && xaiOpen && <AIExplainModal t={t} onClose={() => setXaiOpen(false)} onAdjust={() => setXaiOpen(false)} />}
      {authed && <SalesAdvisor t={t} lang={lang} account={account} open={advisorOpen} onClose={() => setAdvisorOpen(false)} onUpgrade={() => { setAdvisorOpen(false); setWizard(true); track("advisor_cta"); }} onCapture={(p: any) => setAdvisorProfile(p)} />}
      {authed && !advisorOpen && <AdvisorFab label={t.adv.title} onOpen={() => setAdvisorOpen(true)} />}
      {toastMsg && <div className="db-toast" role="status">{toastMsg}</div>}
    </div>
  );
}
