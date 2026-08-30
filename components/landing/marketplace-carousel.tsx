"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage, rupees } from "@/components/site/language-context";
import { produceListings } from "@/lib/demo-data";
import { ScrollReveal } from "./scroll-reveal";

export function MarketplaceCarousel() {
  const { t, lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const cardWidth = 320;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % produceListings.length;
    scrollToIndex(next);
  };

  const handlePrev = () => {
    const prev = (activeIndex - 1 + produceListings.length) % produceListings.length;
    scrollToIndex(prev);
  };

  return (
    <section id="marketplace" className="py-20 lg:py-28">
      <div className="section-container">
        {/* Header & Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <ScrollReveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#16803A]">
              {t.marketplace}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#172019] sm:text-4xl">
              {t.whatsMoving}
            </h2>
          </ScrollReveal>

          {/* Carousel arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="grid size-10 place-items-center rounded-full border border-[#E2E7E2] bg-white text-[#172019] shadow-xs transition hover:bg-[#EEF7EF]"
              aria-label="Previous listing"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={handleNext}
              className="grid size-10 place-items-center rounded-full border border-[#E2E7E2] bg-white text-[#172019] shadow-xs transition hover:bg-[#EEF7EF]"
              aria-label="Next listing"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="mt-10 flex gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory"
        >
          {produceListings.map((item, idx) => (
            <div
              key={item.id}
              className="w-[280px] shrink-0 snap-start rounded-2xl border border-[#E2E7E2] bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:w-[310px]"
            >
              {/* Product Image */}
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-[#EEF7EF]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2.5 top-2.5 rounded bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-[#172019] backdrop-blur-xs">
                  Grade {item.grade}
                </span>
              </div>

              {/* Title & Quantity */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#172019]">
                    {lang === "hi" ? item.nameHi : item.name}
                  </h3>
                  <p className="text-xs text-[#687D6B]">
                    Grade {item.grade} · {item.quantity} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#16803A]">
                    {rupees(item.price)}
                    <span className="text-xs font-normal text-[#687D6B]">/{item.unit}</span>
                  </p>
                </div>
              </div>

              {/* Location & Seller */}
              <div className="mt-4 space-y-1.5 border-t border-[#E2E7E2] pt-3 text-xs text-[#687D6B]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-[#16803A]" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{item.seller}</span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-[#16803A]">
                    <ShieldCheck className="size-3" />
                    {t.verified}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/marketplace/${item.id}`}
                className="mt-4 block text-center w-full rounded-full border border-[#E2E7E2] bg-white py-2 text-xs font-semibold text-[#172019] transition hover:bg-[#16803A] hover:text-white hover:border-[#16803A]"
              >
                {t.viewDetails}
              </Link>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {produceListings.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex ? "w-6 bg-[#16803A]" : "w-2 bg-[#E2E7E2]"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
