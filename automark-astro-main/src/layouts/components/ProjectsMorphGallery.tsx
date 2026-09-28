"use client";

import React, { useState, useEffect } from "react";
import ScrollMorphProjects from "./ui/scroll-morph-projects";
import ScrollMorphMobile from "./ui/scroll-morph-mobile";
import ConstellationBackground from "./ui/constellation-background";
import { Store, ShieldCheck, ArrowRight, Smartphone, Orbit } from "lucide-react";

export default function ProjectsMorphGallery() {
  const [viewMode, setViewMode] = useState<"auto" | "mobile" | "3d">("auto");
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isMobileView =
    viewMode === "mobile" || (viewMode === "auto" && isMobileScreen);

  return (
    <div className="relative w-full mt-10 lg:mt-14 overflow-hidden rounded-3xl border border-[#2E90FF]/30 bg-[#030712]/90 backdrop-blur-xl p-3 sm:p-6 lg:p-8 shadow-[0_0_50px_rgba(46,144,255,0.12)]">
      {/* Dynamic Kinetic Constellation Grid Mesh Background */}
      <ConstellationBackground
        className="absolute inset-0 z-0 pointer-events-none"
        accentColor="#2E90FF"
        nodeColor="46, 144, 255"
        spacing={52}
        lineOpacity={0.3}
        baseNodeOpacity={0.4}
        interactiveRadius={200}
      />

      {/* Ambient Blue Glow Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#2E90FF]/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#1d4ed8]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full">
        {/* Top Banner Feature Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-[#2E90FF]/25 bg-[#061122]/85 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#2E90FF]/15 border border-[#2E90FF]/35 flex items-center justify-center text-[#2E90FF] shrink-0">
              <Store className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-['Clash_Display',sans-serif] text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                  Deployment Photo Gallery
                </h4>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-medium">
                  <ShieldCheck className="size-3" />
                  <span>Zero Stock Photos</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                20+ verified real-world photo milestones across grocery, wholesale, mobile & distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end">
            {/* Mode Switcher Toggle (Mobile Deck vs 3D Orbit) */}
            <div className="flex items-center p-0.5 rounded-xl bg-[#030914] border border-[#2E90FF]/35">
              <button
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isMobileView
                    ? "bg-[#2E90FF] text-white font-semibold shadow-[0_0_10px_rgba(46,144,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Touch-friendly Card Deck"
              >
                <Smartphone className="size-3.5" />
                <span className="text-[11px]">Touch Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  !isMobileView
                    ? "bg-[#2E90FF] text-white font-semibold shadow-[0_0_10px_rgba(46,144,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
                title="3D Orbit Morph Arc"
              >
                <Orbit className="size-3.5" />
                <span className="text-[11px]">3D Orbit</span>
              </button>
            </div>

            <a
              href="https://wa.me/94711249740?text=Hello%20LapCircuit%2C%20I%20want%20to%20see%20a%20live%20POS%20demo%20at%20my%20counter."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E90FF] hover:bg-[#1B7FE8] text-white font-mono text-xs font-semibold transition-colors shadow-[0_0_15px_rgba(46,144,255,0.35)] shrink-0"
            >
              <span>Book Live Demo</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Main Interactive Stage */}
        {!mounted ? (
          <>
            <div className="block md:hidden">
              <ScrollMorphMobile onSwitchTo3D={() => setViewMode("3d")} />
            </div>
            <div className="hidden md:block">
              <ScrollMorphProjects onSwitchToDeck={() => setViewMode("mobile")} />
            </div>
          </>
        ) : isMobileView ? (
          <ScrollMorphMobile onSwitchTo3D={() => setViewMode("3d")} />
        ) : (
          <ScrollMorphProjects onSwitchToDeck={() => setViewMode("mobile")} />
        )}
      </div>
    </div>
  );
}
