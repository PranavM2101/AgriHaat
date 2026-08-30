"use client";

import { CheckCircle2, XCircle, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "@/components/site/language-context";

export function MandiComparison() {
  const { lang } = useLanguage();

  const comparisonRows = [
    {
      feature: lang === "hi" ? "बिचौलिया कमीशन (Intermediary Cut)" : "Broker Commission & Cuts",
      traditional: lang === "hi" ? "25% – 40% आढ़तिया कमीशन और कटौती" : "25% – 40% deducted by multiple intermediaries",
      agrihaat: lang === "hi" ? "0% ब्रोकर कमीशन (सीधा खेत से खरीदार)" : "0% Brokerage (100% Direct Farm-to-Buyer)",
      highlight: true,
    },
    {
      feature: lang === "hi" ? "किसान शुद्ध प्राप्ति (₹40/kg बिक्री पर)" : "Net Farmer Realization (On ₹40/kg trade)",
      traditional: lang === "hi" ? "मात्र ₹24 – ₹26 / kg किसान को मिलता है" : "Only ₹24 – ₹26 / kg reaches the farmer",
      agrihaat: lang === "hi" ? "₹36 / kg शुद्ध बैंक खाते में जमा" : "₹36.00 / kg net direct DBT realization",
      highlight: true,
    },
    {
      feature: lang === "hi" ? "भुगतान चक्र (Payment Settlement)" : "Payment Settlement Speed",
      traditional: lang === "hi" ? "15 से 45 दिन की उधारी और भुगतान का जोखिम" : "15 to 45 days credit delay with high payment risk",
      agrihaat: lang === "hi" ? "क्वालिटी अप्रूवल के तुरंत बाद डायरेक्ट DBT बैंक ट्रांसफर" : "Instant direct DBT bank payout upon scale check",
      highlight: false,
    },
    {
      feature: lang === "hi" ? "परिवहन और लॉजिस्टिक्स" : "Logistics & Supply Aggregation",
      traditional: lang === "hi" ? "किसान अपनी जेब से अलग-अलग वाहन का किराया देता है" : "Each farmer independently pays uncoordinated transport",
      agrihaat: lang === "hi" ? "AI मल्टी-स्टॉप क्लस्टर पिकअप (18 km बचत/ट्रिप)" : "Automated multi-farm route clustering (-18 km saved)",
      highlight: false,
    },
    {
      feature: lang === "hi" ? "मंडी कतार और वजन (Procurement Queue)" : "Procurement Weighbridge & Queue",
      traditional: lang === "hi" ? "मंडी गेट पर 8-12 घंटे की अनिश्चित कतार और वजन में हेरफेर" : "8–12 hrs manual queue with arbitrary weighbridge cuts",
      agrihaat: lang === "hi" ? "डिजिटल टोकन स्लॉट बुकिंग + लाइव QR चेक-इन (42 मिनट)" : "Digital token pass (#42) + electronic scale audit",
      highlight: false,
    },
    {
      feature: lang === "hi" ? "मूल्य निर्धारण (Price Transparency)" : "Price Discovery & AI Intelligence",
      traditional: lang === "hi" ? "लोकल आढ़तिया अपनी मनमर्जी से दाम तय करता है" : "Opaque local cartels fix unilateral farm gate rates",
      agrihaat: lang === "hi" ? "Google Gemini और लाइव 7-दिवसीय मांग पूर्वानुमान" : "Grounded Google Gemini AI mandi demand trends",
      highlight: false,
    },
  ];

  return (
    <section id="comparison" className="border-t border-[#E2E7E2] bg-white py-20 lg:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <span className="rounded-full bg-[#16803A]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#16803A]">
              {lang === "hi" ? "पारंपरिक मंडी बनाम AgriHaat AI" : "MANDI VS AGRIHAAT AI"}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#172019] sm:text-4xl">
              {lang === "hi"
                ? "बिचौलियों के चंगुल से मुक्ति: अधिक कमाई, पारदर्शी व्यापार"
                : "Eliminating Middlemen: 18-25% Higher Farmer Realization"}
            </h2>
            <p className="mt-3 text-sm text-[#687D6B] max-w-2xl mx-auto leading-relaxed">
              {lang === "hi"
                ? "पारंपरिक APMC व्यवस्था में बिचौलिए और कमीशन एजेंट किसान की मेहनत का बड़ा हिस्सा काट लेते हैं। AgriHaat AI सीधा डिजिटल सेतु बनाता है।"
                : "In conventional agricultural supply chains, 3 to 5 levels of intermediaries take up to 40% margin while delaying payments. AgriHaat AI delivers direct market transparency."}
            </p>
          </ScrollReveal>
        </div>

        {/* Comparison Table Card */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-[#E2E7E2] bg-[#FAFAF7] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#E2E7E2] bg-[#EEF7EF]/60">
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-[#172019] w-1/3">
                    Parameter / Aspect
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-[#dc2626] w-1/3">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-4" />
                      <span>Traditional Middlemen Mandi</span>
                    </div>
                  </th>
                  <th className="p-5 sm:p-6 text-xs font-bold uppercase tracking-wider text-[#16803A] bg-[#16803A]/10 w-1/3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-[#16803A]" />
                      <span>AgriHaat AI Direct Platform</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7E2] text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition hover:bg-white ${
                      row.highlight ? "bg-white/80 font-medium" : ""
                    }`}
                  >
                    <td className="p-5 sm:p-6 font-semibold text-[#172019] align-top">
                      {row.feature}
                    </td>
                    <td className="p-5 sm:p-6 text-[#687D6B] align-top">
                      <div className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-[#dc2626] shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="p-5 sm:p-6 text-[#172019] bg-[#16803A]/5 align-top font-medium">
                      <div className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-[#16803A] shrink-0" />
                        <span className="text-[#0B4B22] font-semibold">{row.agrihaat}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Callout in Comparison */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E7E2] bg-white p-6 sm:px-8">
            <div>
              <p className="text-xs font-bold text-[#172019]">
                {lang === "hi" ? "सीधे अपनी उपज को लिस्ट करें और अधिकतम भाव पाएं" : "Ready to eliminate middleman cuts on your next harvest?"}
              </p>
              <p className="text-[11px] text-[#687D6B]">
                {lang === "hi" ? "कोई अग्रिम शुल्क नहीं · पारदर्शी मूल्य · तुरंत DBT निपटान" : "Zero upfront fees · Real-time Gemini Mandi Index · Instant Direct Bank Settlement"}
              </p>
            </div>
            <Link
              href="/auth/login"
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#16803A] px-6 text-xs font-bold text-white shadow-xs hover:bg-[#16803A]/90 transition shrink-0"
            >
              <span>{lang === "hi" ? "मुफ़्त में शुरू करें" : "Start Direct Trading"}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
