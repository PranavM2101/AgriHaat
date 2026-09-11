"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCheck, ExternalLink, Calendar, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import { NotificationService } from "@/lib/services";
import { useLanguage } from "@/components/site/language-context";
import { useAuth } from "@/components/auth/auth-context";
import type { AppNotification } from "@/lib/store";
import Link from "next/link";

export function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const { lang } = useLanguage();
  const { user } = useAuth();

  const role = user?.role || "farmer";

  useEffect(() => {
    NotificationService.getNotifications().then(setAllNotifications);
  }, [open]);

  // Filter notifications strictly according to the active role
  const notifications = allNotifications.filter((n) => {
    if (role === "admin") return true;
    if (role === "farmer") return n.category === "PROCUREMENT" || n.category === "PAYMENT" || n.category === "PRICE" || n.category === "ORDER";
    if (role === "buyer") return n.category === "ORDER" || n.category === "PRICE";
    if (role === "hub") return n.category === "ORDER" || n.category === "PROCUREMENT";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead();
    setAllNotifications((prev: AppNotification[]) => prev.map((n: AppNotification) => ({ ...n, read: true })));
  };

  const getIcon = (cat: AppNotification["category"]) => {
    switch (cat) {
      case "ORDER":
        return <ShoppingBag className="size-4 text-[#16803A]" />;
      case "PROCUREMENT":
        return <Calendar className="size-4 text-[#16803A]" />;
      case "PRICE":
        return <TrendingUp className="size-4 text-[#16803A]" />;
      case "PAYMENT":
        return <DollarSign className="size-4 text-[#16803A]" />;
      default:
        return <Bell className="size-4 text-[#16803A]" />;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative grid size-9 place-items-center rounded-full border border-[#E2E7E2] bg-white text-[#172019] shadow-2xs hover:bg-[#EEF7EF] transition"
        aria-label="Open notifications"
      >
        <Bell className="size-4 text-[#172019]" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-[#16803A] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E7E2] px-5 py-4">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-[#16803A]" />
                <h3 className="font-serif text-lg font-semibold text-[#172019]">
                  {lang === "hi" ? "सूचनाएं" : "Notifications"}
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#EEF7EF] px-2 py-0.5 text-xs font-bold text-[#16803A]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-[#687D6B] hover:bg-[#EEF7EF]"
                aria-label="Close drawer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E2E7E2] p-2">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#687D6B]">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl transition ${
                      !n.read ? "bg-[#EEF7EF]/50" : "hover:bg-[#FAFAF7]"
                    }`}
                  >
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white border border-[#E2E7E2]">
                      {getIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#172019]">
                        {lang === "hi" ? n.titleHi : n.title}
                      </p>
                      <p className="mt-1 text-xs text-[#687D6B] leading-relaxed">
                        {lang === "hi" ? n.messageHi : n.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-[#687D6B]">
                        <span>{n.timestamp}</span>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1 text-[#16803A] font-semibold hover:underline"
                          >
                            View details <ExternalLink className="size-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {unreadCount > 0 && (
              <div className="border-t border-[#E2E7E2] p-3">
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E2E7E2] py-2 text-xs font-semibold text-[#172019] hover:bg-[#EEF7EF] transition"
                >
                  <CheckCheck className="size-3.5 text-[#16803A]" /> Mark all as read
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}
