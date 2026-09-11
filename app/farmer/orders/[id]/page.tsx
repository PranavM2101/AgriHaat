"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  DollarSign,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { OrderService } from "@/lib/services";
import { type Order, type OrderStatus } from "@/lib/store";
import { useLanguage, rupees } from "@/components/site/language-context";

const ORDER_STEPS: { id: OrderStatus; label: string; labelHi: string }[] = [
  { id: "Placed", label: "Placed", labelHi: "ऑर्डर किया" },
  { id: "Confirmed", label: "Confirmed", labelHi: "पुष्टि हुई" },
  { id: "Aggregating", label: "Aggregating", labelHi: "संग्रहण" },
  { id: "Pickup Scheduled", label: "Pickup Scheduled", labelHi: "पिकअप निर्धारित" },
  { id: "Picked Up", label: "Picked Up", labelHi: "पिक अप हुआ" },
  { id: "In Transit", label: "In Transit", labelHi: "रास्ते में" },
  { id: "Delivered", label: "Delivered", labelHi: "डिलीवर हुआ" },
  { id: "Payment Processing", label: "Payment Processing", labelHi: "भुगतान प्रक्रिया में" },
  { id: "Completed", label: "Completed", labelHi: "पूर्ण" },
];

export default function OrderStatusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { lang } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    OrderService.getOrderById(resolvedParams.id).then(setOrder);
  }, [resolvedParams.id]);

  if (!order) {
    return (
      <AppShell>
        <div className="p-12 text-center text-xs text-[#687D6B]">Loading order details...</div>
      </AppShell>
    );
  }

  // Determine active step index dynamically
  const activeStepIdx =
    ORDER_STEPS.findIndex((s) => s.id === order.status) !== -1
      ? ORDER_STEPS.findIndex((s) => s.id === order.status)
      : order.status === "In Transit"
      ? 5
      : order.status === "Confirmed"
      ? 1
      : 0;

  // Extract correct fields from Order schema
  const quantityKg = order.totalQuantityKg || order.items?.[0]?.quantity || 0;
  const productName = order.items?.[0]?.productName || "Produce";

  // Calculate per-kg rates dynamically from order object
  const buyerRatePerKg = quantityKg > 0 ? order.totalBuyerAmount / quantityKg : 0;
  const logisticsRatePerKg = quantityKg > 0 ? order.totalLogisticsFee / quantityKg : 0;
  const platformRatePerKg = quantityKg > 0 ? order.totalPlatformFee / quantityKg : 0;
  const farmerRealizationPerKg = quantityKg > 0 ? order.totalFarmerPayable / quantityKg : 0;

  return (
    <AppShell>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/farmer/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687D6B] hover:text-[#172019]"
        >
          <ArrowLeft className="size-3.5" /> Back to All Orders
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Summary */}
        <div className="rounded-3xl border border-[#E2E7E2] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E7E2] pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
                PURCHASE ORDER FULFILLMENT
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#172019]">
                Order {order.orderNumber}
              </h1>
              <p className="text-xs text-[#687D6B] mt-0.5">
                Buyer: <strong className="text-[#172019]">{order.buyerOrganization}</strong> ({order.buyerName}) · Destination: {order.deliveryCity}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-1.5 rounded-full border border-[#E2E7E2] px-4 py-2 text-xs font-bold text-[#172019] hover:bg-[#EEF7EF] transition"
              >
                <FileText className="size-3.5 text-[#16803A]" /> View Invoice
              </button>
              <div className="rounded-2xl border border-[#16803A]/20 bg-[#EEF7EF] px-4 py-2 text-right">
                <span className="text-[10px] text-[#687D6B]">Realization</span>
                <p className="font-bold text-sm text-[#16803A]">{rupees(order.totalFarmerPayable)}</p>
              </div>
            </div>
          </div>

          {/* Lifecycle Horizontal Stepper */}
          <div className="mt-8">
            <h3 className="font-serif text-sm font-bold text-[#172019] mb-4">
              Order Fulfillment Lifecycle
            </h3>

            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="flex items-center min-w-[720px] justify-between relative">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx <= activeStepIdx;
                  const isCurrent = idx === activeStepIdx;

                  return (
                    <div key={step.id} className="flex flex-col items-center text-center relative z-10 flex-1">
                      <div
                        className={`grid size-8 place-items-center rounded-full border-2 transition ${
                          isCurrent
                            ? "bg-[#16803A] text-white border-[#16803A] ring-4 ring-[#16803A]/20"
                            : isCompleted
                            ? "bg-[#16803A] text-white border-[#16803A]"
                            : "bg-white text-[#687D6B] border-[#E2E7E2]"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-4 stroke-[2.5]" />
                        ) : (
                          <span className="text-[10px] font-mono">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-bold ${
                          isCurrent
                            ? "text-[#16803A]"
                            : isCompleted
                            ? "text-[#172019]"
                            : "text-[#687D6B]"
                        }`}
                      >
                        {lang === "hi" ? step.labelHi : step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Details: Price Ledger vs Route Coordinates */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Price Ledger (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-[#E2E7E2] bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-[#172019]">
              Itemized Payout Arithmetic ({quantityKg} kg {productName})
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#687D6B]">Gross Buyer Amount ({rupees(buyerRatePerKg)}/kg):</span>
                <span className="font-bold text-[#172019]">{rupees(order.totalBuyerAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687D6B]">Logistics & Transport Fee ({rupees(logisticsRatePerKg)}/kg):</span>
                <span className="font-medium text-red-600">−{rupees(order.totalLogisticsFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687D6B]">Platform Fee ({rupees(platformRatePerKg)}/kg):</span>
                <span className="font-medium text-red-600">−{rupees(order.totalPlatformFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E2E7E2] pt-3 text-sm font-bold text-[#16803A]">
                <span>Guaranteed Net Realization ({rupees(farmerRealizationPerKg)}/kg):</span>
                <span>{rupees(order.totalFarmerPayable)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#EEF7EF] p-4 text-xs space-y-1 text-[#172019]">
              <p className="font-bold text-[#16803A]">Direct Bank Transfer (T+1 Settlement)</p>
              <p className="text-[11px] text-[#687D6B]">
                Payment will be automatically credited to your linked SBI A/c upon buyer delivery sign-off.
              </p>
            </div>
          </div>

          {/* Logistics & Dispatch Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-[#E2E7E2] bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#172019]">
              Pickup & Transport Schedule
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#16803A]" />
                <div>
                  <span className="text-[#687D6B]">Pickup Slot:</span>
                  <p className="font-bold text-[#172019]">{order.pickupScheduledAt || "Tomorrow, 08:30 AM"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-[#E2E7E2] pt-2.5">
                <MapPin className="size-4 text-[#16803A]" />
                <div>
                  <span className="text-[#687D6B]">Delivery Location:</span>
                  <p className="font-bold text-[#172019]">{order.deliveryAddress}, {order.deliveryCity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-[#E2E7E2] pt-2.5">
                <Truck className="size-4 text-[#16803A]" />
                <div>
                  <span className="text-[#687D6B]">Vehicle Assigned:</span>
                  <p className="font-bold text-[#172019]">TN-21-AX-9942 (Reefer Cold Van)</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/farmer/logistics"
                className="flex w-full items-center justify-center gap-1 rounded-full bg-[#172019] py-2 text-xs font-bold text-white hover:bg-[#172019]/90 transition"
              >
                View Live Map Route →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Digital Invoice Modal ─── */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white rounded-3xl border border-[#E2E7E2] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E7E2] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
                  AGRIHAAT AI OFFICIAL RECEIPT
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#172019]">
                  Tax Invoice #{order.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="text-xs font-bold text-[#687D6B] hover:text-[#172019]"
              >
                Close
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-6 border border-[#E2E7E2] rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-sm text-[#172019]">AgriHaat AI Marketplace Pvt Ltd</p>
                  <p className="text-[#687D6B]">GSTIN: 33AAACF2026M1Z5</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#172019]">Date: {order.createdAt || "28 Aug 2026"}</p>
                  <p className="text-[#687D6B]">Payment Ref: {order.paymentRef || "PAY-DEMO-38292"}</p>
                </div>
              </div>

              <div className="border-t border-b border-[#E2E7E2] py-3 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#687D6B]">Billed To (Buyer):</span>
                  <p className="font-bold text-[#172019]">{order.buyerOrganization}</p>
                  <p>{order.deliveryAddress}, {order.deliveryCity}</p>
                </div>
                <div>
                  <span className="text-[#687D6B]">Seller (Farmer/FPO):</span>
                  <p className="font-bold text-[#172019]">{order.allocations?.[0]?.farmerName || "Suresh Reddy (GreenFields FPO)"}</p>
                  <p>Nellore, Andhra Pradesh</p>
                </div>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E2E7E2] text-[#687D6B]">
                    <th className="py-2">Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E7E2]">
                  <tr>
                    <td className="py-2.5 font-bold text-[#172019]">{productName}</td>
                    <td>{quantityKg} kg</td>
                    <td>{rupees(buyerRatePerKg)}</td>
                    <td className="text-right font-bold">{rupees(order.totalBuyerAmount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-[#E2E7E2] pt-3 space-y-1.5 text-right">
                <div className="flex justify-between text-[#687D6B]">
                  <span>Logistics Transport Fee (Direct Pass-Through):</span>
                  <span>−{rupees(order.totalLogisticsFee)}</span>
                </div>
                <div className="flex justify-between text-[#687D6B]">
                  <span>Platform Facilitation Fee (GST Incl.):</span>
                  <span>−{rupees(order.totalPlatformFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#16803A] border-t border-[#E2E7E2] pt-2">
                  <span>Net Farmer Disbursal Realization:</span>
                  <span>{rupees(order.totalFarmerPayable)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#16803A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs"
              >
                <Printer className="size-4" /> Print / Save PDF Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}