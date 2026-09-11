"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Sparkles, SlidersHorizontal } from "lucide-react";

type FarmerMode = "basic" | "advanced";

interface FarmerModeContextType {
  mode: FarmerMode;
  isBasic: boolean;
  toggleMode: () => void;
  setMode: (mode: FarmerMode) => void;
}

const FarmerModeContext = createContext<FarmerModeContextType>({
  mode: "basic",
  isBasic: true,
  toggleMode: () => {},
  setMode: () => {},
});

export function FarmerModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<FarmerMode>("basic");

  useEffect(() => {
    const saved = localStorage.getItem("agrihaat_farmer_mode") as FarmerMode | null;
    if (saved) setModeState(saved);
  }, []);

  const setMode = (newMode: FarmerMode) => {
    setModeState(newMode);
    localStorage.setItem("agrihaat_farmer_mode", newMode);
  };

  const toggleMode = () => {
    setMode(mode === "basic" ? "advanced" : "basic");
  };

  return (
    <FarmerModeContext.Provider
      value={{
        mode,
        isBasic: mode === "basic",
        toggleMode,
        setMode,
      }}
    >
      {children}
    </FarmerModeContext.Provider>
  );
}

export function useFarmerMode() {
  return useContext(FarmerModeContext);
}

export function FarmerModeToggle() {
  const { mode, toggleMode } = useFarmerMode();
  const isBasic = mode === "basic";

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E7E2] shadow-xs hover:border-[#16803A] transition-all"
    >
      <div className="flex items-center gap-1.5">
        {isBasic ? (
          <Sparkles className="size-3.5 text-[#16803A]" />
        ) : (
          <SlidersHorizontal className="size-3.5 text-[#16803A]" />
        )}
        <span className="text-xs font-bold text-[#172019]">
          {isBasic ? "Basic Mode (सरल)" : "Advanced Mode (विस्तृत)"}
        </span>
      </div>
      <div className="w-8 h-4 bg-[#EEF7EF] border border-[#D0E7D3] rounded-full relative p-0.5 transition-colors">
        <div
          className={`w-3 h-3 bg-[#16803A] rounded-full transition-transform ${
            !isBasic ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}