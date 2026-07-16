"use client";

import { useEffect, useRef, useState } from "react";

// Landing support chat usingapi/advisor endpoint for free Q&A after the scripted qualification flow.

const COL = { forest: "#1A312B", cream: "#F4F1E6", phosphor: "#67E18D", sand: "#D1C9BA", mint: "#C2ECCC" };

type LangId = "en" | "fa" | "ar" | "tr" | "ru";
type Msg = { role: "ai" | "me"; text: string; chips?: boolean | string[]; cta?: boolean };

const LANGS: { id: LangId; label: string }[] = [
  { id: "en", label: "English" },
  { id: "fa", label: "فارسی" },
  { id: "ar", label: "العربية" },
  { id: "tr", label: "Türkçe" },
  { id: "ru", label: "Русский" },
];

const PICKER_TEXT = "Choose your language · زبان · اللغة · Dil · язык";

const UI: Record<LangId, { title: string; sub: string; ph: string; greet: string }> = {
  en: { title: "Appido Assistant", sub: "AI · replies in seconds", ph: "Ask anything…", greet: "Hi! I'm Appido's assistant. Ask me anything about turning your Telegram into a 24/7 sales machine." },
  fa: { title: "دستیارِ اپیدو", sub: "هوشِ مصنوعی · پاسخ در چند ثانیه", ph: "هر سوالی داری بپرس…", greet: "سلام! من دستیارِ اپیدو هستم. هر سوالی دربارهٔ تبدیلِ تلگرامت به یک ماشینِ فروشِ 24ساعته داری، بپرس." },
  ar: { title: "مساعد أبيدو", sub: "ذكاء اصطناعي · رد خلال ثوانٍ", ph: "اسأل أي شيء…", greet: "مرحبًا! أنا مساعد أبيدو. اسألني أي شيء عن تحويل تيليجرام إلى آلة مبيعات تعمل 24/7." },
  tr: { title: "Appido Asistanı", sub: "Yapay zeka · saniyeler içinde yanıt", ph: "Bir şey sorun…", greet: "Merhaba! Ben Appido asistanıyım. Telegram'ınızı 7/24 satış makinesine dönüştürmeyle ilgili her şeyi sorabilirsiniz." },
  ru: { title: "Ассистент Appido", sub: "ИИ · ответ за секунды", ph: "Спросите что угодно…", greet: "Привет! Я ассистент Appido. Спросите что угодно о превращении Telegram в машину продаж 24/7." },
};

const ADV: Record<LangId, any> = {
  en: {
    title: "Appido Advisor",
    aiPill: "AI",
    greetName: "Hi, I'm Kourosh — your Appido advisor 👋 What should I call you?",
    qGender: "Lovely to meet you, {name}! So I address you right — Ms. or Mr.?",
    genderOpts: ["Ms.", "Mr."],
    qSell: "Perfect, {hon} 🙏 To understand your world: what product or service do you offer?",
    sellOpts: ["Online course", "VIP membership", "Signals", "Services", "Something else"],
    qPrice: "Got it 👌 Just so I can put a real number on this — roughly, what does one sale bring in? (a ballpark is perfect)",
    priceOpts: ["Under $30", "$30–100", "$100–500", "Over $500"],
    qSales: "Great. And in a typical month, about how many sales land?",
    salesOpts: ["Under 20", "20–100", "100–500", "Over 500"],
    qConcern: "Last one, I promise 🙌 What's the one thing slowing your sales down most right now?",
    concernOpts: ["I don't follow up with leads", "No time to reply", "Sales below potential", "Everything is manual"],
    crmSaved: "✅ Saved your profile to your CRM.",
    diag: "{hon}, you're making about {current}/mo right now. But the leads you already have that don't convert are worth about {lost} more every month — that's money on the table.",
    reveal: "Now the important part, {hon}: what I just did with you — learned about you, understood your need, and showed you the gap — is exactly what Appido does with every lead in your channel, 24/7, without tiring. The difference is, there it doesn't just show — it sells.",
    pitch: "{hon}, want to switch it on for your own leads right now?",
    ctaStart: "Yes, let's start",
    ctaLater: "Maybe later",
    inputPh: "Type your answer…",
    qaFallback: "Good question! Short version: Appido follows up and converts your leads for you. Want to try it on your own channel?",
  },
  fa: {
    title: "مشاورِ هوشمندِ اپیدو",
    aiPill: "AI",
    greetName: "سلام، من کوروشم — مشاورِ اپیدو 👋 چی صداتون کنم؟",
    qGender: "خوشحالم که آشنا شدیم {name}! که درست خطابت کنم — خانم یا آقا؟",
    genderOpts: ["خانم", "آقا"],
    qSell: "عالیه {hon} 🙏 که کارت رو بهتر بفهمم: چه محصول یا خدمتی ارائه می‌دی؟",
    sellOpts: ["دورهٔ آموزشی", "عضویتِ VIP", "سیگنال", "خدمات", "چیزِ دیگه"],
    qPrice: "گرفتم 👌 فقط برای اینکه یه عددِ واقعی بهت بدم — قیمتِ هر فروش حدوداً چقدره؟ (تقریبی هم کافیه)",
    priceOpts: ["زیرِ 30 دلار", "30 تا 100 دلار", "100 تا 500 دلار", "بالای 500 دلار"],
    qSales: "خوبه. توی یه ماهِ معمولی، حدوداً چند تا فروش داری؟",
    salesOpts: ["زیرِ 20", "20 تا 100", "100 تا 500", "بالای 500"],
    qConcern: "آخریشه، قول می‌دم 🙌 الان بزرگ‌ترین چیزی که جلوی فروشت رو گرفته چیه؟",
    concernOpts: ["لیدها رو پیگیری نمی‌کنم", "وقتِ جواب‌دادن ندارم", "فروش کمتر از پتانسیله", "همه‌چی دستیه"],
    crmSaved: "✅ پروفایلت توی CRM ثبت شد.",
    diag: "{hon} عزیز، الان حدودِ {current} در ماه می‌فروشی. اما لیدهایی که داری و تبدیل نمی‌شن، حدودِ {lost} دیگه در ماه ارزش دارن که داره از دست می‌ره — این پولِ روی میزه.",
    reveal: "حالا نکتهٔ مهم {hon} عزیز: همین کاری که الان باهات کردم — شناختمت، نیازت رو فهمیدم و شکاف رو نشونت دادم — دقیقاً همون کاریه که اپیدو با تک‌تکِ لیدهای کانالت می‌کنه؛ 24ساعته و بدونِ خستگی. فرقش اینه که اونجا فقط نشون نمی‌ده — می‌فروشه.",
    pitch: "{hon} عزیز، می‌خوای همین حالا روی لیدهای خودت روشنش کنیم؟",
    ctaStart: "آره، شروع کنیم",
    ctaLater: "بعداً",
    inputPh: "جوابت رو بنویس…",
    qaFallback: "سؤالِ خوبیه! کوتاهش: اپیدو خودش لیدهات رو پیگیری و به فروش تبدیل می‌کنه. می‌خوای روی کانالِ خودت امتحانش کنیم؟",
  },
  ar: {
    title: "مستشار أپيدو",
    aiPill: "AI",
    greetName: "مرحبًا، أنا كوروش — مستشارك في أپيدو 👋 بماذا أناديك؟",
    qGender: "سعيد بلقائك {name}! حتى أخاطبك بشكل صحيح — سيدة أم سيد؟",
    genderOpts: ["سيدة", "سيد"],
    qSell: "رائع {hon} 🙏 لأفهم مجالك: ما المنتج أو الخدمة التي تقدّمها؟",
    sellOpts: ["دورة تدريبية", "عضوية VIP", "إشارات", "خدمات", "شيء آخر"],
    qPrice: "فهمت 👌 فقط لأعطيك رقمًا حقيقيًا — كم تبلغ قيمة البيعة الواحدة تقريبًا؟ (تقدير تقريبي يكفي)",
    priceOpts: ["أقل من 30$", "30–100$", "100–500$", "أكثر من 500$"],
    qSales: "جميل. في الشهر المعتاد، كم عملية بيع تقريبًا؟",
    salesOpts: ["أقل من 20", "20–100", "100–500", "أكثر من 500"],
    qConcern: "آخر سؤال، أعدك 🙌 ما أكثر شيء يبطئ مبيعاتك الآن؟",
    concernOpts: ["لا أتابع العملاء", "لا وقت للرد", "المبيعات أقل من الإمكانات", "كل شيء يدوي"],
    crmSaved: "✅ تم حفظ ملفك في CRM.",
    diag: "{hon}، تبيع الآن نحو {current} شهريًا. لكن العملاء الذين لديك ولا يتحوّلون يساوون نحو {lost} إضافية كل شهر تضيع — هذا مال على الطاولة.",
    reveal: "الآن الأهم {hon}: ما فعلته معك للتو — تعرّفت عليك وفهمت حاجتك وأريتك الفجوة — هو تمامًا ما يفعله أپيدو مع كل عميل في قناتك، على مدار الساعة دون تعب. الفرق أنه هناك لا يكتفي بالعرض — بل يبيع.",
    pitch: "{hon}، هل تريد تفعيله على عملائك الآن؟",
    ctaStart: "نعم، لنبدأ",
    ctaLater: "لاحقًا",
    inputPh: "اكتب إجابتك…",
    qaFallback: "سؤال جيد! باختصار: أپيدو يتابع عملاءك ويحوّلهم إلى مبيعات نيابةً عنك. هل نجرّبه على قناتك؟",
  },
  tr: {
    title: "Appido Danışmanı",
    aiPill: "AI",
    greetName: "Merhaba, ben Kouroş — Appido danışmanın 👋 Sana nasıl hitap edeyim?",
    qGender: "Tanıştığımıza sevindim {name}! Doğru hitap edebilmem için — Hanım mı Bey mi?",
    genderOpts: ["Hanım", "Bey"],
    qSell: "Harika {hon} 🙏 İşini anlamam için: hangi ürün veya hizmeti sunuyorsun?",
    sellOpts: ["Online kurs", "VIP üyelik", "Sinyaller", "Hizmetler", "Başka bir şey"],
    qPrice: "Anladım 👌 Sana gerçek bir rakam verebilmem için — bir satış kabaca ne kadar getiriyor? (yaklaşık değer yeterli)",
    priceOpts: ["30$ altı", "30–100$", "100–500$", "500$ üzeri"],
    qSales: "Güzel. Tipik bir ayda yaklaşık kaç satış oluyor?",
    salesOpts: ["20 altı", "20–100", "100–500", "500 üzeri"],
    qConcern: "Son soru, söz 🙌 Şu an satışını en çok yavaşlatan tek şey ne?",
    concernOpts: ["Adayları takip etmiyorum", "Yanıtlamaya vakit yok", "Satış potansiyelin altında", "Her şey elle"],
    crmSaved: "✅ Profilin CRM'ine kaydedildi.",
    diag: "{hon}, şu an ayda yaklaşık {current} satıyorsun. Ama sahip olduğun ama dönüşmeyen adaylar her ay yaklaşık {lost} daha değerinde — bu masada duran para.",
    reveal: "Şimdi önemli kısım {hon}: az önce seninle yaptığım şey — seni tanıdım, ihtiyacını anladım ve farkı gösterdim — Appido'nun kanalındaki her adayla 7/24 yorulmadan yaptığının tam aynısı. Fark şu: orada sadece göstermez — satar.",
    pitch: "{hon}, kendi adaylarında hemen açalım mı?",
    ctaStart: "Evet, başlayalım",
    ctaLater: "Sonra",
    inputPh: "Cevabını yaz…",
    qaFallback: "Güzel soru! Kısacası: Appido adaylarını senin yerine takip edip satışa çevirir. Kendi kanalında deneyelim mi?",
  },
  ru: {
    title: "Советник Appido",
    aiPill: "AI",
    greetName: "Здравствуйте, я Куруш — ваш советник в Appido 👋 Как мне к вам обращаться?",
    qGender: "Рад знакомству, {name}! Чтобы обращаться правильно — госпожа или господин?",
    genderOpts: ["Госпожа", "Господин"],
    qSell: "Отлично, {hon} 🙏 Чтобы понять вашу сферу: какой продукт или услугу вы предлагаете?",
    sellOpts: ["Онлайн-курс", "VIP-подписка", "Сигналы", "Услуги", "Другое"],
    qPrice: "Понял 👌 Просто чтобы назвать реальную цифру — сколько примерно приносит одна продажа? (примерно — вполне достаточно)",
    priceOpts: ["До $30", "$30–100", "$100–500", "Более $500"],
    qSales: "Хорошо. За обычный месяц — примерно сколько продаж?",
    salesOpts: ["До 20", "20–100", "100–500", "Более 500"],
    qConcern: "Последний вопрос, обещаю 🙌 Что сейчас сильнее всего тормозит ваши продажи?",
    concernOpts: ["Не дожимаю лидов", "Нет времени отвечать", "Продажи ниже потенциала", "Всё вручную"],
    crmSaved: "✅ Профиль сохранён в CRM.",
    diag: "{hon}, сейчас вы продаёте примерно на {current} в месяц. Но лиды, которые у вас есть и не конвертируются, стоят ещё около {lost} в месяц — это деньги на столе.",
    reveal: "Теперь главное, {hon}: то, что я только что сделал с вами — узнал вас, понял потребность и показал разрыв — это ровно то, что Appido делает с каждым лидом в вашем канале, 24/7, без устали. Разница в том, что там он не просто показывает — он продаёт.",
    pitch: "{hon}, включить это для ваших лидов прямо сейчас?",
    ctaStart: "Да, начнём",
    ctaLater: "Позже",
    inputPh: "Напишите ответ…",
    qaFallback: "Хороший вопрос! Коротко: Appido сам дожимает ваших лидов и превращает их в продажи. Попробуем на вашем канале?",
  },
};

const PRICE_REPS = [20, 65, 250, 800];
const SALES_REPS = [12, 50, 250, 900];

function detectMessageLang(
  text: string,
  currentLang?: LangId | null,
): LangId | null {
  const value = text.trim();

  if (!value) return null;

  // Russian has a distinct script.
  if (/[\u0400-\u04FF]/u.test(value)) {
    return "ru";
  }

  // Persian and Arabic share many characters.
  if (/[\u0600-\u06FF]/u.test(value)) {
    // Characters used specifically or predominantly in Persian.
    if (
      /[\u067E\u0686\u0698\u06AF\u06A9\u06CC\u06C0\u06D5\u06F0-\u06F9]/u.test(
        value,
      )
    ) {
      return "fa";
    }

    const words = value
      .replace(/[^\u0600-\u06FF]+/gu, " ")
      .trim()
      .split(/\s+/u)
      .filter(Boolean);

    const hasWord = (items: string[]) =>
      words.some((word) => items.includes(word));

    const hasStrongPersianWords = hasWord([
      "من",
      "ما",
      "تو",
      "شما",
      "هستم",
      "هستیم",
      "هستی",
      "دارم",
      "داریم",
      "دارید",
      "ندارم",
      "میخوام",
      "میخواهم",
      "میفروشم",
      "برای",
      "چی",
      "چطور",
      "خوبم",
      "ممنون",
      "فروش",
      "محصول",
      "خدمت",
      "دوره",
      "قیمت",
      "ماهانه",
      "الان",
    ]);

    if (hasStrongPersianWords) {
      return "fa";
    }

    const hasStrongArabicWords = hasWord([
      "أنا",
      "انا",
      "نحن",
      "أنت",
      "انت",
      "هو",
      "هي",
      "نعم",
      "كيف",
      "ماذا",
      "هذا",
      "هذه",
      "لدي",
      "عندي",
      "شكرا",
      "مرحبا",
      "أريد",
      "اريد",
      "أبيع",
      "ابيع",
      "منتج",
      "خدمة",
      "دورة",
      "دورات",
      "مبيعات",
      "سعر",
      "شهريا",
      "الآن",
      "الان",
    ]);

    if (hasStrongArabicWords) {
      return "ar";
    }

    // Arabic-specific forms and diacritics.
    if (
      /[\u0629\u0649\u0624\u0626\u0671\u064B-\u065F]/u.test(
        value,
      )
    ) {
      return "ar";
    }

    // Ambiguous names and short text preserve the selected language.
    // Examples: مونا، محمد، سلام
    if (currentLang === "fa" || currentLang === "ar") {
      return currentLang;
    }

    return "fa";
  }

  // Turkish-specific Latin characters.
  if (
    /[\u00C7\u011E\u0130\u00D6\u015E\u00DC\u00E7\u011F\u0131\u00F6\u015F\u00FC]/u.test(
      value,
    )
  ) {
    return "tr";
  }

  if (/[A-Za-z]/u.test(value)) {
    const lower = value.toLocaleLowerCase();

    const words = lower
      .split(/[^a-zçğıöşü]+/u)
      .filter(Boolean);

    const hasWord = (items: string[]) =>
      words.some((word) => items.includes(word));

    if (
      hasWord([
        "merhaba",
        "ben",
        "benim",
        "evet",
        "hayir",
        "hayır",
        "nasil",
        "nasıl",
        "urun",
        "ürün",
        "hizmet",
        "satis",
        "satış",
        "fiyat",
        "aylik",
        "aylık",
        "istiyorum",
        "kurs",
      ])
    ) {
      return "tr";
    }

    if (
      hasWord([
        "hello",
        "hi",
        "hey",
        "yes",
        "no",
        "thanks",
        "thank",
        "what",
        "how",
        "product",
        "service",
        "sales",
        "price",
        "month",
        "course",
        "sell",
        "selling",
        "need",
        "want",
      ])
    ) {
      return "en";
    }

    if (currentLang === "tr" || currentLang === "en") {
      return currentLang;
    }

    return "en";
  }

  // Numbers, punctuation and emoji do not change language.
  return null;
}

function money(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function honor(p: any, lang: LangId) {
  const nm = p.name || "";
  if (!nm) return "";
  if (lang === "fa") return (p.gender === "f" ? "خانمِ " : p.gender === "m" ? "آقای " : "") + nm;
  if (lang === "ar") return (p.gender === "f" ? "السيدة " : p.gender === "m" ? "السيد " : "") + nm;
  return nm;
}

function tmpl(str: string, p: any, lang: LangId) {
  let x = String(str || "");
  x = x.split("{hon}").join(honor(p, lang) || (p.name || ""));
  x = x.split("{name}").join(p.name || "");
  x = x.split("{current}").join(money(p.current || 0));
  x = x.split("{lost}").join(money(p.lost || 0));
  return x;
}

function qFor(ns: number, p: any, lang: LangId) {
  const a = ADV[lang];
  return ns === 1 ? tmpl(a.qGender, p, lang)
    : ns === 2 ? tmpl(a.qSell, p, lang)
    : ns === 3 ? a.qPrice
    : ns === 4 ? a.qSales
    : ns === 5 ? a.qConcern
    : "";
}

function chipsFor(ns: number, lang: LangId) {
  const a = ADV[lang];
  return [null, a.genderOpts, a.sellOpts, a.priceOpts, a.salesOpts, a.concernOpts][ns] as string[] | null;
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<LangId | null>(null);
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", text: PICKER_TEXT, chips: true }]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"q" | "done">("q");
  const [profile, setProfile] = useState<any>({});
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

  const activeLang = lang ?? "en";
  const ui = UI[activeLang];
  const adv = ADV[activeLang];
  const rtl = activeLang === "fa" || activeLang === "ar";

  const pushAI = (text: string, chips?: string[] | null, cta?: boolean) =>
    setMessages((m) => [...m, { role: "ai", text, chips: chips || undefined, cta }]);

  const pushMe = (text: string) =>
    setMessages((m) => [...m, { role: "me", text }]);

  const clearChips = () =>
    setMessages((m) => m.map((x) => x.chips ? { ...x, chips: undefined } : x));

  const pickLang = (id: LangId) => {
    setLang(id);
    setStep(0);
    setPhase("q");
    setProfile({});
    setInput("");
    setMessages((m) =>
      m.map((x) => (x.chips ? { ...x, chips: undefined } : x))
        .concat({ role: "ai", text: ADV[id].greetName })
    );
  };

  const resetLang = () => {
    setLang(null);
    setStep(0);
    setPhase("q");
    setProfile({});
    setInput("");
    setMessages([{ role: "ai", text: PICKER_TEXT, chips: true }]);
  };

  const diagnose = (p: any, langNow: LangId) => {
    const a = ADV[langNow];
    const P = PRICE_REPS[typeof p.priceIdx === "number" ? p.priceIdx : 1];
    const S = SALES_REPS[typeof p.salesIdx === "number" ? p.salesIdx : 1];
    const current = P * S;
    const lost = Math.round(current * 0.55);
    const full = { ...p, current, lost, capturedAt: Date.now() };

    setProfile(full);
    pushAI(a.crmSaved);
    setBusy(true);

    setTimeout(() => {
      setBusy(false);
      pushAI(tmpl(a.diag, full, langNow));
      setTimeout(() => pushAI(tmpl(a.reveal, full, langNow)), 850);
      setTimeout(() => {
        pushAI(tmpl(a.pitch, full, langNow), undefined, true);
        setPhase("done");
      }, 1750);
    }, 950);
  };

  const answer = (label: string, idx?: number) => {
    if (!lang) return;

    const detected =
      typeof idx === "number" || step === 0
        ? null
        : detectMessageLang(label, lang);
    const langNow = detected ?? lang;

    if (langNow !== lang) setLang(langNow);

    clearChips();
    pushMe(label);

    const sNow = step;
    const np: any = { ...profile };

    if (sNow === 0) np.name = label;
    else if (sNow === 1) np.gender = idx === 0 ? "f" : idx === 1 ? "m" : np.gender;
    else if (sNow === 2) np.sell = label;
    else if (sNow === 3) np.priceIdx = typeof idx === "number" ? idx : 1;
    else if (sNow === 4) {
      np.salesIdx = typeof idx === "number" ? idx : 1;
      np.salesLabel = label;
    }
    else if (sNow === 5) np.concern = label;

    setProfile(np);

    if (sNow < 5) {
      const ns = sNow + 1;
      setStep(ns);
      setTimeout(() => pushAI(qFor(ns, np, langNow), chipsFor(ns, langNow)), 460);
    } else {
      setTimeout(() => diagnose(np, langNow), 420);
    }
  };

  const askFreeQA = async (text: string) => {
    if (!lang) return;

    const detected = detectMessageLang(text, lang);
    const langNow = detected ?? lang;
    const a = ADV[langNow];

    if (langNow !== lang) setLang(langNow);

    clearChips();
    pushMe(text);
    setBusy(true);

    try {
      const res = await fetch("https://api.appido.io/v1/ai/advisor-public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, lang: langNow }),
      });
      const data = (await res.json()) as { answer?: string };
      setMessages((m) => [...m, { role: "ai", text: data.answer && data.answer.trim() ? data.answer : a.qaFallback }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: a.qaFallback }]);
    } finally {
      setBusy(false);
    }
  };

  const send = () => {
    const v = input.trim();
    if (!v || busy || !lang) return;
    setInput("");

    if (phase === "q") answer(v);
    else askFreeQA(v);
  };

  if (!open) {
    return (
      <button
        aria-label="Open Appido assistant"
        onClick={() => { setOpen(true); opened.current = true; }}
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 60, width: 56, height: 56, borderRadius: 999, border: "none", cursor: "pointer", background: COL.forest, color: COL.phosphor, boxShadow: "0 10px 30px rgba(26,49,43,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8l-4 3v-3a3 3 0 0 1-1-2V9a3 3 0 0 1 3-3h1V5a3 3 0 0 1 3-3Z" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /></svg>
        <span style={{ position: "absolute", top: 12, right: 12, width: 9, height: 9, borderRadius: 999, background: COL.phosphor, boxShadow: "0 0 0 2px " + COL.forest }} />
      </button>
    );
  }

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ position: "fixed", right: 20, bottom: 20, zIndex: 60, width: "min(360px, calc(100vw - 32px))", height: "min(520px, calc(100vh - 40px))", display: "flex", flexDirection: "column", background: COL.cream, border: `1px solid ${COL.sand}`, borderRadius: 18, boxShadow: "0 24px 60px rgba(26,49,43,.30)", overflow: "hidden", fontFamily: "inherit" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: COL.forest, color: COL.cream }}>
        <span style={{ width: 34, height: 34, borderRadius: 999, background: COL.phosphor, color: COL.forest, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8l-4 3v-3a3 3 0 0 1-1-2V9a3 3 0 0 1 3-3h1V5a3 3 0 0 1 3-3Z" /></svg>
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{lang ? adv.title : ui.title}</div>
          <div style={{ fontSize: 11.5, opacity: 0.8 }}>{lang ? adv.aiPill : ui.sub}</div>
        </div>
        {lang && (
          <button aria-label="Change language" onClick={resetLang} title="Change language" style={{ background: "transparent", border: `1px solid ${COL.sand}`, color: COL.cream, cursor: "pointer", padding: "3px 8px", borderRadius: 8, fontSize: 13, lineHeight: 1 }}>
            🌐
          </button>
        )}
        <button aria-label="Close" onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: COL.cream, cursor: "pointer", padding: 4, lineHeight: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "me" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ padding: "9px 12px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.5, background: m.role === "me" ? COL.forest : COL.mint, color: m.role === "me" ? COL.cream : COL.forest, border: m.role === "me" ? "none" : `1px solid ${COL.sand}`, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>

            {m.chips === true ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {LANGS.map((l) => (
                  <button key={l.id} onClick={() => pickLang(l.id)} style={{ padding: "7px 12px", borderRadius: 999, border: `1px solid ${COL.forest}`, background: COL.cream, color: COL.forest, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {l.label}
                  </button>
                ))}
              </div>
            ) : Array.isArray(m.chips) ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {m.chips.map((c, k) => (
                  <button key={k} onClick={() => answer(c, k)} style={{ padding: "7px 12px", borderRadius: 999, border: `1px solid ${COL.forest}`, background: COL.cream, color: COL.forest, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {c}
                  </button>
                ))}
              </div>
            ) : null}

            {m.cta ? (
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <button onClick={() => { window.location.href = "https://dash.appido.io/signup"; }} style={{ padding: "8px 12px", borderRadius: 999, border: "none", background: COL.phosphor, color: COL.forest, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {adv.ctaStart}
                </button>
                <button onClick={() => setOpen(false)} style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${COL.forest}`, background: "transparent", color: COL.forest, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {adv.ctaLater}
                </button>
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
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder={lang ? adv.inputPh : ui.ph}
          disabled={!lang || busy}
          style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: 12, border: `1px solid ${COL.sand}`, background: COL.cream, color: COL.forest, fontSize: 13.5, outline: "none" }}
        />
        <button aria-label="Send" onClick={send} disabled={!lang || busy || !input.trim()} style={{ flex: "0 0 auto", width: 42, borderRadius: 12, border: "none", background: COL.phosphor, color: COL.forest, cursor: !lang || busy || !input.trim() ? "default" : "pointer", opacity: !lang || busy || !input.trim() ? 0.55 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
        </button>
      </div>
    </div>
  );
}