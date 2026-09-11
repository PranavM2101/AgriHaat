"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Check, User, ShoppingBag, Truck, Shield } from "lucide-react";
import { useAuth, UserRole } from "@/components/auth/auth-context";

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; icon: React.ComponentType<{ className?: string }>; route: string }
> = {
  farmer: {
    label: "Farmer Mode",
    icon: User,
    route: "/farmer/dashboard",
  },
  buyer: {
    label: "Buyer Mode",
    icon: ShoppingBag,
    route: "/buyer/dashboard",
  },
  hub: {
    label: "Collection Hub",
    icon: Truck,
    route: "/logistics/dashboard",
  },
  admin: {
    label: "Admin Portal",
    icon: Shield,
    route: "/admin/dashboard",
  },
};

export function RoleSwitcherBadge() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loginAsDemo } = useAuth();
  const [open, setOpen] = useState(false);

  // Infer active role from current URL path if user state is out of sync
  const getRoleFromPath = (): UserRole => {
    if (pathname.startsWith("/buyer")) return "buyer";
    if (pathname.startsWith("/logistics") || pathname.startsWith("/procurement-center")) return "hub";
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/farmer")) return "farmer";
    return user?.role || "farmer";
  };

  const activeRole: UserRole = getRoleFromPath();
  const currentConfig = ROLE_CONFIG[activeRole] || ROLE_CONFIG.farmer;
  const ActiveIcon = currentConfig.icon;

  const handleSelect = (role: UserRole) => {
    loginAsDemo(role);
    setOpen(false);
    router.push(ROLE_CONFIG[role].route);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF7EF] border border-[#D0E7D3] text-xs font-bold text-[#16803A] hover:bg-[#E2F0E4] transition-colors"
      >
        <ActiveIcon className="size-3.5" />
        <span className="capitalize">{currentConfig.label}</span>
        <ChevronDown className="size-3 opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E7E2] py-1 z-50">
          <div className="px-3 py-1.5 border-b border-[#E2E7E2]">
            <p className="text-[10px] font-semibold text-[#687D6B]">Active Profile</p>
            <p className="text-xs font-bold text-[#172019] truncate">{user?.name || "Guest User"}</p>
          </div>

          {(Object.keys(ROLE_CONFIG) as UserRole[]).map((r) => {
            const config = ROLE_CONFIG[r];
            const Icon = config.icon;
            const isSelected = activeRole === r;

            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#F8FAF8] transition-colors"
              >
                <div className="flex items-center gap-2 text-[#172019]">
                  <Icon className="size-3.5 text-[#16803A]" />
                  <span>{config.label}</span>
                </div>
                {isSelected && <Check className="size-3.5 text-[#16803A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}