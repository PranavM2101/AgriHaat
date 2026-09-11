"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  User,
} from "lucide-react";
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
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
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
      setLocalError(lang === "hi" ? "कृपया नाम, ईमेल और पासवर्ड दर्ज करें।" : "Please provide name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setLocalError(lang === "hi" ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।" : "Password must be at least 6 characters.");
      return;
    }

    setLocalLoading(true);
    const res = await signUp(email, password, {
      fullName: name,
      role: role,
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

  const roleOptions: { role: UserRole; label: string; labelHi: string; icon: any }[] = [
    { role: "farmer", label: "Farmer / Producer", labelHi: "किसान / उत्पादक", icon: Sprout },
    { role: "buyer", label: "Bulk Commercial Buyer", labelHi: "थोक व्यापारी / खरीदार", icon: ShoppingBag },
    { role: "hub", label: "Fleet Driver / Hub", labelHi: "ड्राइवर / लॉजिस्टिक्स हब", icon: Truck },
    { role: "fpo", label: "FPO Manager", labelHi: "FPO प्रबंधक", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/agrihaat-logo.jpeg"
              alt="AgriHaat AI"
              width={160}
              height={48}
              className="h-10 w-auto object-contain rounded-lg shadow-xs"
              priority
            />
          </Link>
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-[#687D6B] hover:text-[#172019] transition"
          >
            ← {lang === "hi" ? "लॉगिन पृष्ठ" : "Back to Login"}
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E7E2] p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF7EF] text-[#16803A] mb-2 border border-[#16803A]/20">
              <CheckCircle2 className="size-3.5" />
              {lang === "hi" ? "नया खाता बनाएं" : "Create Verified Account"}
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#172019]">
              {lang === "hi" ? "एग्रीहाट एआई पर पंजीकरण" : "Join AgriHaat AI Marketplace"}
            </h1>
            <p className="text-xs text-[#687D6B] mt-1">
              {lang === "hi"
                ? "सुपरबेस सुरक्षित डेटाबेस में अपनी प्रोफ़ाइल पंजीकृत करें"
                : "Creates your authenticated profile directly in live Supabase PostgreSQL"}
            </p>
          </div>

          {(localError || error) && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-[#172019] mb-1.5">
                {lang === "hi" ? "आपकी भूमिका" : "Select Your Role"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setRole(opt.role)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#16803A] bg-[#EEF7EF] text-[#16803A] shadow-xs"
                          : "border-[#E2E7E2] text-[#687D6B] hover:border-gray-300"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{lang === "hi" ? opt.labelHi : opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#172019] mb-1">
                {lang === "hi" ? "पूरा नाम" : "Full Name"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172019] mb-1">
                  {lang === "hi" ? "ईमेल" : "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172019] mb-1">
                  {lang === "hi" ? "फोन नंबर" : "Phone Number"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 XXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#172019] mb-1">
                {lang === "hi" ? "पासवर्ड (कम से कम 6 अक्षर)" : "Password (min. 6 characters)"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                />
              </div>
            </div>

            {/* Organization & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172019] mb-1">
                  {lang === "hi" ? "संगठन / फार्म / कंपनी" : "Organization / Farm Name"}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. ABC FPO / Grand Hotel"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172019] mb-1">
                  {lang === "hi" ? "स्थान / जिला" : "Location / District"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#687D6B]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kanchipuram, TN"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E7E2] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16803A]/20 focus:border-[#16803A]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={localLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#16803A] text-white text-xs font-bold hover:bg-[#16803A]/90 transition shadow-xs disabled:opacity-50"
            >
              {localLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{lang === "hi" ? "खाता तैयार हो रहा है..." : "Registering Account in Supabase..."}</span>
                </>
              ) : (
                <>
                  <span>{lang === "hi" ? "पंजीकरण पूरा करें" : "Complete Registration"}</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E2E7E2] text-center text-xs text-[#687D6B]">
            {lang === "hi" ? "पहले से खाता है?" : "Already have an account?"}{" "}
            <Link href="/auth/login" className="font-bold text-[#16803A] hover:underline">
              {lang === "hi" ? "लॉगिन करें" : "Sign In"}
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-[11px] text-[#687D6B]">
        AgriHaat AI Platform · Direct Farm-to-Market & Procurement Queue Management
      </footer>
    </div>
  );
}