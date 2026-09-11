"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/site/language-context";
import { HeroProductCard } from "./hero-product-card";
import { ScrollReveal } from "./scroll-reveal";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full max-w-full overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* Background agricultural visual with soft overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF7]/60 via-[#FAFAF7]/90 to-[#FAFAF7]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Editorial Copy */}
          <div className="w-full lg:col-span-6 xl:col-span-7">
            <ScrollReveal>
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#E2E7E2] bg-white/80 px-3 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-xs">
                <span className="size-2 shrink-0 rounded-full bg-[#16803A]" />
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.18em] text-[#16803A]">
                  {t.heroEyebrow}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.18] tracking-tight text-[#172019] sm:mt-6 sm:text-5xl lg:text-5xl xl:text-[3.75rem]">
                {t.heroLine1}
                <br className="hidden sm:inline" />{" "}
                <span className="font-medium text-[#16803A]">{t.heroLine2}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#687D6B] sm:mt-6 sm:text-base lg:text-lg">
                {t.heroSub}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <Link
                  href="#marketplace"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#16803A] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16803A]/90 sm:h-12 sm:px-7"
                >
                  {t.exploreMarketplace}
                  <ArrowRight className="ml-2 size-4 shrink-0" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#E2E7E2] bg-white px-6 text-sm font-semibold text-[#172019] transition hover:bg-[#EEF7EF] sm:h-12 sm:px-7"
                >
                  {t.seeHowItWorks}
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="mt-8 flex flex-col gap-2.5 border-t border-[#E2E7E2] pt-6 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#172019]">
                  <CheckCircle2 className="size-4 shrink-0 text-[#16803A]" />
                  <span>{t.trustBuilt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#172019]">
                  <CheckCircle2 className="size-4 shrink-0 text-[#16803A]" />
                  <span>{t.trustPricing}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#172019]">
                  <CheckCircle2 className="size-4 shrink-0 text-[#16803A]" />
                  <span>{t.trustLogistics}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Product UI */}
          <div className="w-full lg:col-span-6 xl:col-span-5">
            <ScrollReveal delay={200} direction="left">
              <HeroProductCard />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}