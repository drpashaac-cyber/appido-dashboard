// Marketing + UI content (market voice, wins, AI closes, playbooks, feed).

export const LOOP_ICONS = ["users", "pin", "filter", "target", "reply", "card", "gift", "bot"];
export const LOOP_VIEWS = ["inbox", "crm", "audience", "campaigns", "crm", "journeys", "offers", "agent"];
export const BENCH = { you: 32800, avg: 27500, top: 52000, topPct: 28 };
export const FEED_PENDING = [
  { ic: "send", who: "@dmitryv", tkey: "pReply", doneKey: "fReply" },
  { ic: "target", n: 3, tkey: "pOffer", doneKey: "fOffer" },
];
export const FEED_DONE = [
  { ic: "flame", who: "Sara K.", tkey: "fQualified" },
  { ic: "coin", who: "@elifa", amt: "$90", tkey: "fPaid" },
  { ic: "check", who: "@mehdi_t", amt: "$149", tkey: "fSold" },
];
export const FEED_POOL = [
  { ic: "reply", who: "@kaveh_n", tkey: "fReengage" },
  { ic: "zap", who: "@niloo_r", tkey: "fUpsell" },
  { ic: "gift", who: "@ivanp", tkey: "fDeliver" },
  { ic: "bot", who: "@pavel_s", tkey: "fSupport" },
  { ic: "check", who: "@anna_s", amt: "$49", tkey: "fSold" },
  { ic: "coin", who: "@reza_k", amt: "$22", tkey: "fPaid" },
];
export const PLAYBOOKS = [
  { type: "course", icon: "spark" },
  { type: "course", icon: "reply" },
  { type: "signals", icon: "flame" },
  { type: "signals", icon: "clock" },
  { type: "coach", icon: "users" },
  { type: "membership", icon: "gift" },
  { type: "digital", icon: "card" },
  { type: "agency", icon: "grid" },
];
export const MARKET_VOICE = [
  { id: "fa", rtl: true, sample: "سلام رضا جان 👋 دیدم به دورهٔ پیشرفته علاقه نشون دادی. یه پیشنهادِ ویژه برات کنار گذاشتم که فقط تا فردا شب فعاله. دوست داری جزئیاتش رو برات بفرستم؟" },
  { id: "ru", rtl: false, sample: "Реза, здравствуйте. Вы интересовались продвинутым курсом — для вас есть специальное предложение со скидкой 20%, действует до завтра. Прислать детали?" },
  { id: "tr", rtl: false, sample: "Merhaba Rıza Bey 👋 İleri seviye kursla ilgilendiğinizi gördüm. Size özel, yarın akşama kadar geçerli bir teklif ayırdım. Detayları göndermemi ister misiniz?" },
  { id: "ar", rtl: true, sample: "مرحبًا رضا 👋 لاحظت اهتمامك بالدورة المتقدّمة. خصّصت لك عرضًا خاصًا ساريًا حتى مساء الغد. هل أرسل لك التفاصيل؟" },
  { id: "en", rtl: false, sample: "Hi Reza 👋 Saw you were interested in the advanced course. I've set aside a special offer for you — good through tomorrow. Want me to send the details?" },
];
export const WINS = [
  { h: "@crypto_signals_pro", amt: 8420, m: 0, w: 0, fg: "🇷🇺" },
  { h: "@mindful_yoga", amt: 3150, m: 1, w: 1, fg: "🇹🇷" },
  { h: "@fx_academy_ar", amt: 12600, m: 2, w: 1, fg: "🇦🇪" },
  { h: "@daily_signals", amt: 6300, m: 3, w: 2, fg: "🇮🇷" },
  { h: "@trade_vip_room", amt: 9800, m: 0, w: 2, fg: "🇷🇺" },
  { h: "@design_studio", amt: 2700, m: 1, w: 3, fg: "🇹🇷" },
  { h: "@coach_academy", amt: 4100, m: 2, w: 3, fg: "🇦🇪" },
  { h: "@invest_circle", amt: 7250, m: 3, w: 4, fg: "🇮🇷" },
];
export const AI_CLOSES = [
  { who: "Sara K.", amount: 390, gw: "USDT TRC20", conf: 96, whenKey: "h2", auto: true,
    signals: ["Opened pricing 3×", "Asked about advanced modules", "Clicked the checkout link"],
    timeline: [
      { k: "detect", ic: "eye", d: "Sara opened your pricing 3 times in two days." },
      { k: "qualify", ic: "spark", d: "Lead score hit 92 — matched your ready-to-buy rule." },
      { k: "reply", ic: "reply", d: "Answered her question and sent a checkout nudge." },
      { k: "objection", ic: "shield", d: "She asked about refunds; AI shared your 7-day guarantee." },
      { k: "paid", ic: "coin", d: "$390 via USDT TRC20 — access unlocked automatically." },
    ],
    convo: [{ me: false, x: "Does the course cover advanced topics?" }, { me: true, x: "Yes — modules 6 to 9 are all advanced. Want the checkout link?" }, { me: false, x: "yes please" }, { me: true, x: "Here you go 👇 — and you're covered by a 7-day money-back guarantee." }] },
  { who: "Olga V.", amount: 890, gw: "Telegram Stars", conf: 91, whenKey: "h5", auto: true,
    signals: ["Viewed the VIP plan", "Went quiet for 12 days", "Replied to a win-back"],
    timeline: [
      { k: "detect", ic: "eye", d: "Olga viewed your VIP plan, then went quiet for 12 days." },
      { k: "qualify", ic: "spark", d: "Flagged as a win-back opportunity worth re-engaging." },
      { k: "reply", ic: "reply", d: "Sent a time-boxed 20% win-back offer." },
      { k: "objection", ic: "shield", d: "Confirmed the offer was valid for 48 hours only." },
      { k: "paid", ic: "coin", d: "$890 via Telegram Stars — instant, in-app." },
    ],
    convo: [{ me: true, x: "Saw you were eyeing the VIP plan — here's 20% off, just for the next 48h 👇" }, { me: false, x: "is it the full plan?" }, { me: true, x: "Yes, full VIP access. Tap to claim before it expires." }, { me: false, x: "done ✅" }] },
  { who: "Mehdi K.", amount: 179, gw: "ZarinPal", conf: 87, whenKey: "yday", auto: false,
    signals: ["Compared Start vs Pro", "Asked for a discount", "You approved the reply"],
    timeline: [
      { k: "detect", ic: "eye", d: "Mehdi compared the Start and Pro plans twice." },
      { k: "qualify", ic: "spark", d: "Likely buyer, but asked for a discount — flagged for you." },
      { k: "reply", ic: "reply", d: "You approved the AI's drafted reply with a small offer." },
      { k: "objection", ic: "shield", d: "AI clarified what Pro includes over Start." },
      { k: "paid", ic: "coin", d: "$179 via ZarinPal — Pro access activated." },
    ],
    convo: [{ me: false, x: "any discount if I go Pro?" }, { me: true, x: "I can do 10% on your first month of Pro — want me to apply it?" }, { me: false, x: "yes" }, { me: true, x: "Applied ✅ here's your secure ZarinPal link." }] },
];
