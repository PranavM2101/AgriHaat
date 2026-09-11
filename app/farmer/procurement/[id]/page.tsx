"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  QrCode,
  Layers,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { ProcurementService, ReportService } from "@/lib/services";
import { type ProcurementBooking } from "@/lib/store";
import { useLanguage, rupees } from "@/components/site/language-context";

export default function ProcurementStatusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { lang } = useLanguage();
  const [booking, setBooking] = useState<ProcurementBooking | null>(null);

  useEffect(() => {
    ProcurementService.getBookingById(resolvedParams.id).then(setBooking);
  }, [resolvedParams.id]);

  if (!booking) {
    return (
      <AppShell>
        <div className="p-12 text-center text-xs text-[#687D6B]">
          Loading procurement booking...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/farmer/procurement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#687D6B] hover:text-[#172019]"
        >
          <ArrowLeft className="size-3.5" /> Back to Procurement Hub
        </Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="rounded-3xl border border-[#E2E7E2] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E7E2] pb-6">
            <div className="flex items-start gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-[#16803A] text-white font-serif text-2xl font-bold">
                #{booking.tokenNumber}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
                  OFFICIAL PROCUREMENT PASS
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#172019]">
                  Booking Ref: {booking.bookingCode}
                </h1>
                <p className="text-xs text-[#687D6B] mt-0.5">
                  {booking.centreName} · {booking.centreLocation}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="rounded-2xl border border-[#16803A]/20 bg-[#EEF7EF] px-4 py-3 text-center sm:text-right">
                <span className="text-[11px] text-[#687D6B]">Current Status</span>
                <p className="font-bold text-sm text-[#16803A]">{booking.status}</p>
              </div>

              <button
                type="button"
                onClick={() => ReportService.downloadProcurementTokenSlip(booking)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#16803A] bg-[#16803A] px-4 py-3 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs"
              >
                <FileText className="size-3.5" />
                <span>Download Gate Pass</span>
              </button>
            </div>
          </div>

          {/* Live Queue Radar Box */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-2xl bg-[#FAFAF7] p-3.5 border border-[#E2E7E2] text-center">
              <span className="text-[#687D6B]">Your Token</span>
              <p className="text-2xl font-bold text-[#16803A]">#{booking.tokenNumber}</p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF7] p-3.5 border border-[#E2E7E2] text-center">
              <span className="text-[#687D6B]">Now Serving</span>
              <p className="text-2xl font-bold text-[#172019]">#34</p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF7] p-3.5 border border-[#E2E7E2] text-center">
              <span className="text-[#687D6B]">Farmers Ahead</span>
              <p className="text-2xl font-bold text-[#172019]">{booking.farmersAhead}</p>
            </div>
            <div className="rounded-2xl bg-[#FAFAF7] p-3.5 border border-[#E2E7E2] text-center">
              <span className="text-[#687D6B]">Est. Waiting Time</span>
              <p className="text-2xl font-bold text-[#16803A]">~{booking.estimatedWaitMinutes} min</p>
            </div>
          </div>
        </div>

        {/* 2-Column Details: Stepper vs Batch Inspection / Payment */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Detailed Timeline Stepper */}
          <div className="lg:col-span-7 rounded-3xl border border-[#E2E7E2] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#172019]">
              Procurement Lifecycle Timeline
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E7E2]">
              {booking.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div
                    className={`absolute left-1.5 top-0.5 grid size-3.5 place-items-center rounded-full border-2 bg-white transition ${
                      step.completed
                        ? "border-[#16803A] bg-[#16803A]"
                        : "border-[#687D6B]"
                    }`}
                  >
                    {step.completed && <div className="size-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-bold ${step.completed ? "text-[#172019]" : "text-[#687D6B]"}`}>
                      {step.step}
                    </p>
                    <p className="text-[11px] text-[#687D6B]">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Produce Inspection & Payment Slip */}
          <div className="lg:col-span-5 space-y-6">
            {/* Batch & Weighing Inspection */}
            <div className="rounded-3xl border border-[#E2E7E2] bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#172019]">
                Weighing & Quality Inspection
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Expected Quantity:</span>
                  <span className="font-bold text-[#172019]">{booking.expectedQuantityKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Accepted Quantity:</span>
                  <span className="font-bold text-[#16803A]">{booking.acceptedQuantityKg || 480} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Benchmark Gov Rate:</span>
                  <span className="font-bold text-[#172019]">₹{booking.ratePerKg}/kg</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E7E2] pt-2 font-bold text-sm">
                  <span className="text-[#172019]">Total Payable:</span>
                  <span className="text-[#16803A]">{rupees(booking.paymentAmount || 15360)}</span>
                </div>
              </div>
            </div>

            {/* Direct Bank Settlement */}
            <div className="rounded-3xl border border-[#16803A]/30 bg-[#EEF7EF] p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#16803A]">
                <DollarSign className="size-4" />
                <h4 className="font-serif text-base font-bold text-[#172019]">
                  Direct Bank Settlement
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Payment Status:</span>
                  <span className="rounded-md bg-white px-2 py-0.5 font-bold text-[#16803A] border border-[#16803A]/20">
                    Payment Processing
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Reference ID:</span>
                  <span className="font-mono text-[#172019]">{booking.paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#687D6B]">Target Account:</span>
                  <span className="text-[#172019]">SBI A/c •••• 4892 (DBT Active)</span>
                </div>
              </div>

              <p className="text-[10px] text-[#687D6B] pt-2 border-t border-[#16803A]/20">
                *DBT Direct Bank Transfer initiated upon QA inspection sign-off. Illustrative demo data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
