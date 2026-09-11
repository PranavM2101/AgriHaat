"use client";

import { FarmerModeProvider } from "@/components/app/farmer-mode-toggle";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return <FarmerModeProvider>{children}</FarmerModeProvider>;
}