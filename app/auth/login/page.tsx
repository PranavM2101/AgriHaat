"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserRole } from "@/components/auth/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, loginAsDemo } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithCredentials(identifier, password);
    if (success) {
      router.push("/");
    } else {
      setError(
        "No registered account found with these details. Please check your credentials or register a new account below."
      );
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    if (role === "farmer") router.push("/farmer/dashboard");
    else if (role === "buyer") router.push("/buyer/dashboard");
    else router.push("/logistics/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-6 rounded-2xl border border-[#E2E7E2] shadow-sm space-y-4">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-[#172019]">
            <img src="/agrihaat-logo.jpeg" alt="AgriHaat" className="h-9 w-9 rounded-lg object-cover" />
            <span>AgriHaat AI</span>
          </Link>
          <h2 className="mt-3 text-xl font-bold text-[#172019]">Login to Your Account</h2>
        </div>

        {error && (
          <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#172019] mb-1">
              Phone Number or Email
            </label>
            <input
              type="text"
              required
              placeholder="+91 98401 23456"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2.5 text-xs border border-[#E2E7E2] rounded-lg focus:ring-1 focus:ring-[#16803A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#172019] mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 text-xs border border-[#E2E7E2] rounded-lg focus:ring-1 focus:ring-[#16803A]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#16803A] text-white text-xs font-bold rounded-full hover:bg-[#12682F] transition"
          >
            Log In
          </button>
        </form>

        {/* Link to Registration Page */}
        <div className="p-3 bg-[#EEF7EF] rounded-xl border border-[#D0E7D3] text-center">
          <p className="text-xs text-[#172019]">
            Don't have an account yet?{" "}
            <Link href="/auth/register" className="font-bold text-[#16803A] hover:underline">
              Register New User
            </Link>
          </p>
        </div>

        {/* Fallback Quick Demo Profiles */}
        <div className="border-t border-[#E2E7E2] pt-3 text-center">
          <p className="text-[11px] text-[#687D6B] mb-2">Or test directly with Demo Profiles:</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin("farmer")}
              className="flex-1 py-1.5 text-[10px] font-bold bg-[#F8FAF8] border border-[#E2E7E2] text-[#16803A] rounded-lg hover:bg-[#EEF7EF]"
            >
              Ramesh (Farmer)
            </button>
            <button
              onClick={() => handleDemoLogin("buyer")}
              className="flex-1 py-1.5 text-[10px] font-bold bg-[#F8FAF8] border border-[#E2E7E2] text-[#16803A] rounded-lg hover:bg-[#EEF7EF]"
            >
              Anita (Buyer)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}