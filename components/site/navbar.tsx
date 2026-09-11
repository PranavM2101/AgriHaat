"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { User, LogIn } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E7E2] px-4 sm:px-6 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 shrink-0 font-bold text-base sm:text-lg text-[#172019]">
          <img 
            src="/agrihaat-logo.jpeg" 
            alt="AgriHaat" 
            className="h-8 w-8 rounded-md object-cover shrink-0" 
          />
          <span className="truncate">AgriHaat AI</span>
        </Link>

        {/* Auth / Action Section */}
        <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF7EF] text-xs font-semibold text-[#16803A]">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">{user.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-[#16803A] border border-[#16803A] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#EEF7EF] transition whitespace-nowrap"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                <span>Login / Register</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}