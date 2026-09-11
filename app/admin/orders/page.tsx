"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { useLanguage, rupees } from "@/components/site/language-context";

const ORDERS_DATA = [
  {
    id: "ord-01",
    orderNumber: "FM-2026-00421",
    buyer: "ABC Grand Hotels",
    produce: "Tomatoes (Grade A)",
    qty: 500,
    amount: 20000,
    realization: 18000,
    city: "Chennai",
    status: "In Transit",
    date: "31 Aug 2026",
  },
  {
    id: "ord-02",
    orderNumber: "FM-2026-00422",
    buyer: "FreshChoice Hypermarkets",
    produce: "Red Onions (Grade A)",
    qty: 2000,
    amount: 70000,
    realization: 62000,
    city: "Chennai",
    status: "Delivered",
    date: "30 Aug 2026",
  },
  {
    id: "ord-03",
    orderNumber: "FM-2026-00423",
    buyer: "CureFoods Kitchens",
    produce: "Potatoes (Table Grade)",
    qty: 800,
    amount: 25600,
    realization: 23200,
    city: "Bengaluru",
    status: "Aggregating",
    date: "31 Aug 2026",
  },
  {
    id: "ord-04",
    orderNumber: "FM-2026-00424",
    buyer: "Malabar Feast Catering",
    produce: "Basmati Rice",
    qty: 1500,
    amount: 93000,
    realization: 85500,
    city: "Kochi",
    status: "Confirmed",
    date: "01 Sep 2026",
  },
];

export default function AdminOrdersPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = ORDERS_DATA.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#E2E7E2]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16803A]">
              CENTRAL ORDER DISPATCH
            </span>
            <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#172019]">
              Bulk Orders & Supply Allocations
            </h1>
            <p className="text-xs text-[#687D6B]">
              Monitoring institutional buyer demand, multi-farm aggregation batches, and escrow settlement status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("Exporting Orders Audit CSV...")}
            className="flex items-center gap-1.5 rounded-full border border-[#E2E7E2] bg-white px-4 py-2 text-xs font-bold text-[#172019] hover:bg-[#EEF7EF] transition shadow-2xs"
          >
            <Download className="size-3.5" /> Export Orders
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, buyer, or city..."
            className="w-full rounded-xl border border-[#E2E7E2] bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#16803A]"
          />
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-[#E2E7E2] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF7] border-b border-[#E2E7E2] text-[#687D6B]">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Buyer / Destination</th>
                  <th className="p-4 font-semibold">Produce & Volume</th>
                  <th className="p-4 font-semibold">Buyer Total</th>
                  <th className="p-4 font-semibold">Farmer Realization</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7E2]">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAFAF7] transition">
                    <td className="p-4 font-mono font-bold text-[#16803A]">
                      <Link href={`/farmer/orders/${o.orderNumber}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#172019]">{o.buyer}</p>
                      <p className="text-[11px] text-[#687D6B]">{o.city}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[#172019]">{o.produce}</p>
                      <p className="text-[11px] text-[#687D6B]">{o.qty} kg</p>
                    </td>
                    <td className="p-4 font-bold text-[#172019]">{rupees(o.amount)}</td>
                    <td className="p-4 font-bold text-[#16803A]">{rupees(o.realization)}</td>
                    <td className="p-4 text-[#687D6B]">{o.date}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          o.status === "Delivered"
                            ? "bg-[#EEF7EF] text-[#16803A]"
                            : o.status === "In Transit"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}