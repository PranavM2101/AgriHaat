"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export function LogoIcon({ size = 38 }: { size?: number }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/logo-mark.png"
        alt="AgriHaat AI Logo"
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className="shrink-0 object-contain transition-transform duration-300 hover:scale-105 rounded-xl shadow-2xs"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="agriGradientEmerald" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16A34A" />
          <stop offset="0.6" stopColor="#16803A" />
          <stop offset="1" stopColor="#0B4B22" />
        </linearGradient>
        <linearGradient id="agriGradientGold" x1="14" y1="8" x2="40" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FACC15" />
          <stop offset="0.7" stopColor="#EAB308" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="agriGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF7EF" stopOpacity="0.8" />
          <stop offset="1" stopColor="#DCFCE7" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Outer rounded hexagon shield */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#agriGlow)" stroke="#16803A" strokeWidth="1.5" strokeOpacity="0.25" />

      {/* Sun */}
      <circle cx="24" cy="15" r="7" fill="url(#agriGradientGold)" opacity="0.35" />
      <circle cx="24" cy="15" r="3.5" fill="url(#agriGradientGold)" />

      {/* Furrow lines */}
      <path d="M7 38 C14 31, 20 33, 24 29 C28 33, 34 31, 41 38" stroke="#16803A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 42 C16 36, 21 38, 24 35 C27 38, 32 36, 38 42" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

      {/* Central Sprout */}
      <path
        d="M24 8 C17 15, 13.5 24, 24 33 C34.5 24, 31 15, 24 8 Z"
        fill="url(#agriGradientEmerald)"
      />

      {/* Internal Vein */}
      <path d="M24 13 L24 29" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M24 19 L19.5 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 23 L28.5 20" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "", size = 38, showBadge = true }: LogoProps) {
  const [useImageBrand, setUseImageBrand] = useState(true);

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {useImageBrand ? (
        <img
          src="/logo-main.png"
          alt="AgriHaat AI"
          height={size}
          onError={() => setUseImageBrand(false)}
          className="h-9 sm:h-10 w-auto object-contain shrink-0"
        />
      ) : (
        <>
          <LogoIcon size={size} />
          <div className="flex items-center">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#172019]">
              Agri<span className="text-[#16803A]">Haat</span>
            </span>
            {showBadge && (
              <span className="ml-2 rounded-md bg-gradient-to-r from-[#16803A] to-[#22C55E] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
                AI
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function LogoMark({ size = 38 }: { size?: number }) {
  return <LogoIcon size={size} />;
}

export function LogoWithTagline({ className = "", size = 38 }: LogoProps) {
  return (
    <div className={className}>
      <Logo size={size} />
      <p className="mt-1 text-[11px] font-medium tracking-wide text-[#687D6B]">
        Direct Roots. Stronger Tomorrow.
      </p>
    </div>
  );
}

