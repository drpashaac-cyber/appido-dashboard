import { useEffect, useRef, useState } from "react";

// Dashboard support chat.
// First message is a language picker. User can reopen the picker from the globe button.
// Each user message is language-detected, and the assistant replies in the detected language.

const COL = {
  forest: "#1A312B",
  cream: "#F4F1E6",
  phosphor: "#67E18D",
  sand: "#D1C9BA",
  mint: "#C2ECCC",
};

type LangId = "en" | "fa" | "ar" | "tr" | "ru";

const LANGS: { id: LangId; label: string }[] = [
  { id: "en", label: "English" },
  { id: "fa", label: "فارسی" },
  { id: "ar", label: "العربية" },
  { id: "tr", label: "Türkçe" },
  { id: "ru", label: "Русский" },
];

const UI: Record<LangId, { title: string; sub: string; ph: string; greet: string }> = {
  en: {
    title: "Appido Assistant",
    sub: "AI · replies in seconds",
    ph: "Ask anything…",
    greet: "Hi! I'm Appido's assistant. Ask me anything about turning your Telegram into a 24/7 sales machine.",
  },
  fa: {
    title: "دستیار اپیدو",
    sub: "هوش مصنوعی · پاسخ در چند ثانیه",
    ph: "هر سوالی داری بپرس…",
    greet: "سلام! من دستیار اپیدو هستم. هر سوالی درباره تبدیل تلگرامت به یک ماشین فروش ۲۴ ساعته داری، بپرس.",
  },
  ar: {
    title: "مساعد أبيدو",
    sub: "ذكاء اصطناعي · رد خلال ثوانٍ",
    ph: "اسأل أي شيء…",
    greet: "مرحبًا! أنا مساعد أبيدو. اسألني أي شيء عن تحويل تيليجرام إلى آلة مبيعات تعمل 24/7.",
  },
  tr: {
    title: "Appido Asistanı",
    sub: "Yapay zeka · saniyeler içinde yanıt",
    ph: "Bir şey sorun…",
    greet: "Merhaba! Ben Appido asistanıyım. Telegram'ınızı 7/24 satış makinesine dönüştürmeyle ilgili her şeyi sorabilirsiniz.",
  },
  ru: {
    title: "Ассистент Appido",
    sub: "ИИ · ответ за секунды",
    ph: "Спросите что угодно…",
    greet: "Привет! Я ассистент Appido. Спросите что угодно о превращении Telegram в машину продаж 24/7.",
  },
};

const PICKER_TEXT = "Choose your language · زبان · اللغة · Dil · язык";

type Msg = { role: "ai" | "me"; text: string; chips?: boolean };

function detectMessageLang(text: string): LangId | null {
  const v = text.trim();
  if (!v) return null;

  // Persian / Arabic script.
  if (/[\u0600-\u06FF]/.test(v)) {
    // Persian-only letters.
    if (/[\u067E\u0686\u0698\u06AF\u06A9\u06CC\u06F0-\u06F9]/.test(v)) return "fa";
    return "ar";
  }

  // Cyrillic.
  if (/[\u0400-\u04FF]/.test(v)) return "ru";

  // Turkish-specific letters.
  if (/[çğıöşüÇĞİÖŞÜ]/.test(v)) return "tr";

  // Plain Latin defaults to English.
  if (/[A-Za-z]/.test(v)) return "en";

  return null;
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LangId | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: PICKER_TEXT, chips: true },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!opened.current) {
        setOpen(true);
        opened.current = true;
      }
    }, 10000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy, open]);

  const ui = UI[lang ?? "en"];
  const rtl = lang === "fa" || lang === "ar";

  const pickLang = (id: LangId) => {
    setLang(id);
    setMessages((m) =>
      m
        .map((x) => (x.chips ? { ...x, chips: false } : x))
        .concat({ role: "ai", text: UI[id].greet })
    );
  };

  const resetLang = () => {
    setLang(null);
    setInput("");
    setMessages([{ role: "ai", text: PICKER_TEXT, chips: true }]);
  };

  const send = async () => {
    const v = input.trim();
    if (!v || busy || !lang) return;

    const detected = detectMessageLang(v);
    const activeLang: LangId = detected ?? lang;

    // Important: follow the user's latest message language, even if it is English.
    if (activeLang !== lang) setLang(activeLang);

    setInput("");
    setMessages((m) => [...m, { role: "me", text: v }]);
    setBusy(true);

    try {
      const res = await fetch("https://api.appido.io/v1/ai/advisor-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: v, lang: activeLang }),
      });
      const data = (await res.json()) as { answer?: string };
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.answer?.trim() || UI[activeLang].greet },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: UI[activeLang].greet }]);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        aria-label="Open Appido assistant"
        onClick={() => {
          setOpen(true);
          opened.current = true;
        }}
        style={{
          position: "fixed",
          insetInlineEnd: 20,
          bottom: 20,
          zIndex: 60,
          width: 56,
          height: 56,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: COL.forest,
          color: COL.phosphor,
          boxShadow: "0 10px 30px rgba(26,49,43,.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8l-4 3v-3a3 3 0 0 1-1-2V9a3 3 0 0 1 3-3h1V5a3 3 0 0 1 3-3Z" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
        </svg>
        <span style={{ position: "absolute", top: 12, insetInlineEnd: 12, width: 9, height: 9, borderRadius: 999, background: COL.phosphor, boxShadow: "0 0 0 2px " + COL.forest }} />
      </button>
    );
  }

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        position: "fixed",
        insetInlineEnd: 20,
        bottom: 20,
        zIndex: 60,
        width: "min(360px, calc(100vw - 32px))",
        height: "min(520px, calc(100vh - 40px))",
        display: "flex",
        flexDirection: "column",
        background: COL.cream,
        border: `1px solid ${COL.sand}`,
        borderRadius: 18,
        boxShadow: "0 24px 60px rgba(26,49,43,.30)",
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: COL.forest, color: COL.cream }}>
        <span style={{ width: 34, height: 34, borderRadius: 999, background: COL.phosphor, color: COL.forest, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8l-4 3v-3a3 3 0 0 1-1-2V9a3 3 0 0 1 3-3h1V5a3 3 0 0 1 3-3Z" />
          </svg>
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ui.title}</div>
          <div style={{ fontSize: 11.5, opacity: 0.8 }}>{ui.sub}</div>
        </div>
        {lang && (
          <button
            aria-label="Change language"
            onClick={resetLang}
            title="Change language"
            style={{ background: "transparent", border: `1px solid ${COL.sand}`, color: COL.cream, cursor: "pointer", padding: "3px 8px", borderRadius: 8, fontSize: 13, lineHeight: 1 }}
          >
            🌐
          </button>
        )}
        <button aria-label="Close" onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: COL.cream, cursor: "pointer", padding: 4, lineHeight: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "me" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ padding: "9px 12px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, background: m.role === "me" ? COL.forest : COL.mint, color: m.role === "me" ? COL.cream : COL.forest, border: m.role === "me" ? "none" : `1px solid ${COL.sand}`, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
            {m.chips ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => pickLang(l.id)} style={{ padding: "7px 12px", borderRadius: 999, border: `1px solid ${COL.forest}`, background: COL.cream, color: COL.forest, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {l.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {busy ? (
          <div style={{ alignSelf: "flex-start", padding: "9px 14px", borderRadius: 14, background: COL.mint, border: `1px solid ${COL.sand}`, color: COL.forest, fontSize: 13 }}>…</div>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${COL.sand}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={ui.ph}
          disabled={!lang || busy}
          style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 12, border: `1px solid ${COL.sand}`, background: COL.cream, color: COL.forest, fontSize: 13.5, outline: "none" }}
        />
        <button aria-label="Send" onClick={send} disabled={!lang || busy || !input.trim()} style={{ flex: "0 0 auto", width: 42, borderRadius: 12, border: "none", background: COL.phosphor, color: COL.forest, cursor: !lang || busy || !input.trim() ? "default" : "pointer", opacity: !lang || busy || !input.trim() ? 0.55 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </div>
    </div>
  );
}