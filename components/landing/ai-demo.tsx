"use client";

import { ArrowRight, MessageSquare, Send, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/site/language-context";
import { aiChatMessages } from "@/lib/demo-data";
import { ScrollReveal } from "./scroll-reveal";

export function AIDemo() {
  const { t, lang } = useLanguage();

  return (
    <section className="border-t border-[#172019] bg-[#07110B] py-20 lg:py-28 text-white">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-xs">
                <Sparkles className="size-3.5 text-[#16A34A]" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#16A34A]">
                  AI MARKET INTELLIGENCE
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h2 className="mt-5 font-serif text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
                {t.askTheMarket}
                <br />
                <span className="text-[#16A34A]">{t.askTheMarketSub}</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="mt-5 text-base leading-relaxed text-[#687D6B] text-gray-400">
                Natural-language price recommendations and regional harvest intelligence grounded in live mandi rates and verified buyer requirements.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-8">
                <Link
                  href="#get-started"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#16803A] px-7 text-sm font-semibold text-white transition hover:bg-[#16A34A]"
                >
                  {t.tryFarm2Market}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Realistic Chat UI */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={200} direction="left">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#172019] shadow-2xl">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-[#16803A] text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AgriHaat Copilot</p>
                      <p className="text-[11px] text-gray-400">Grounded Agricultural AI</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gemini 2.5 Flash
                  </span>
                </div>

                {/* Chat Stream */}
                <div className="space-y-4 p-5 sm:p-6">
                  {aiChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "ai" && (
                        <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[#16803A] text-white text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#16803A] text-white rounded-br-xs"
                            : "bg-white/10 text-gray-200 rounded-bl-xs border border-white/5"
                        }`}
                      >
                        {lang === "hi" ? msg.textHi : msg.text}
                      </div>
                      {msg.role === "user" && (
                        <div className="grid size-7 shrink-0 place-items-center rounded-full bg-white/20 text-white text-xs">
                          <User className="size-3.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input Placeholder */}
                <div className="border-t border-white/10 p-4 bg-white/5">
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs text-gray-400">
                    <MessageSquare className="size-4 shrink-0" />
                    <span className="flex-1">Ask about Mandi prices, transport rates, or nearby supply...</span>
                    <button type="button" className="grid size-7 place-items-center rounded-lg bg-[#16803A] text-white hover:bg-[#16A34A]" aria-label="Submit message">
                      <Send className="size-3" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-gray-400">
                    Live Agricultural Knowledge Engine · Real-Time Market Intelligence
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
