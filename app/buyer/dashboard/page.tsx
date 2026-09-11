"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ShoppingBag,
  TrendingUp,
  Truck,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { useAuth } from "@/components/auth/auth-context";
import { useLanguage, rupees } from "@/components/site/language-context";
import { OrderService, MarketplaceService, ForecastService } from "@/lib/services";
import type { Order, ProduceListing } from "@/lib/store";

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const buyerName = user?.name?.split(" ")[0] || "Anita";
  const [orders, setOrders] = useState<Order[]>([]);
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuyerData() {
      setLoading(true);
      try {
        const [fetchedOrders, fetchedListings] = await Promise.all([
          OrderService.getOrders(),
          MarketplaceService.getListings(),
        ]);
        setOrders(fetchedOrders);
        setListings(fetchedListings);
      } catch (err) {
        console.error("Error loading buyer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBuyerData();
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Completed" && o.status !== "Cancelled");
  const totalSpend = orders.reduce((sum, o) => sum + (o.totalBuyerAmount || 0), 0);
  const totalQtyKg = orders.reduce((sum, o) => sum + (o.totalQuantityKg || 0), 0);

  return (
    <AppShell>
      {/* ─── Top Greeting ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E2E7E2]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16803A]">
            {lang === "hi" ? "खरीदार / संस्थागत पोर्टल" : "BUYER PROCUREMENT PORTAL"}
          </span>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#172019]">
            {lang === "hi" ? `नमस्ते, ${buyerName}!` : `Welcome back, ${buyerName}!`}
          </h1>
          <p className="text-xs text-[#687D6B]">
            {lang === "hi"
              ? "थोक मांग, कृषि आपूर्ति मिलान और अनुसूचित डिलीवरी का रीयल-टाइम अवलोकन।"
              : "Bulk produce matching, multi-farm supply aggregation, and real-time delivery tracking."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/buyer/requirements/new"
            className="flex items-center gap-1.5 rounded-full bg-[#16803A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs"
          >
            <Plus className="size-4" />
            {lang === "hi" ? "नई थोक मांग पोस्ट करें" : "Post Bulk Requirement"}
          </Link>
        </div>
      </div>

      {/* ─── 4 Buyer Core Answers (KPIs) ─── */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="rounded-2xl border border-[#E2E7E2] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#687D6B]">
            <span className="text-xs">Active Orders</span>
            <ShoppingBag className="size-4 text-[#16803A]" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#172019]">2 In Progress</p>
          <p className="mt-1 text-[11px] text-[#16803A] font-semibold">1 delivery tomorrow 8:45 AM</p>
        </div>

        <div className="rounded-2xl border border-[#E2E7E2] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#687D6B]">
            <span className="text-xs">Open Requirements</span>
            <Layers className="size-4 text-[#16803A]" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#172019]">2,000 kg</p>
          <p className="mt-1 text-[11px] text-[#687D6B]">Tomatoes (Grade A)</p>
        </div>

        <div className="rounded-2xl border border-[#E2E7E2] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#687D6B]">
            <span className="text-xs">Mandi Cost Savings</span>
            <TrendingUp className="size-4 text-[#16803A]" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#16803A]">16.8% Lower</p>
          <p className="mt-1 text-[11px] text-[#687D6B]">vs wholesale mandi rate</p>
        </div>

        <div className="rounded-2xl border border-[#E2E7E2] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#687D6B]">
            <span className="text-xs">Verified Farm Partners</span>
            <ShieldCheck className="size-4 text-[#16803A]" />
          </div>
          <p className="mt-3 text-2xl font-bold text-[#172019]">4 FPOs Active</p>
          <p className="mt-1 text-[11px] text-[#687D6B]">Kanchipuram & Nellore</p>
        </div>
      </div>

      {/* ─── 2-Column Main Section ─── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Active Aggregated Supply Match + Recent Deliveries */}
        <div className="lg:col-span-8 space-y-6">
          {/* Multi-Farm Aggregation Card */}
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E7E2] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
                  AI SUPPLY MATCHING ENGINE
                </span>
                <h3 className="font-serif text-xl font-bold text-[#172019] mt-0.5">
                  Requirement: 2,000 kg Tomatoes (Grade A)
                </h3>
              </div>
              <span className="rounded-full bg-[#EEF7EF] px-3 py-1 text-xs font-bold text-[#16803A]">
                100% Sourced (3 Farms)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-[#FAFAF7] p-3 border border-[#E2E7E2]">
                <span className="text-[#687D6B]">Nearby Supply Available</span>
                <p className="mt-1 text-base font-bold text-[#16803A]">2,450 kg</p>
              </div>
              <div className="rounded-xl bg-[#FAFAF7] p-3 border border-[#E2E7E2]">
                <span className="text-[#687D6B]">Aggregated Route</span>
                <p className="mt-1 text-base font-bold text-[#172019]">124 km (4h 20m)</p>
              </div>
              <div className="rounded-xl bg-[#FAFAF7] p-3 border border-[#E2E7E2] col-span-2 sm:col-span-1">
                <span className="text-[#687D6B]">Expected Delivery</span>
                <p className="mt-1 text-base font-bold text-[#172019]">Tomorrow, 08:45 AM</p>
              </div>
            </div>

            {/* Matched Farms List */}
            <div className="space-y-2 border border-[#E2E7E2] rounded-2xl p-4 bg-[#FAFAF7] text-xs">
              <p className="font-bold text-[#172019] mb-2">Automated Multi-Stop Cluster Pickup:</p>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E7E2]">
                <span>1. ABC FPO (Kanchipuram)</span>
                <span className="font-bold text-[#16803A]">800 kg @ ₹31/kg</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E7E2]">
                <span>2. GreenFields FPO (Walajabad)</span>
                <span className="font-bold text-[#16803A]">700 kg @ ₹32/kg</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>3. Ramesh Farm (Chengalpattu)</span>
                <span className="font-bold text-[#16803A]">500 kg @ ₹31/kg</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                href="/buyer/orders/ord-00421"
                className="inline-flex items-center gap-1 rounded-full bg-[#16803A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition"
              >
                Inspect Live Shipment Dispatch →
              </Link>
            </div>
          </div>

          {/* Active Orders List */}
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E7E2] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#172019]">
                Recent In-Transit Shipments
              </h3>
              <Link href="/buyer/orders" className="text-xs font-semibold text-[#16803A] hover:underline">
                View All Orders
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E2E7E2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-sm text-[#172019]">FM-2026-00421 · 500 kg Tomatoes</p>
                  <p className="text-[#687D6B] mt-0.5">Dest: Thousand Lights Central Kitchen · Dispatch Scheduled</p>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <span className="rounded bg-[#EEF7EF] px-2 py-0.5 text-[10px] font-bold text-[#16803A]">
                      Confirmed
                    </span>
                    <p className="text-[11px] text-[#687D6B] mt-0.5">ETA: Tomorrow 08:30 AM</p>
                  </div>
                  <Link
                    href="/buyer/orders/ord-00421"
                    className="rounded-full border border-[#E2E7E2] bg-white p-2 text-[#172019] hover:bg-[#EEF7EF]"
                  >
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E2E7E2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-sm text-[#172019]">FM-2026-00422 · 700 kg Red Onions</p>
                  <p className="text-[#687D6B] mt-0.5">Dest: Guindy Bulk Facility · Vehicle on Highway</p>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      In Transit
                    </span>
                    <p className="text-[11px] text-[#687D6B] mt-0.5">ETA: Today 04:30 PM</p>
                  </div>
                  <Link
                    href="/buyer/orders/ord-00422"
                    className="rounded-full border border-[#E2E7E2] bg-white p-2 text-[#172019] hover:bg-[#EEF7EF]"
                  >
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Requisition & Market Signals */}
        <div className="lg:col-span-4 space-y-6">
          {/* Direct Marketplace Quick Access */}
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#172019]">
              Explore Farm Marketplace
            </h3>
            <p className="text-xs text-[#687D6B]">
              Browse 4 live harvest lots listed by verified producer organizations in Tamil Nadu and Andhra Pradesh.
            </p>
            <Link
              href="/marketplace"
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#172019] py-2.5 text-xs font-bold text-white hover:bg-[#172019]/90 transition"
            >
              Browse Active Marketplace <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* AI Price Signal */}
          <div className="rounded-3xl border border-[#16803A]/30 bg-[#EEF7EF] p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#16803A]">
              <Sparkles className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                PRICE INTELLIGENCE
              </span>
            </div>
            <h4 className="font-serif text-base font-bold text-[#172019]">
              Tomato wholesale mandi rates expected to rise +12% this week.
            </h4>
            <p className="text-xs text-[#687D6B]">
              Lock in your procurement contracts today at ₹32–34/kg to ensure steady supply and avoid spot market inflation.
            </p>
            <div className="pt-2">
              <Link
                href="/buyer/requirements/new"
                className="text-xs font-bold text-[#16803A] hover:underline"
              >
                Post Advance Requirement →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
