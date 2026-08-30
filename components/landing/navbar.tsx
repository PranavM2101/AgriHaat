"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
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
      className={`navbar transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""}`}
      role="banner"
    >
      <nav
        className="section-container flex h-[76px] items-center justify-between lg:h-[82px]"
        aria-label="Main navigation"
      >
        {/* LEFT — Logo */}
        <Link href="/" className="shrink-0" aria-label="AgriHaat AI home">
          <Logo size={34} />
        </Link>

        {/* CENTER — Nav links (desktop) */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT — Language + Portal CTA (desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          {user ? (
            <Link
              href={user.role === "buyer" ? "/buyer/dashboard" : user.role === "hub" ? "/logistics/dashboard" : "/farmer/dashboard"}
              className="flex h-10 items-center gap-2 rounded-full bg-[#16803A] px-5 text-xs font-bold text-white transition-colors hover:bg-[#16803A]/90 shadow-2xs"
            >
              <User className="size-3.5" />
              <span>{user.name.split(" ")[0]}'s Portal</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-10 items-center gap-1 rounded-full bg-[#16803A] px-5 text-xs font-bold text-white transition-colors hover:bg-[#16803A]/90 shadow-2xs"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          )}
        </div>

        {/* MOBILE — Language + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-lg text-foreground hover:bg-muted"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-white px-5 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#16803A] text-xs font-bold text-white hover:bg-[#16803A]/90"
          >
            {t.getStarted} →
          </Link>
        </div>
      )}
    </header>
  );
}
