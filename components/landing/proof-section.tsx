"use client";

import { useLanguage } from "@/components/site/language-context";
import { FarmerRealizationCard } from "./farmer-realization-card";
import { DemandCard } from "./demand-card";
import { ScrollReveal } from "./scroll-reveal";

export function ProofSection() {
  const { t } = useLanguage();

  return (
    <section id="proof" className="w-full max-w-full overflow-hidden border-y border-[#E2E7E2] bg-[#EEF7EF] py-16 sm:py-20 lg:py-28">
      {/* Explicit Tailwind container matching Navbar and HeroSection */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <ScrollReveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16803A]">
              {t.priceTransparency}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#172019] sm:text-4xl lg:text-5xl">
              {t.betterDecisions}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mt-4 text-base leading-relaxed text-[#687D6B] sm:text-lg">
              {t.betterDecisionsSub}
            </p>
          </ScrollReveal>
        </div>

        {/* Two Major UI Cards */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <ScrollReveal delay={300}>
            <FarmerRealizationCard />
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <DemandCard />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}