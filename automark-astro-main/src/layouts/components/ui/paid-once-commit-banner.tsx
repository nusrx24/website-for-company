"use client";

import * as React from "react";
import { CommitsGrid } from "@/components/ui/commits-grid";
import { ShieldCheck, Zap, Sparkles, RotateCw } from "lucide-react";

const WORDS = [
  { label: "Paid Once", value: "PAID ONCE" },
  { label: "Lifetime", value: "LIFETIME" },
  { label: "Zero Sub", value: "ZERO SUB" },
];

export interface PaidOnceCommitBannerProps {
  className?: string;
  initialWord?: string;
}

export const PaidOnceCommitBanner: React.FC<PaidOnceCommitBannerProps> = ({
  className = "",
  initialWord = "PAID ONCE",
}) => {
  const [activeWord, setActiveWord] = React.useState(initialWord);
  const [animationKey, setAnimationKey] = React.useState(0);

  const handleWordSelect = (word: string) => {
    setActiveWord(word);
    setAnimationKey((prev) => prev + 1);
  };

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative w-full max-w-md mx-auto rounded-2xl border border-[#2E90FF]/40 bg-[#030712]/30 backdrop-blur-xl p-3.5 sm:p-4.5 shadow-[0_0_40px_rgba(46,144,255,0.18)] shine-border overflow-hidden transition-all ${className}`}
    >
      {/* Top Header Badge Row */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/40 backdrop-blur-sm shadow-[0_0_12px_rgba(46,144,255,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Lifetime License
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono text-text-light">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="font-semibold text-white">Zero Monthly Fees</span>
          </div>

          <button
            type="button"
            onClick={handleReplay}
            title="Replay wave animation"
            className="p-1 rounded-md text-text-dark hover:text-primary hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Word Switcher Tabs */}
      <div className="flex items-center justify-center gap-1.5 mb-3 p-1 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 relative z-10">
        {WORDS.map((item) => {
          const isActive = activeWord === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleWordSelect(item.value)}
              className={`flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-mono font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary text-black shadow-[0_0_16px_rgba(46,144,255,0.7)] scale-[1.02]"
                  : "text-text-dark hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Animated Commits Grid Display */}
      <div className="w-full relative rounded-xl overflow-hidden my-2.5 p-1 bg-black/10 backdrop-blur-sm border border-primary/25 relative z-10">
        <CommitsGrid
          key={`${activeWord}-${animationKey}`}
          text={activeWord}
          className="border-none p-1 sm:p-2 bg-transparent"
        />
      </div>

      {/* Key Value Highlights */}
      <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] sm:text-xs font-mono relative z-10">
        <div className="flex items-center gap-1.5 text-text-light">
          <Zap className="w-3.5 h-3.5 text-primary shrink-0 drop-shadow-[0_0_6px_rgba(46,144,255,0.6)]" />
          <span className="font-medium">Yours For Life</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-light">
          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 drop-shadow-[0_0_6px_rgba(46,144,255,0.6)]" />
          <span className="font-medium">No Monthly Dues</span>
        </div>
      </div>

      {/* Micro-footer note */}
      <div className="mt-2 text-center text-[10px] sm:text-[11px] font-mono text-text-dark relative z-10">
        Offline desktop + cloud hybrid POS • Solutions from{" "}
        <span className="text-primary font-bold tracking-wide">LKR 30,000+</span>
      </div>
    </div>
  );
};

export default PaidOnceCommitBanner;
