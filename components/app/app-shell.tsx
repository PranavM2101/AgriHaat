"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Sprout,
  ShoppingBag,
  CalendarCheck,
  Truck,
  TrendingUp,
  Wallet,
  Bell,
  User,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  FileText,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAuth, UserRole } from "@/components/auth/auth-context";
import { useLanguage, LanguageSwitcher } from "@/components/site/language-context";
import { RoleSwitcherBadge } from "./role-switcher";
import { NotificationDrawer } from "./notification-drawer";
import { QuickTutorialModal } from "./quick-tutorial-modal";
import { AIChatPopup } from "@/components/ai/AIChatPopup";

interface NavItem {
  label: string;
  labelHi: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Infer role from current URL path if user state is out of sync
  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith("/buyer")) return "buyer";
    if (pathname.startsWith("/logistics") || pathname.startsWith("/procurement-center")) return "hub";
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/farmer")) return "farmer";
    return user?.role || "farmer";
  };

  const role: UserRole = user?.role || getRoleFromPath();

  // Dynamic Navigation Links tailored strictly to each Role
  const getNavLinks = (): NavItem[] => {
    switch (role) {
      case "farmer":
        return [
          { label: "Overview", labelHi: "डैशबोर्ड", href: "/farmer/dashboard", icon: LayoutDashboard },
          { label: "Marketplace", labelHi: "मार्केटप्लेस", href: "/marketplace", icon: Store },
          { label: "My Produce", labelHi: "मेरी उपज", href: "/farmer/produce", icon: Sprout },
          { label: "Orders", labelHi: "ऑर्डर्स", href: "/farmer/orders", icon: ShoppingBag },
          { label: "Procurement", labelHi: "खरीद केंद्र", href: "/farmer/procurement", icon: CalendarCheck },
          { label: "Logistics", labelHi: "लॉजिस्टिक्स", href: "/farmer/logistics", icon: Truck },
          { label: "AI Insights", labelHi: "AI अंतर्दृष्टि", href: "/farmer/insights", icon: TrendingUp },
          { label: "Earnings", labelHi: "कमाई", href: "/farmer/earnings", icon: Wallet },
          { label: "Notifications", labelHi: "सूचनाएं", href: "/farmer/notifications", icon: Bell },
          { label: "Profile", labelHi: "प्रोफ़ाइल", href: "/farmer/profile", icon: User },
        ];
      case "buyer":
        return [
          { label: "Overview", labelHi: "डैशबोर्ड", href: "/buyer/dashboard", icon: LayoutDashboard },
          { label: "Marketplace", labelHi: "मार्केटप्लेस", href: "/marketplace", icon: Store },
          { label: "Requirements", labelHi: "मांग लिस्ट", href: "/buyer/requirements", icon: Layers },
          { label: "My Orders", labelHi: "मेरे ऑर्डर्स", href: "/buyer/orders", icon: ShoppingBag },
          { label: "Deliveries", labelHi: "डिलीवरी", href: "/buyer/deliveries", icon: Truck },
          { label: "Price Trends", labelHi: "कीमत रुझान", href: "/insights/prices", icon: TrendingUp },
          { label: "Profile", labelHi: "प्रोफ़ाइल", href: "/buyer/profile", icon: User },
        ];
      case "hub":
        return [
          { label: "Routes Overview", labelHi: "रूट अवलोकन", href: "/logistics/dashboard", icon: LayoutDashboard },
          { label: "Dispatch Routes", labelHi: "डिस्पैच मार्ग", href: "/logistics/routes", icon: Truck },
          { label: "Active Shipments", labelHi: "सक्रिय शिपमेंट", href: "/logistics/shipments", icon: ShoppingBag },
          { label: "Hub Operations", labelHi: "हब संचालन", href: "/procurement-center/dashboard", icon: Building2 },
          { label: "Partner Profile", labelHi: "पार्टनर प्रोफ़ाइल", href: "/logistics/profile", icon: User },
        ];
      case "admin":
        return [
          { label: "Admin Console", labelHi: "प्रशासन कंसोल", href: "/admin/dashboard", icon: LayoutDashboard },
          { label: "User Management", labelHi: "उपयोगकर्ता", href: "/admin/users", icon: Users },
          { label: "Produce Listings", labelHi: "लिस्टिंग", href: "/admin/listings", icon: Sprout },
          { label: "All Orders", labelHi: "सभी ऑर्डर्स", href: "/admin/orders", icon: ShoppingBag },
          { label: "Procurement Centres", labelHi: "खरीद केंद्र", href: "/admin/procurement", icon: Building2 },
          { label: "Logistics Roster", labelHi: "लॉजिस्टिक्स", href: "/admin/logistics", icon: Truck },
          { label: "AI Forecast Model", labelHi: "AI मॉडल", href: "/admin/ai", icon: TrendingUp },
          { label: "System Reports", labelHi: "सिस्टम रिपोर्ट", href: "/admin/reports", icon: FileText },
        ];
      default:
        return [
          { label: "Overview", labelHi: "डैशबोर्ड", href: "/farmer/dashboard", icon: LayoutDashboard },
          { label: "Marketplace", labelHi: "मार्केटप्लेस", href: "/marketplace", icon: Store },
        ];
    }
  };

  const navLinks = getNavLinks();

  const dashboardHref =
    role === "buyer"
      ? "/buyer/dashboard"
      : role === "hub"
      ? "/logistics/dashboard"
      : role === "admin"
      ? "/admin/dashboard"
      : "/farmer/dashboard";

  const getPersonaName = () => {
    if (user?.name) return user.name;
    switch (role) {
      case "buyer":
        return "Anita Rao";
      case "hub":
        return "Murugan S.";
      case "admin":
        return "AgriHaat Admin";
      default:
        return "Ramesh Kumar";
    }
  };

  const getPersonaOrg = () => {
    if (user?.organization) return user.organization;
    switch (role) {
      case "buyer":
        return "ABC Grand Hotels & Restaurants";
      case "hub":
        return "Kanchipuram Collection Hub";
      case "admin":
        return "AgriHaat Operations";
      default:
        return "ABC FPO";
    }
  };

  const getAvatarLetter = () => {
    if (user?.avatarLetter) return user.avatarLetter;
    switch (role) {
      case "buyer":
        return "A";
      case "hub":
        return "M";
      case "admin":
        return "F";
      default:
        return "R";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#172019] flex">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#E2E7E2] bg-white h-screen sticky top-0 z-30">
        {/* Brand Header */}
        <div className="h-[74px] flex items-center px-6 border-b border-[#E2E7E2]">
          <Link href={dashboardHref} className="shrink-0" aria-label="AgriHaat AI Dashboard">
            <Image
              src="/agrihaat-logo.jpeg"
              alt="AgriHaat AI"
              width={160}
              height={48}
              className="h-10 w-auto object-contain rounded-lg"
              priority
            />
          </Link>
        </div>

        {/* User Persona Chip */}
        <div className="p-4 border-b border-[#E2E7E2] bg-[#FAFAF7]">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-[#16803A] text-white font-bold text-sm shadow-xs">
              {getAvatarLetter()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#172019] truncate">{getPersonaName()}</p>
              <p className="text-[11px] text-[#687D6B] truncate">{getPersonaOrg()}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Sidebar Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href) &&
                item.href !== "/farmer" &&
                item.href !== "/buyer" &&
                item.href !== "/logistics" &&
                item.href !== "/admin");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#16803A] text-white shadow-xs"
                    : "text-[#687D6B] hover:text-[#172019] hover:bg-[#EEF7EF]"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-white" : "text-[#687D6B]"}`} />
                <span>{lang === "hi" ? item.labelHi : item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#E2E7E2] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#687D6B] hover:text-[#172019] hover:bg-[#EEF7EF] transition"
          >
            <Store className="size-3.5" /> Back to Landing
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#dc2626] hover:bg-[#dc2626]/10 transition"
          >
            <LogOut className="size-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-[74px] border-b border-[#E2E7E2] bg-white sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-9 place-items-center rounded-lg border border-[#E2E7E2] text-[#172019] lg:hidden hover:bg-[#EEF7EF]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="lg:hidden">
              <Link href={dashboardHref}>
                <Image
                  src="/agrihaat-logo.jpeg"
                  alt="AgriHaat AI"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain rounded-lg"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#687D6B]">
              <span className="font-semibold text-[#172019]">AgriHaat AI Platform</span>
              <span>/</span>
              <span className="capitalize">{role} Portal</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <QuickTutorialModal />
            <RoleSwitcherBadge />
            <LanguageSwitcher />
            <NotificationDrawer />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs top-[74px]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-white w-64 h-[calc(100vh-74px)] p-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? "bg-[#16803A] text-white" : "text-[#687D6B] hover:bg-[#EEF7EF]"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{lang === "hi" ? item.labelHi : item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-[#E2E7E2] pt-3">
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-2 text-xs font-medium text-[#dc2626] p-2"
                >
                  <LogOut className="size-3.5" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>

        {/* ─── Mobile Bottom Navigation Bar ─── */}
        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E2E7E2] px-3 py-2 flex items-center justify-around shadow-lg"
          aria-label="Mobile Bottom Navigation"
        >
          {navLinks.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2 rounded-lg transition ${
                  isActive ? "text-[#16803A]" : "text-[#687D6B]"
                }`}
              >
                <Icon className={`size-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span>{lang === "hi" ? item.labelHi : item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── Floating AI Chat Button ─── */}
      <button
        type="button"
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex items-center gap-2 rounded-full bg-[#16803A] px-4 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#16803A]/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AgriHaat AI Copilot"
      >
        <Sparkles className="size-4 text-emerald-200" />
        <span className="hidden sm:inline">{lang === "hi" ? "AI से पूछें" : "Ask AI"}</span>
      </button>

      {/* Floating AI Chat Popup Component */}
      <AIChatPopup isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}