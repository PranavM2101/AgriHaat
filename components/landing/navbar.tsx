"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage, LanguageSwitcher } from "@/components/site/language-context";
import { useAuth } from "@/components/auth/auth-context";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.home, href: "/" },
    { label: t.howItWorks, href: "#how-it-works" },
    { label: t.marketplace, href: "#marketplace" },
    { label: "Mandi vs Direct", href: "#comparison" },
    { label: t.forFarmers, href: "#for-farmers" },
    { label: t.forBuyers, href: "#for-buyers" },
    { label: "Procurement", href: "/procurement" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-[#E2E7E2] transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-[76px] items-center justify-between lg:h-[82px]"
        aria-label="Main navigation"
      >
        {/* LEFT — Brand Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2" aria-label="AgriHaat AI home">
          <Image
            src="/agrihaat-logo.jpeg"
            alt="AgriHaat AI"
            width={160}
            height={44}
            className="h-10 w-auto object-contain rounded-lg"
            priority
          />
        </Link>

        {/* CENTER — Navigation Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-xs font-semibold text-[#687D6B] transition-colors hover:bg-[#EEF7EF] hover:text-[#172019]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT — Controls & Portal CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          {user ? (
            <Link
              href={
                user.role === "buyer"
                  ? "/buyer/dashboard"
                  : user.role === "hub"
                  ? "/logistics/dashboard"
                  : "/farmer/dashboard"
              }
              className="flex h-10 items-center gap-2 rounded-full bg-[#16803A] px-5 text-xs font-bold text-white transition-colors hover:bg-[#12682F] shadow-xs"
            >
              <User className="size-3.5" />
              <span>{user.name.split(" ")[0]}'s Portal</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-10 items-center gap-1 rounded-full bg-[#16803A] px-5 text-xs font-bold text-white transition-colors hover:bg-[#12682F] shadow-xs"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          )}
        </div>

        {/* MOBILE Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-lg border border-[#E2E7E2] text-[#172019] hover:bg-[#EEF7EF]"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-[#E2E7E2] bg-white px-5 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-xs font-semibold text-[#687D6B] transition-colors hover:bg-[#EEF7EF] hover:text-[#172019]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#16803A] text-xs font-bold text-white hover:bg-[#12682F]"
          >
            {t.getStarted} →
          </Link>
        </div>
      )}
    </header>
  );
}