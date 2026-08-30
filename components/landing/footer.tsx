"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { LogoWithTagline } from "./logo";
import { useLanguage } from "@/components/site/language-context";

export function Footer() {
  const { t } = useLanguage();

  const productLinks = [
    { name: "Marketplace", href: "#marketplace" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Mandi vs Direct", href: "#comparison" },
    { name: "For Farmers", href: "#for-farmers" },
    { name: "For Buyers", href: "#for-buyers" },
    { name: "Procurement Pass", href: "/procurement" },
  ];

  const companyLinks = [
    { name: "About AgriHaat", href: "/about" },
    { name: "Careers", href: "/coming-soon" },
    { name: "Agricultural Blog", href: "/coming-soon" },
    { name: "Contact Team", href: "/about" },
    { name: "Privacy Policy", href: "/coming-soon" },
  ];

  const supportLinks = [
    { name: "Help Center & FAQ", href: "#faq" },
    { name: "Terms of Service", href: "/coming-soon" },
    { name: "Farmer Grievance Cell", href: "/coming-soon" },
    { name: "Report Mandi Issue", href: "/coming-soon" },
  ];

  return (
    <footer id="about" className="border-t border-[#172019] bg-[#07110B] text-white pt-16 pb-12">
      <div className="section-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-light.png"
                alt="AgriHaat AI"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Agri<span className="text-[#22c55e]">Haat</span> AI
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-gray-400">
              {t.footerDesc}
            </p>
            <div className="pt-1 text-xs text-[#22c55e] font-semibold tracking-wide">
              Direct Roots. Stronger Tomorrow.
            </div>
          </div>

          {/* Product Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.product}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {productLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.company}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.support}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {supportLinks.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated / Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.stayUpdated}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.stayUpdatedSub}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2 pt-1">
              <input
                type="email"
                placeholder={t.enterEmail}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#16803A]"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-[#16803A] py-2 text-xs font-semibold text-white transition hover:bg-[#16A34A]"
              >
                {t.subscribe}
                <ArrowRight className="ml-1.5 size-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright}</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-400">
            <span>{t.madeInIndia}</span>
            <span>·</span>
            <span>{t.footerTagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
