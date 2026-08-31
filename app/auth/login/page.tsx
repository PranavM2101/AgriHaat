"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Mail,
  Sprout,
  ShoppingBag,
  Truck,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { useAuth, type UserRole } from "@/components/auth/auth-context";
import { useLanguage } from "@/components/site/language-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loginAs, error, clearError, loading } = useAuth();
  const { lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case "farmer":
      case "fpo":
        return "/farmer/dashboard";
      case "buyer":
        return "/buyer/dashboard";
      case "hub":
        return "/logistics/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/farmer/dashboard";
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    clearError();
    setLocalError(null);
    loginAs(role);
    router.push(getDashboardPath(role));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    setLocalLoading(true);
    const res = await signIn(email, password);
    setLocalLoading(false);

    if (res.error) {
      setLocalError(res.error);
    } else {
      // Look up user role or default to farmer
      router.push("/farmer/dashboard");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#172019] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Brand Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo size={32} />
        </Link>
        <Link href="/" className="text-xs font-semibold text-[#687D6B] hover:text-[#172019]">
          Back to Home
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl border border-[#E2E7E2] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
            AGRIHAAT SECURE LOGIN
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#172019] mt-1">
            {lang === "hi" ? "प्लेटफ़ॉर्म में प्रवेश करें" : "Sign In to Your Workspace"}
          </h1>
          <p className="text-xs text-[#687D6B] mt-0.5">
            Log in with your verified credentials or select a sandbox role below.
          </p>
        </div>

        {/* Error Notice */}
        {displayError && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">{displayError}</div>
          </div>
        )}

        {/* 1-Click Sandbox Fast Access */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#172019]">SIH Evaluation Sandbox Access:</p>
            <span className="text-[10px] font-semibold text-[#16803A] bg-[#EEF7EF] px-2 py-0.5 rounded-full">
              Instant Roles
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("farmer")}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-[#16803A]/30 bg-[#EEF7EF] text-left hover:bg-[#16803A] hover:text-white transition group"
            >
              <Sprout className="size-4 text-[#16803A] group-hover:text-white" />
              <div>
                <p className="font-bold text-xs">Farmer Portal</p>
                <p className="text-[10px] text-[#687D6B] group-hover:text-white/80">Ramesh (500 kg)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("buyer")}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E7E2] bg-[#FAFAF7] text-left hover:bg-[#172019] hover:text-white transition group"
            >
              <ShoppingBag className="size-4 text-[#172019] group-hover:text-white" />
              <div>
                <p className="font-bold text-xs">Buyer Portal</p>
                <p className="text-[10px] text-[#687D6B] group-hover:text-white/80">Anita (2,000 kg)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("hub")}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E7E2] bg-[#FAFAF7] text-left hover:bg-[#16A34A] hover:text-white transition group"
            >
              <Truck className="size-4 text-[#16803A] group-hover:text-white" />
              <div>
                <p className="font-bold text-xs">Logistics Hub</p>
                <p className="text-[10px] text-[#687D6B] group-hover:text-white/80">Multi-Stop Route</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E7E2] bg-[#FAFAF7] text-left hover:bg-[#07110B] hover:text-white transition group"
            >
              <Building2 className="size-4 text-[#172019] group-hover:text-white" />
              <div>
                <p className="font-bold text-xs">Admin Portal</p>
                <p className="text-[10px] text-[#687D6B] group-hover:text-white/80">System Ops</p>
              </div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E2E7E2] w-full" />
          <span className="bg-white px-3 text-[11px] text-[#687D6B] uppercase font-semibold">
            Or Account Sign In
          </span>
        </div>

        {/* Standard Supabase Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#172019]">Registered Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 text-xs bg-[#FAFAF7] focus-within:border-[#16803A] focus-within:bg-white transition">
              <Mail className="size-4 text-[#687D6B]" />
              <input
                type="email"
                placeholder="name@organization.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none text-[#172019] bg-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#172019]">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 text-xs bg-[#FAFAF7] focus-within:border-[#16803A] focus-within:bg-white transition">
              <Lock className="size-4 text-[#687D6B]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none text-[#172019] bg-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading || loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16803A] py-3 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs disabled:opacity-50"
          >
            {localLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                Enter Platform <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#687D6B]">
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-bold text-[#16803A] hover:underline">
            Register New Farm / Business
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#687D6B]">
        AgriHaat AI · Ministry of Consumer Affairs Problem Statement 26033/26032
      </div>
    </div>
  );
}
