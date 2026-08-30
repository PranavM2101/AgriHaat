"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/site/language-context";
import { ScrollReveal } from "./scroll-reveal";

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section id="get-started" className="relative overflow-hidden bg-[#07110B] py-24 lg:py-32 text-white border-t border-[#172019]">
      {/* Background glow & subtle pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#16803A]/20 blur-[120px]" />
      </div>

      <div className="section-container text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#16A34A]">
            {t.readyToStart}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl text-white">
            {t.moveProduce}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
            {t.moveProduceSub}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/login"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#16803A] px-8 text-sm font-semibold text-white shadow-lg transition hover:bg-[#16A34A] sm:w-auto"
            >
              {t.getStarted}
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              {t.seeHowItWorks}
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className="mt-8 text-xs text-gray-500">
            No credit card or initial commitment required · Open to all verified Indian agricultural producers & buyers
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
