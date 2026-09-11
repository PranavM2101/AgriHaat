"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "@/components/site/language-context";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-2 inset-x-2 z-50 bg-[#172019] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-[#16803A]/30">
      <div className="flex items-center gap-3">
        <img src="/agrihaat-logo.jpeg" alt="Logo" className="size-9 rounded-lg object-cover" />
        <div>
          <p className="text-xs font-bold">
            {lang === "hi" ? "AgriHaat एप डाउनलोड करें" : "Install AgriHaat App"}
          </p>
          <p className="text-[10px] text-[#D0E7D3]">
            {lang === "hi" ? "होमस्क्रीन पर जोड़ें" : "Add to home screen for fast access"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#16803A] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-xs hover:bg-[#12682F]"
        >
          <Download className="size-3.5" />
          <span>{lang === "hi" ? "इंस्टॉल" : "Install"}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}