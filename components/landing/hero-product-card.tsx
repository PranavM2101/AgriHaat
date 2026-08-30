"use client";

import { useState } from "react";
import { Check, MapPin, Minus, Plus, ShieldCheck, TrendingUp } from "lucide-react";
import { useLanguage, rupees } from "@/components/site/language-context";
import { demandForecast } from "@/lib/demo-data";

export function HeroProductCard() {
  const [quantity, setQuantity] = useState(200);
  const { lang, t } = useLanguage();

  return (
    <div className="relative mx-auto w-full max-w-[580px] lg:max-w-none">
      {/* Main product card */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-[#E2E7E2] bg-white p-5 shadow-[0_18px_50px_rgba(23,32,25,0.08)] sm:p-6">
        {/* Card Header image & tag */}
        <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl bg-[#EEF7EF] sm:h-56">
          <img
            src="/tomatoes-market.png"
            alt="Fresh Grade A Tomatoes"
            className="h-full w-full object-cover"
          />
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#16803A] shadow-sm backdrop-blur-sm">
            <ShieldCheck className="size-3.5" />
            <span>{t.verified} seller</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16803A]">
                {lang === "hi" ? "टमाटर" : "TOMATOES"}
              </span>
              <h3 className="mt-1 font-serif text-2xl font-semibold text-[#172019]">
                {lang === "hi" ? "टमाटर" : "Tomatoes"}
              </h3>
              <p className="mt-0.5 text-xs text-[#687D6B]">Grade A · 500 kg available</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#687D6B]">Rate</span>
              <p className="text-2xl font-bold text-[#172019]">
                {rupees(32)}
                <span className="text-xs font-normal text-[#687D6B]">/kg</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-y border-[#E2E7E2] py-3 text-xs text-[#687D6B]">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[#16803A]" />
              <span>Kanchipuram, TN</span>
            </div>
            <div className="text-right">
              <span>Harvest: 28 Aug 2026</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-[#16803A]/10 text-center font-bold text-[#16803A] leading-6">
                A
              </div>
              <span className="font-medium text-[#172019]">ABC FPO</span>
            </div>
            <span className="rounded bg-[#EEF7EF] px-2 py-0.5 text-[11px] font-semibold text-[#16803A]">
              ✓ Verified seller
            </span>
          </div>

          {/* Quantity selector & CTA */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <div className="flex h-11 flex-1 items-center justify-between rounded-full border border-[#E2E7E2] px-3 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(50, q - 50))}
                className="grid size-7 place-items-center rounded-full text-[#687D6B] hover:bg-[#EEF7EF] hover:text-[#172019]"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="text-sm font-semibold text-[#172019]">{quantity} kg</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(500, q + 50))}
                className="grid size-7 place-items-center rounded-full text-[#687D6B] hover:bg-[#EEF7EF] hover:text-[#172019]"
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              className="h-11 rounded-full bg-[#16803A] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16803A]/90 sm:w-auto"
            >
              {t.addToOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Floating secondary card: Nearby Demand */}
      <div className="relative -mt-6 ml-auto mr-4 w-[240px] rounded-2xl border border-[#E2E7E2] bg-white p-4 shadow-[0_12px_32px_rgba(23,32,25,0.12)] sm:-mt-10 sm:-mr-6 sm:w-[270px]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16803A]">
            {t.nearbyDemand}
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-[#EEF7EF] px-2 py-0.5 text-[11px] font-semibold text-[#16803A]">
            <TrendingUp className="size-3" /> +{demandForecast.trend}%
          </span>
        </div>
        <div className="mt-2">
          <p className="text-xs text-[#687D6B]">Chennai</p>
          <p className="text-xl font-bold tracking-tight text-[#172019]">
            {demandForecast.expectedDemand.toLocaleString("en-IN")} kg
          </p>
          <p className="text-[11px] text-[#687D6B]">{demandForecast.period}</p>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[#E2E7E2] pt-2 text-[10px] text-[#687D6B]">
          <span>{t.confidence}: {demandForecast.confidence}%</span>
          <span className="font-semibold text-[#16803A]">Real-Time Mandi Index</span>
        </div>
      </div>
    </div>
  );
}
