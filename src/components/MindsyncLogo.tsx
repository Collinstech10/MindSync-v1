import React from "react";

interface MindsyncLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg" | "xl";
  lightText?: boolean;
  showSlogan?: boolean;
}

export default function MindsyncLogo({
  className = "",
  iconSize = 48,
  showText = true,
  textSize = "md",
  lightText = false,
  showSlogan = true,
}: MindsyncLogoProps) {
  // text sizing mapping
  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const sloganClasses = {
    sm: "text-[9px] mt-0.5",
    md: "text-[11px] mt-1",
    lg: "text-xs mt-1.5",
    xl: "text-sm mt-2",
  };

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Dynamic, High-Fidelity SVG Icon exactly matching user's uploaded logo */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Main high-agency gradient matching the user's logo branding */}
          <linearGradient id="mindsyncGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#57f1db" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#577df1" />
          </linearGradient>

          {/* Soft cloud background gradient */}
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#57f1db" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#577df1" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* 1. Cloud / Brain outline in background */}
        <path
          d="M 36,54 A 8,8 0 0,1 34,42 A 11,11 0 0,1 54,34 A 9,9 0 0,1 66,44 A 8,8 0 0,1 60,54 Z"
          stroke="url(#mindsyncGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="url(#cloudGradient)"
          opacity="0.45"
        />

        {/* 2. Top-Left Sync Arc */}
        <path
          d="M 24,72 A 36,36 0 1,1 82,32"
          stroke="url(#mindsyncGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3. Bottom-Right Sync Arc */}
        <path
          d="M 76,28 A 36,36 0 1,1 18,68"
          stroke="url(#mindsyncGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. ECG / Heart rate pulse line */}
        <path
          d="M 10,50 L 28,50 L 32,45 L 37,65 L 44,24 L 51,76 L 58,38 L 63,50 L 90,50"
          stroke="url(#mindsyncGradient)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Brand Text & Slogan Segment */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline font-extrabold tracking-tight">
            <span className={`${textClasses[textSize]} text-white opacity-95`}>
              mind
            </span>
            <span className={`${textClasses[textSize]} text-[#57f1db]`}>
              sync
            </span>
          </div>
          {showSlogan && (
            <span
              className={`${sloganClasses[textSize]} font-medium tracking-wide text-slate-400 font-sans`}
            >
              Calm the alarm. Reclaim control.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
