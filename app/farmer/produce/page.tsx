"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Plus, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { MarketplaceService } from "@/lib/services";
import { type ProduceListing } from "@/lib/store";
import { useLanguage, rupees } from "@/components/site/language-context";

export default function FarmerProducePage() {
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const { lang } = useLanguage();

  useEffect(() => {
    MarketplaceService.getListings().then((all) => {
      // Ensure rice items explicitly reference /basmati.jpg
      const updatedListings = all.map((item) => {
        if (
          item.productName.toLowerCase().includes("rice") ||
          item.productName.toLowerCase().includes("basmati")
        ) {
          return { ...item, image: "/basmati.jpg" };
        }
        return item;
      });
      setListings(updatedListings);
    });
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E2E7E2]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16803A]">
            {lang === "hi" ? "मेरी उपज और इन्वेंट्री" : "MY PRODUCE & INVENTORY"}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#172019]">
            {lang === "hi" ? "सक्रिय उपज लिस्टिंग्स" : "Active Produce Listings"}
          </h1>
          <p className="text-xs text-[#687D6B]">
            {lang === "hi"
              ? "अपनी उपज की मात्रा, मूल्य और खरीदार मांग की स्थिति प्रबंधित करें।"
              : "Manage harvest batches, expected prices, and verified marketplace availability."}
          </p>
        </div>

        <Link
          href="/farmer/produce/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#16803A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs"
        >
          <Plus className="size-4" />
          {lang === "hi" ? "नई उपज लिस्ट करें" : "List New Produce"}
        </Link>
      </div>

      {/* Listings Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((item) => {
          // Fallback image override check during render
          const displayImage =
            item.productName.toLowerCase().includes("rice") ||
            item.productName.toLowerCase().includes("basmati")
              ? "/basmati.jpg"
              : item.image;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-[#E2E7E2] bg-white shadow-xs transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full bg-[#EEF7EF]">
                  <img
                    src={displayImage}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#172019] shadow-xs backdrop-blur-xs">
                    Grade {item.grade}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-[#EEF7EF] px-2.5 py-1 text-xs font-bold text-[#16803A] shadow-xs backdrop-blur-xs">
                    ✓ Verified
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#172019]">
                        {lang === "hi" ? item.productNameHi : item.productName}
                      </h3>
                      <p className="text-xs text-[#687D6B]">
                        {item.availableQuantity} {item.unit} available
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#687D6B]">Your Rate</span>
                      <p className="text-xl font-bold text-[#16803A]">
                        {rupees(item.pricePerKg)}
                        <span className="text-xs font-normal text-[#687D6B]">/{item.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#687D6B] border-t border-[#E2E7E2] pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-[#16803A]" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Harvest Date:</span>
                      <span className="font-medium text-[#172019]">{item.harvestDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability Window:</span>
                      <span className="font-medium text-[#172019]">
                        {item.availabilityWindow.from} – {item.availabilityWindow.to}
                      </span>
                    </div>
                  </div>

                  {/* Realization breakdown pill */}
                  <div className="rounded-xl bg-[#EEF7EF] p-2.5 text-xs text-[#172019] flex justify-between items-center">
                    <span className="text-[11px] text-[#687D6B]">Est. Farmer Realization:</span>
                    <span className="font-bold text-[#16803A]">{rupees(item.farmerRealizationPerKg)}/kg</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#E2E7E2] bg-[#FAFAF7] flex items-center justify-between">
                <span className="text-[11px] text-[#687D6B]">Status: Active Market Feed</span>
                <Link
                  href={`/marketplace/${item.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#16803A] hover:underline"
                >
                  View Public Listing <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}