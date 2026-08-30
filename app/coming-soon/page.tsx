"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#172019] flex flex-col justify-between">
      <Navbar />
      <main className="section-container py-24 text-center my-auto">
        <div className="mx-auto max-w-md rounded-3xl border border-[#E2E7E2] bg-white p-8 sm:p-12 shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#EEF7EF] text-[#16803A]">
            <Clock className="size-8 animate-pulse" />
          </div>
          <span className="mt-6 inline-block rounded-full bg-[#16803A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#16803A]">
            Module in Progress
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#172019]">Coming Soon</h1>
          <p className="mt-2 text-sm text-[#687D6B]">
            This section is currently being polished for the nationwide rollout of AgriHaat AI.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full bg-[#16803A] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#16803A]/90 transition w-full sm:w-auto"
            >
              <ArrowLeft className="size-4" /> Back to Home
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 rounded-full border border-[#E2E7E2] bg-white px-6 py-3 text-xs font-semibold text-[#172019] hover:bg-[#EEF7EF] transition w-full sm:w-auto"
            >
              Go to Portal
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
