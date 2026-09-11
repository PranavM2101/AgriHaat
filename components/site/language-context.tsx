"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Supported languages ───
export type Language = "en" | "hi";

// ─── Devanagari Numeral Conversion Utility ───
export function toHindiNumerals(num: number | string): string {
  if (num === null || num === undefined) return "";
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num).replace(/\d/g, (digit) => hindiDigits[parseInt(digit, 10)]);
}

// ─── Translation keys ───
export interface Translations {
  // Navbar
  home: string;
  howItWorks: string;
  marketplace: string;
  forFarmers: string;
  forBuyers: string;
  about: string;
  getStarted: string;

  // Hero
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  exploreMarketplace: string;
  seeHowItWorks: string;
  trustBuilt: string;
  trustPricing: string;
  trustLogistics: string;

  // Proof / Insight
  priceTransparency: string;
  betterDecisions: string;
  betterDecisionsSub: string;
  farmerRealization: string;
  perKg: string;
  buyerPrice: string;
  logistics: string;
  platformFee: string;
  estimatedRealization: string;
  demandOutlook: string;
  expectedDemand: string;
  demandTrend: string;
  confidence: string;
  recommendation: string;

  // Carousel
  whatsMoving: string;
  viewDetails: string;
  verified: string;

  // Product tabs
  listings: string;
  demand: string;
  prices: string;
  logisticsTab: string;

  // Logistics section
  smartLogistics: string;
  oneOrder: string;
  oneOrderSub: string;
  seeExampleRoute: string;

  // Earnings
  knowWhatReaches: string;
  viewEarnings: string;
  expectedPayout: string;

  // Buyer
  reviewSupply: string;
  matched: string;
  estimatedDelivery: string;
  availableNearby: string;

  // Interactive route
  seeHowOneOrder: string;
  moveMouseRoute: string;

  // FAQ
  faqHeading: string;

  // Testimonials
  illustrativeScenario: string;

  // AI Demo
  askTheMarket: string;
  askTheMarketSub: string;
  tryFarm2Market: string;
  protoAiLabel: string;

  // Final CTA
  readyToStart: string;
  moveProduce: string;
  moveProduceSub: string;

  // Footer
  footerDesc: string;
  product: string;
  company: string;
  support: string;
  stayUpdated: string;
  stayUpdatedSub: string;
  enterEmail: string;
  subscribe: string;
  copyright: string;
  madeInIndia: string;
  footerTagline: string;

  // Misc
  addToOrder: string;
  quantity: string;
  searchProduce: string;
  nearbyDemand: string;
  illustrativeDemo: string;
  prototypeDemo: string;
}

const en: Translations = {
  home: "Home",
  howItWorks: "How it works",
  marketplace: "Marketplace",
  forFarmers: "For Farmers",
  forBuyers: "For Buyers",
  about: "About",
  getStarted: "Get Started",

  heroEyebrow: "DIRECT AGRICULTURAL MARKETPLACE",
  heroLine1: "From the farm,",
  heroLine2: "straight to the market.",
  heroSub: "AgriHaat connects farmers and FPOs directly with buyers, then coordinates demand, aggregation and logistics so produce can move with fewer unnecessary intermediaries.",
  exploreMarketplace: "Explore Marketplace",
  seeHowItWorks: "See How It Works",
  trustBuilt: "Built for farmers, FPOs and verified buyers",
  trustPricing: "Transparent pricing and earnings",
  trustLogistics: "Smarter logistics and demand insights",

  priceTransparency: "PRICE TRANSPARENCY",
  betterDecisions: "Better decisions start with better visibility.",
  betterDecisionsSub: "AgriHaat brings supply, demand, pricing and logistics into one workflow — so farmers can decide what to sell, buyers can plan what to source, and the platform can coordinate what moves where.",
  farmerRealization: "Farmer realization",
  perKg: "per kg",
  buyerPrice: "Buyer price",
  logistics: "Logistics",
  platformFee: "Platform fee",
  estimatedRealization: "Estimated farmer realization",
  demandOutlook: "Demand outlook",
  expectedDemand: "Expected demand · next 7 days",
  demandTrend: "Demand trend",
  confidence: "Confidence",
  recommendation: "Recommendation",

  whatsMoving: "What's moving today.",
  viewDetails: "View Details",
  verified: "Verified",

  listings: "Listings",
  demand: "Demand",
  prices: "Prices",
  logisticsTab: "Logistics",

  smartLogistics: "SMART LOGISTICS",
  oneOrder: "One order. Multiple farms. One coordinated pickup.",
  oneOrderSub: "When several nearby farmers can fulfill the same buyer order, AgriHaat can aggregate the supply and coordinate pickup instead of sending separate shipments.",
  seeExampleRoute: "See an example route",

  knowWhatReaches: "Know what reaches you.",
  viewEarnings: "View earnings",
  expectedPayout: "Expected payout",

  reviewSupply: "Review supply",
  matched: "Matched",
  estimatedDelivery: "Estimated delivery",
  availableNearby: "Available nearby",

  seeHowOneOrder: "See how one order comes together.",
  moveMouseRoute: "Move your mouse over the route.",

  faqHeading: "Questions farmers and buyers actually ask.",

  illustrativeScenario: "Illustrative scenario",

  askTheMarket: "Ask the market.",
  askTheMarketSub: "Understand the next move.",
  tryFarm2Market: "Try AgriHaat",
  protoAiLabel: "Prototype AI interaction · demo data",

  readyToStart: "READY TO START?",
  moveProduce: "Move produce more directly.",
  moveProduceSub: "Join farmers, FPOs and buyers building a more transparent and efficient food supply chain.",

  footerDesc: "Connecting Indian farmers and buyers for a fairer, more efficient food system.",
  product: "Product",
  company: "Company",
  support: "Support",
  stayUpdated: "Stay updated",
  stayUpdatedSub: "Get the latest updates about new features and opportunities.",
  enterEmail: "Enter your email",
  subscribe: "Subscribe",
  copyright: "© 2026 AgriHaat AI. All rights reserved.",
  madeInIndia: "Made in India 🇮🇳",
  footerTagline: "खेत से सप्लाई | A stronger food future.",

  addToOrder: "Add to order",
  quantity: "Quantity",
  searchProduce: "Search produce...",
  nearbyDemand: "Nearby demand",
  illustrativeDemo: "Illustrative demo data",
  prototypeDemo: "Prototype forecast · demo data",
};

const hi: Translations = {
  home: "होम",
  howItWorks: "यह कैसे काम करता है",
  marketplace: "मार्केटप्लेस",
  forFarmers: "किसानों के लिए",
  forBuyers: "खरीदारों के लिए",
  about: "हमारे बारे में",
  getStarted: "शुरू करें",

  heroEyebrow: "सीधा कृषि मार्केटप्लेस",
  heroLine1: "खेत से सीधे,",
  heroLine2: "बाज़ार तक!",
  heroSub: "AgriHaat किसानों और FPOs को खरीदारों से सीधे जोड़ता है, फिर मांग, संग्रह और लॉजिस्टिक्स का समन्वय करता है ताकि उपज कम बिचौलियों के साथ आगे बढ़ सके।",
  exploreMarketplace: "मार्केटप्लेस देखें",
  seeHowItWorks: "कैसे काम करता है देखें",
  trustBuilt: "किसानों, FPOs और सत्यापित खरीदारों के लिए बनाया गया",
  trustPricing: "पारदर्शी मूल्य और कमाई",
  trustLogistics: "स्मार्ट लॉजिस्टिक्स और मांग अंतर्दृष्टि",

  priceTransparency: "मूल्य पारदर्शिता",
  betterDecisions: "बेहतर जानकारी से बेहतर फैसले।",
  betterDecisionsSub: "AgriHaat आपूर्ति, मांग, मूल्य और लॉजिस्टिक्स को एक वर्कफ़्लो में लाता है — ताकि किसान तय करें क्या बेचना है, खरीदार योजना बनाएं क्या खरीदना है।",
  farmerRealization: "किसान की प्राप्ति",
  perKg: "प्रति किलो",
  buyerPrice: "खरीदार मूल्य",
  logistics: "लॉजिस्टिक्स",
  platformFee: "प्लेटफ़ॉर्म शुल्क",
  estimatedRealization: "अनुमानित किसान प्राप्ति",
  demandOutlook: "मांग का दृष्टिकोण",
  expectedDemand: "अपेक्षित मांग · अगले 7 दिन",
  demandTrend: "मांग रुझान",
  confidence: "विश्वसनीयता",
  recommendation: "सुझाव",

  whatsMoving: "आज क्या चल रहा है।",
  viewDetails: "विवरण देखें",
  verified: "सत्यापित",

  listings: "लिस्टिंग",
  demand: "मांग",
  prices: "कीमतें",
  logisticsTab: "लॉजिस्टिक्स",

  smartLogistics: "स्मार्ट लॉजिस्टिक्स",
  oneOrder: "एक ऑर्डर। कई खेत। एक समन्वित पिकअप।",
  oneOrderSub: "जब कई नजदीकी किसान एक ही खरीदार का ऑर्डर पूरा कर सकते हैं, AgriHaat आपूर्ति जोड़कर अलग-अलग शिपमेंट भेजने के बजाय पिकअप का समन्वय कर सकता है।",
  seeExampleRoute: "उदाहरण मार्ग देखें",

  knowWhatReaches: "जानें आपको क्या मिलता है।",
  viewEarnings: "कमाई देखें",
  expectedPayout: "अपेक्षित भुगतान",

  reviewSupply: "आपूर्ति की समीक्षा करें",
  matched: "मिलान",
  estimatedDelivery: "अनुमानित डिलीवरी",
  availableNearby: "नजदीक उपलब्ध",

  seeHowOneOrder: "देखें एक ऑर्डर कैसे पूरा होता है।",
  moveMouseRoute: "मार्ग पर माउस ले जाएं।",

  faqHeading: "किसान और खरीदार वास्तव में क्या पूछते हैं।",

  illustrativeScenario: "सांकेतिक परिदृश्य",

  askTheMarket: "बाज़ार से पूछें।",
  askTheMarketSub: "अगला कदम समझें।",
  tryFarm2Market: "AgriHaat आज़माएं",
  protoAiLabel: "प्रोटोटाइप AI इंटरैक्शन · डेमो डेटा",

  readyToStart: "शुरू करने के लिए तैयार?",
  moveProduce: "उपज को अधिक सीधे ले जाएं।",
  moveProduceSub: "किसानों, FPOs और खरीदारों के साथ एक अधिक पारदर्शी और कुशल खाद्य आपूर्ति श्रृंखला बनाएं।",

  footerDesc: "भारतीय किसानों और खरीदारों को जोड़ना — एक बेहतर, अधिक कुशल खाद्य प्रणाली के लिए।",
  product: "उत्पाद",
  company: "कंपनी",
  support: "सहायता",
  stayUpdated: "अपडेट रहें",
  stayUpdatedSub: "नई सुविधाओं और अवसरों के बारे में नवीनतम अपडेट प्राप्त करें।",
  enterEmail: "अपना ईमेल दर्ज करें",
  subscribe: "सदस्यता लें",
  copyright: "© 2026 AgriHaat AI. सर्वाधिकार सुरक्षित।",
  madeInIndia: "भारत में निर्मित 🇮🇳",
  footerTagline: "खेत से सप्लाई | एक मजबूत खाद्य भविष्य।",

  addToOrder: "ऑर्डर में जोड़ें",
  quantity: "मात्रा",
  searchProduce: "उपज खोजें...",
  nearbyDemand: "नजदीकी मांग",
  illustrativeDemo: "सांकेतिक डेमो डेटा",
  prototypeDemo: "प्रोटोटाइप पूर्वानुमान · डेमो डेटा",
};

const translations: Record<Language, Translations> = { en, hi };

// ─── Context ───
interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  formatNumber: (num: number | string) => string;
  rupees: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => undefined,
  t: en,
  formatNumber: (num) => String(num),
  rupees: (val) => `₹${val.toLocaleString("en-IN")}`,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const formatNumber = useCallback(
    (num: number | string) => {
      if (lang === "hi") {
        return toHindiNumerals(num);
      }
      return String(num);
    },
    [lang]
  );

  const rupees = useCallback(
    (amount: number) => {
      const formattedNum = amount.toLocaleString("en-IN");
      if (lang === "hi") {
        return `₹${toHindiNumerals(formattedNum)}`;
      }
      return `₹${formattedNum}`;
    },
    [lang]
  );

  const value = {
    lang,
    setLang,
    t: translations[lang],
    formatNumber,
    rupees,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── Standalone exported helper (works reactively with language state if imported from hook) ───
export const rupees = (value?: number | null) => {
  if (value === undefined || value === null || isNaN(value)) {
    return "₹0";
  }
  return `₹${value.toLocaleString("en-IN")}`;
};

// ─── Language dropdown component ───
export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const select = useCallback(
    (l: Language) => {
      setLang(l);
      setOpen(false);
    },
    [setLang]
  );

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <svg className="size-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        </svg>
        <span>{lang === "en" ? "EN" : "हिंदी"}</span>
        <svg className={`size-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-border bg-white shadow-lg" role="listbox">
            <button
              role="option"
              aria-selected={lang === "en"}
              onClick={() => select("en")}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted ${lang === "en" ? "text-primary font-medium" : "text-foreground"}`}
            >
              English
              {lang === "en" && (
                <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
            <button
              role="option"
              aria-selected={lang === "hi"}
              onClick={() => select("hi")}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted ${lang === "hi" ? "text-primary font-medium" : "text-foreground"}`}
            >
              हिंदी
              {lang === "hi" && (
                <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Simple toggle (for mobile nav) ───
export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="language-toggle" aria-label="Choose language">
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
      <button className={lang === "hi" ? "active" : ""} onClick={() => setLang("hi")}>हिंदी</button>
    </div>
  );
}