"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { useLanguage, rupees } from "@/components/site/language-context";
import { OrderService, ReportService } from "@/lib/services";
import type { Order } from "@/lib/store";

export default function AdminOrdersPage() {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error("Error loading admin orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerOrganization.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryCity.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    ReportService.downloadFarmerEarningsCSV(orders, "Admin_Master_Ledger");
  };

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
              100% Live Supabase Ledger: Multi-farm aggregation batches, institutional buyer demand, and payout statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-full border border-[#E2E7E2] bg-white px-4 py-2 text-xs font-bold text-[#172019] hover:bg-[#EEF7EF] hover:border-[#16803A] transition shadow-xs"
          >
            <Download className="size-3.5 text-[#16803A]" /> Export Master CSV
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number, buyer or destination..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E2E7E2] bg-white text-xs text-[#172019] outline-none focus:ring-2 focus:ring-[#16803A]/20"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-[#E2E7E2] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E7E2] bg-[#FAFAF7] text-[#687D6B]">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Buyer & Org</th>
                  <th className="py-3 px-4 font-semibold">Produce Lot</th>
                  <th className="py-3 px-4 font-semibold">Quantity</th>
                  <th className="py-3 px-4 font-semibold">Buyer Amount</th>
                  <th className="py-3 px-4 font-semibold">Farmer Realization</th>
                  <th className="py-3 px-4 font-semibold">Destination</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E7E2]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-[#687D6B]">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin text-[#16803A]" />
                        <span>Loading live Supabase orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-[#687D6B]">
                      No orders found in Supabase. Place an order in the Marketplace to see it appear here.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAFAF7]/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#172019]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#172019]">
                        {order.buyerOrganization}
                        <span className="block text-[11px] text-[#687D6B]">{order.buyerName}</span>
                      </td>
                      <td className="py-3 px-4 text-[#687D6B]">
                        {order.items?.[0]?.productName || "Direct Produce"}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#172019]">
                        {order.totalQuantityKg} kg
                      </td>
                      <td className="py-3 px-4 font-bold text-[#172019]">
                        {rupees(order.totalBuyerAmount)}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#16803A]">
                        {rupees(order.totalFarmerPayable)}
                      </td>
                      <td className="py-3 px-4 text-[#687D6B]">{order.deliveryCity}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            order.status === "Delivered" || order.status === "Completed"
                              ? "bg-[#EEF7EF] text-[#16803A]"
                              : order.status === "In Transit"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/farmer/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-[#16803A] hover:bg-[#EEF7EF]"
                        >
                          View Details <ArrowRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}