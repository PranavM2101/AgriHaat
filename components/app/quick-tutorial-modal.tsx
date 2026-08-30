"use client";

import { useState } from "react";
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sprout,
  ShoppingBag,
  CalendarCheck,
  Truck,
  TrendingUp,
  Wallet,
  Building2,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { useLanguage } from "@/components/site/language-context";

export function QuickTutorialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const { lang } = useLanguage();

  const role = user?.role || "farmer";

  const tutorialSteps = {
    farmer: [
      {
        title: lang === "hi" ? "1. अपनी उपज लिस्ट करें (Live Camera)" : "1. List Produce with Camera",
        icon: Sprout,
        desc:
          lang === "hi"
            ? "खेत से सीधे फोटो खींचें, मात्रा (e.g. 500 kg) और अपना मनचाहा भाव (₹32/kg) दर्ज करें। बिचौलिया कटौती 0% है।"
            : "Capture harvest photos directly from your phone, enter quantity and your gate rate (e.g. ₹32/kg). Zero broker cuts.",
      },
      {
        title: lang === "hi" ? "2. स्मार्ट एग्रीगेशन (Multi-Farm Pooling)" : "2. Supply Aggregation",
        icon: ShoppingBag,
        desc:
          lang === "hi"
            ? "जब कोई बड़ा खरीदार 2,000 kg का आर्डर देता है, तो AgriHaat आपके और 2 अन्य नजदीकी किसानों के माल को एक साथ जोड़ देता है।"
            : "When institutional buyers order bulk produce, AgriHaat pools your produce with nearby verified farms into a single order.",
      },
      {
        title: lang === "hi" ? "3. डिजिटल खरीद केंद्र स्लॉट (Token #42)" : "3. Digital Procurement Pass",
        icon: CalendarCheck,
        desc:
          lang === "hi"
            ? "मंडी में घंटों कतार में खड़े रहने की जरूरत नहीं। अपना डिजिटल टोकन बुक करें और 42 मिनट के भीतर इलेक्ट्रॉनिक वजन कराएं।"
            : "Eliminate 8-hour mandi queues. Book a digital token slot (#42) with QR check-in and fast electronic weighbridge QC.",
      },
      {
        title: lang === "hi" ? "4. तुरंत DBT बैंक भुगतान" : "4. Instant Direct DBT Bank Payout",
        icon: Wallet,
        desc:
          lang === "hi"
            ? "वजन और क्वालिटी जांच पूरी होते ही ₹36/kg की शुद्ध राशि सीधे आपके बैंक खाते में जमा हो जाती है।"
            : "Instant direct-to-bank electronic transfer upon weighbridge approval with guaranteed ₹36/kg net realization.",
      },
    ],
    buyer: [
      {
        title: lang === "hi" ? "1. सत्यापित खेत उपज खोजें" : "1. Search Verified Produce",
        icon: ShoppingBag,
        desc:
          lang === "hi"
            ? "सीधे किसानों और FPOs से ग्रेड A व ग्रेड B उपज खरीदें, बिना किसी मंडी एजेंट कमीशन के।"
            : "Source farm-fresh produce directly from verified farmers and FPOs with zero commission markup.",
      },
      {
        title: lang === "hi" ? "2. मल्टी-फार्म क्लस्टर ऑर्डरिंग" : "2. Multi-Farm Cluster Aggregation",
        icon: Truck,
        desc:
          lang === "hi"
            ? "एक क्लिक में 3 अलग-अलग खेतों से 2,000 kg माल को एक ही ट्रक में कंसॉलिडेट करके मंगाएं।"
            : "Consolidate volume across multiple regional farm clusters into a single unified truck delivery run.",
      },
      {
        title: lang === "hi" ? "3. कोल्ड-चेन लाइव ट्रैकिंग" : "3. Reefer Cold-Chain Tracking",
        icon: ShieldCheck,
        desc:
          lang === "hi"
            ? "वाहन का लाइव GPS और रेफ्रिजरेटेड तापमान (+12°C से +15°C) अपने डैशबोर्ड पर ट्रैक करें।"
            : "Track live telemetry and continuous reefer temperature compliance directly to your kitchen door.",
      },
    ],
    hub: [
      {
        title: lang === "hi" ? "1. मल्टी-स्टॉप रूट ऑप्टिमाइज़ेशन" : "1. Multi-Stop Route Optimization",
        icon: Truck,
        desc:
          lang === "hi"
            ? "AI रूट एल्गोरिथम किसान A और किसान B से एक ही फेरे में माल उठाकर 18 किमी की ईंधन बचत करता है।"
            : "AI routes vehicles to pickup from Farmer A and Farmer B in a single dispatch, saving ~18 km per trip.",
      },
      {
        title: lang === "hi" ? "2. डिजिटल वेब्रिज व QR चेक-इन" : "2. Weighbridge & QR Check-in",
        icon: Building2,
        desc:
          lang === "hi"
            ? "आने वाले किसानों के टोकन QR स्कैन करें और इलेक्ट्रॉनिक वजन डेटा को तुरंत सर्वर पर सिंक करें।"
            : "Scan farmer pass QR codes at gate arrival and automatically sync electronic weighbridge readings.",
      },
    ],
    admin: [
      {
        title: lang === "hi" ? "1. संपूर्ण प्लेटफॉर्म निरीक्षण" : "1. Full Platform Oversight",
        icon: ShieldCheck,
        desc:
          lang === "hi"
            ? "सभी किसानों, खरीदारों, खरीद केंद्रों और ट्रकों का लाइव ऑडिट और शिकायत निवारण प्रबंधन करें।"
            : "Monitor all live trade flows, procurement centres, driver routes, and user KYC verifications.",
      },
      {
        title: lang === "hi" ? "2. Google Gemini AI डिमांड मॉडल" : "2. Gemini Mandi Forecasts",
        icon: Bot,
        desc:
          lang === "hi"
            ? "7-दिवसीय मांग मॉडल और मंडी दरों के एआई इंडेक्स की सटीकता की निगरानी करें।"
            : "Inspect 7-day regional demand forecasts and AI price recommendation engine accuracy.",
      },
    ],
  };

  const currentSteps = tutorialSteps[role as keyof typeof tutorialSteps] || tutorialSteps.farmer;
  const stepData = currentSteps[currentStep] || currentSteps[0];
  const StepIcon = stepData.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCurrentStep(0);
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 rounded-full border border-[#E2E7E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#172019] shadow-2xs hover:bg-[#EEF7EF] hover:border-[#16803A] transition"
        title="Interactive Platform Guide"
      >
        <HelpCircle className="size-3.5 text-[#16803A]" />
        <span className="hidden sm:inline">{lang === "hi" ? "मार्गदर्शिका" : "How it Works"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-3xl border border-[#E2E7E2] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E7E2] px-6 py-4 bg-[#EEF7EF]/50">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-[#16803A] text-white">
                  <StepIcon className="size-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#172019]">
                    {lang === "hi" ? "AgriHaat इंटरएक्टिव गाइड" : "AgriHaat Interactive Walkthrough"}
                  </h3>
                  <p className="text-[11px] text-[#687D6B] capitalize">
                    {role} Workspace Guide · Step {currentStep + 1} of {currentSteps.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-8 place-items-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Step Body */}
            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-[#16803A]/20 bg-[#EEF7EF]/40 p-5">
                <h4 className="font-serif text-base font-bold text-[#172019] mb-2">
                  {stepData.title}
                </h4>
                <p className="text-xs leading-relaxed text-[#687D6B]">
                  {stepData.desc}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {currentSteps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentStep(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStep ? "w-6 bg-[#16803A]" : "w-1.5 bg-[#E2E7E2]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between border-t border-[#E2E7E2] px-6 py-3.5 bg-[#FAFAF7]">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((c) => Math.max(0, c - 1))}
                className="flex items-center gap-1 rounded-full border border-[#E2E7E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#172019] disabled:opacity-40 hover:bg-[#EEF7EF] transition"
              >
                <ChevronLeft className="size-3.5" /> {lang === "hi" ? "पिछला" : "Previous"}
              </button>

              {currentStep < currentSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((c) => Math.min(currentSteps.length - 1, c + 1))}
                  className="flex items-center gap-1 rounded-full bg-[#16803A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#16803A]/90 transition"
                >
                  {lang === "hi" ? "अगला" : "Next"} <ChevronRight className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 rounded-full bg-[#16803A] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#16803A]/90 transition"
                >
                  <CheckCircle2 className="size-3.5" /> {lang === "hi" ? "शुरू करें" : "Got it!"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
