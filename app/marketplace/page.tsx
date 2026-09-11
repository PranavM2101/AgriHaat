"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { MarketplaceService } from "@/lib/services";
import { type ProduceListing } from "@/lib/store";
import { useLanguage, rupees } from "@/components/site/language-context";
import { useAuth } from "@/components/auth/auth-context";

export default function MarketplacePage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [mode, setMode] = useState<"BUY" | "SELL">(user?.role === "buyer" ? "BUY" : "SELL");
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");

  useEffect(() => {
    MarketplaceService.getListings().then((data) => {
      // Direct image override to ensure Basmati Rice uses /basmati.jpg
      const updatedData = data.map((item) => {
        if (
          item.productName.toLowerCase().includes("rice") ||
          item.productName.toLowerCase().includes("basmati")
        ) {
          return { ...item, image: "/basmati.jpg" };
        }
        return item;
      });
      setListings(updatedData);
    });
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesGrade = selectedGrade === "ALL" || item.grade === selectedGrade;
    return matchesSearch && matchesCat && matchesGrade;
  });

  return (
    <AppShell>
      {/* ─── Header & Mode Toggle ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E2E7E2]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16803A]">
            {lang === "hi" ? "कृषि बाज़ार" : "DIRECT AGRICULTURAL MARKETPLACE"}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#172019]">
            {lang === "hi" ? "लाइव उपज मार्केटप्लेस" : "Live Produce Marketplace"}
          </h1>
          <p className="text-xs text-[#687D6B]">
            {lang === "hi"
              ? "सीधे सत्यापित किसानों और FPOs से ताजा कृषि उपज खरीदें या बेचें।"
              : "Discover and trade verified fresh produce directly from farmers & FPOs without trading middlemen."}
          </p>
        </div>

        {/* Buy / Sell Mode Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full border border-[#E2E7E2] bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("SELL")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                mode === "SELL" ? "bg-[#16803A] text-white" : "text-[#687D6B] hover:text-[#172019]"
              }`}
            >
              {lang === "hi" ? "उपज बेचें" : "SELL PRODUCE"}
            </button>
            <button
              type="button"
              onClick={() => setMode("BUY")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                mode === "BUY" ? "bg-[#172019] text-white" : "text-[#687D6B] hover:text-[#172019]"
              }`}
            >
              {lang === "hi" ? "उपज खरीदें" : "BUY PRODUCE"}
            </button>
          </div>

          <Link
            href="/farmer/produce/new"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#16803A] px-4 py-2 text-xs font-bold text-white hover:bg-[#16803A]/90 transition"
          >
            <Plus className="size-3.5" /> List Produce
          </Link>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[#E2E7E2] bg-white px-4 py-2.5 text-xs shadow-2xs">
          <Search className="size-4 text-[#687D6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "hi" ? "उपज, स्थान या FPO खोजें..." : "Search produce, district, or verified seller..."}
            className="flex-1 outline-none text-[#172019] placeholder:text-[#687D6B]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-[#E2E7E2] bg-white px-3 py-2.5 text-xs font-semibold text-[#172019] outline-none shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Grains">Grains & Rice</option>
            <option value="Pulses">Pulses</option>
          </select>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-2xl border border-[#E2E7E2] bg-white px-3 py-2.5 text-xs font-semibold text-[#172019] outline-none shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Grades</option>
            <option value="A">Grade A (Premium)</option>
            <option value="B">Grade B (Standard)</option>
            <option value="Bulk">Bulk / Processing</option>
          </select>
        </div>
      </div>

      {/* ─── Results Grid ─── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4 text-xs text-[#687D6B]">
          <span>Showing <strong>{filteredListings.length}</strong> available harvest lots</span>
          <span className="text-[11px] italic text-[#16803A]">Live verified inventory</span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-12 text-center text-xs text-[#687D6B]">
            <p className="font-semibold text-sm text-[#172019]">
              {lang === "hi" ? "इन फ़िल्टर के अनुसार कोई उपज नहीं मिली।" : "No produce matches these filters."}
            </p>
            <p className="mt-1">Try resetting the category filter or search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((item) => {
              // Ensure rice image is explicitly forced during render
              const displayImage =
                item.productName.toLowerCase().includes("rice") ||
                item.productName.toLowerCase().includes("basmati")
                  ? "/basmati.jpg"
                  : item.image;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-[#E2E7E2] bg-white shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-[#EEF7EF]">
                      <img
                        src={displayImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#172019] shadow-xs backdrop-blur-xs">
                        Grade {item.grade}
                      </span>
                      <span className="absolute right-3 top-3 rounded-full bg-[#EEF7EF] px-2 py-0.5 text-[11px] font-bold text-[#16803A] shadow-xs backdrop-blur-xs">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#172019]">
                            {lang === "hi" ? item.productNameHi : item.productName}
                          </h3>
                          <p className="text-xs text-[#687D6B]">
                            Grade {item.grade} · {item.availableQuantity} {item.unit} available
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#687D6B]">Buyer Rate</span>
                          <p className="text-xl font-bold text-[#172019]">
                            {rupees(item.buyerPricePerKg)}
                            <span className="text-xs font-normal text-[#687D6B]">/{item.unit}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#687D6B] border-t border-[#E2E7E2] pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-[#16803A]" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seller:</span>
                          <span className="font-medium text-[#172019]">{item.farmerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FPO:</span>
                          <span className="font-medium text-[#16803A]">{item.fpoName || "Direct"}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#EEF7EF] p-2 text-xs text-[#172019] flex justify-between items-center">
                        <span className="text-[11px] text-[#687D6B]">Farmer Net:</span>
                        <span className="font-bold text-[#16803A]">{rupees(item.farmerRealizationPerKg)}/kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#E2E7E2] bg-[#FAFAF7]">
                    <Link
                      href={`/marketplace/${item.id}`}
                      className="flex w-full items-center justify-center gap-1 rounded-full bg-[#16803A] py-2 text-xs font-bold text-white hover:bg-[#16803A]/90 transition"
                    >
                      View Listing & Order <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}