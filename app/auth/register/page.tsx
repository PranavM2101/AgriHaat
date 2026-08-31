"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sprout,
  ShoppingBag,
  Building2,
  Truck,
  Mail,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { useAuth, type UserRole } from "@/components/auth/auth-context";
import { useLanguage } from "@/components/site/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, clearError, error } = useAuth();
  const { lang } = useLanguage();

  const [role, setRole] = useState<UserRole>("farmer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const getDashboardPath = (selectedRole: UserRole) => {
    switch (selectedRole) {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!name || !email || !password) {
      setLocalError("Please provide your name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    setLocalLoading(true);
    const res = await signUp(email, password, {
      fullName: name,
      role,
      phone: phone || undefined,
      organization: org || undefined,
      location: location || undefined,
    });
    setLocalLoading(false);

    if (res.error) {
      setLocalError(res.error);
    } else {
      router.push(getDashboardPath(role));
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
        <Link href="/auth/login" className="text-xs font-semibold text-[#687D6B] hover:text-[#172019]">
          Sign In Instead
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl border border-[#E2E7E2] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
            JOIN AGRIHAAT DIRECT NETWORK
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#172019] mt-1">
            {lang === "hi" ? "नया खाता पंजीकृत करें" : "Create Verified Account"}
          </h1>
          <p className="text-xs text-[#687D6B] mt-0.5">
            Connect directly with verified agricultural buyers & farmers.
          </p>
        </div>

        {/* Error Notice */}
        {displayError && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">{displayError}</div>
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#172019]">I am registering as a:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("farmer")}
              className={`p-3 rounded-2xl border text-left transition ${
                role === "farmer"
                  ? "border-[#16803A] bg-[#EEF7EF] text-[#16803A] ring-2 ring-[#16803A]/20"
                  : "border-[#E2E7E2] hover:bg-[#FAFAF7] text-[#172019]"
              }`}
            >
              <Sprout className="size-4 mb-1" />
              <p className="font-bold text-xs">Farmer / FPO</p>
              <p className="text-[10px] text-[#687D6B]">Sell harvests direct</p>
            </button>

            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`p-3 rounded-2xl border text-left transition ${
                role === "buyer"
                  ? "border-[#172019] bg-[#FAFAF7] text-[#172019] ring-2 ring-[#172019]/20"
                  : "border-[#E2E7E2] hover:bg-[#FAFAF7] text-[#172019]"
              }`}
            >
              <ShoppingBag className="size-4 mb-1" />
              <p className="font-bold text-xs">Buyer / HORECA</p>
              <p className="text-[10px] text-[#687D6B]">Source bulk produce</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#172019]">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 outline-none focus:border-[#16803A] bg-[#FAFAF7]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#172019]">Email Address *</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 bg-[#FAFAF7] focus-within:border-[#16803A] focus-within:bg-white transition">
              <Mail className="size-4 text-[#687D6B]" />
              <input
                type="email"
                placeholder="name@organization.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#172019]">Password *</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 bg-[#FAFAF7] focus-within:border-[#16803A] focus-within:bg-white transition">
              <Lock className="size-4 text-[#687D6B]" />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#172019]">FPO / Farm / Business Name</label>
            <input
              type="text"
              placeholder="e.g. ABC Farmer Producer Co."
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 outline-none focus:border-[#16803A] bg-[#FAFAF7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-bold text-[#172019]">Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98401 23456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 outline-none focus:border-[#16803A] bg-[#FAFAF7]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#172019]">Location / District</label>
              <input
                type="text"
                placeholder="e.g. Kanchipuram, TN"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 outline-none focus:border-[#16803A] bg-[#FAFAF7]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16803A] py-3 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-xs mt-4 disabled:opacity-50"
          >
            {localLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Create Account & Launch Workspace <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-[#687D6B]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-[#16803A] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-[#687D6B]">
        AgriHaat AI · Secure Agricultural Trade Network
      </div>
    </div>
  );
}
