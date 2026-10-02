"use client";

import React, { useState, useEffect } from "react";
import { LAPCIRCUIT_CHIPS, type BucketItem } from "@/components/ui/bucket";
import PosCounter3D from "@/components/ui/pos-counter-3d";
import TextLoop from "@/components/ui/text-loop";
import {
  ShieldCheck,
  Sliders,
  CheckCircle2,
  BadgeDollarSign,
  Smartphone,
  Languages,
  Headphones,
  Sparkles,
  Check,
} from "lucide-react";
import ConstellationBackground from "@/components/ui/constellation-background";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { whatsappUrl } from "@/lib/utils/contact";

export interface WhyLapCircuitBucketProps {
  eyebrow?: string;
  title?: string;
  content?: string;
}

export function WhyLapCircuitBucket({
  eyebrow = "WHY LAPCIRCUIT",
  title = "Why businesses choose Lap Circuit",
  content = "We’re a small team that works directly with business owners. That means we understand how your business actually operates—and build software around it.",
}: WhyLapCircuitBucketProps) {
  // activeId tracks 1 to 7 sequentially
  const [activeId, setActiveId] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-rotate through all 7 pillars: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 1
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveId((prev) => (prev >= LAPCIRCUIT_CHIPS.length ? 1 : prev + 1));
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeItem =
    LAPCIRCUIT_CHIPS.find((i) => i.id === activeId) || LAPCIRCUIT_CHIPS[0];

  const handleCardClick = (id: number) => {
    setActiveId(id);
    // Briefly pause so user can inspect the clicked card before next cycle
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <section className="relative w-full pt-28 pb-24 sm:pt-36 sm:pb-32 overflow-hidden bg-[#030508] text-white font-primary">
      {/* Dynamic Kinetic Constellation Grid Mesh Background */}
      <ConstellationBackground
        className="absolute inset-0 z-0 pointer-events-none"
        accentColor="#2E90FF"
        nodeColor="46, 144, 255"
        spacing={58}
        lineOpacity={0.25}
        baseNodeOpacity={0.35}
        interactiveRadius={220}
      />

      {/* Background Ambient Lighting & Neon Blue Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2E90FF]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-10 -left-40 w-96 h-96 bg-[#1d4ed8]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#2E90FF]/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#2E90FF 1px, transparent 1px), linear-gradient(to right, #2E90FF 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2E90FF]/35 bg-[#2E90FF]/10 text-xs font-primary font-semibold tracking-[0.22em] text-[#2E90FF] uppercase shadow-[0_0_20px_rgba(46,144,255,0.2)]">
            <span className="size-1.5 rounded-full bg-[#2E90FF] animate-pulse" />
            <span>{eyebrow}</span>
          </div>

          <div className="mt-5 flex justify-center w-full">
            <TextLoop
              staticText="Why businesses choose"
              rotatingTexts={["Lap Circuit.", "custom POS.", "zero monthly fees.", "lifetime support."]}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-secondary font-bold tracking-tight text-white uppercase leading-[1.1] justify-center mx-auto text-center flex-col items-center sm:flex-row sm:flex-wrap"
              staticTextClassName="text-white mr-0 sm:mr-3 whitespace-normal sm:whitespace-nowrap"
              rotatingTextClassName="text-primary pr-1 font-secondary font-bold uppercase drop-shadow-[0_0_16px_rgba(46,144,255,0.5)]"
              cursorClassName="bg-primary shadow-[0_0_10px_rgba(46,144,255,0.8)]"
              backgroundClassName="bg-gradient-to-r from-transparent via-primary/15 to-primary/25 rounded"
              interval={2800}
            />
          </div>

          <p className="mt-5 text-base sm:text-lg md:text-xl font-primary text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {content}
          </p>
        </div>

        {/* Main Interactive Stage: Dark Blue 3D Bucket & 7 Value Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 3D Animated Bucket Box in Dark Navy Blue */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* Box Container with Glowing Backdrop */}
            <div className="relative w-full flex flex-col items-center p-6 sm:p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-[#07152B]/60 to-[#040D1C]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] shine-border">
              {/* Radial light behind box */}
              <div className="absolute inset-0 bg-radial-gradient from-[#2E90FF]/15 via-transparent to-transparent pointer-events-none rounded-3xl" />

              {/* One sale riding the POS counter, station by station. */}
              <PosCounter3D />


              {/* Active Chip Details Spotlight Card */}
              <div className="w-full mt-2 p-4 sm:p-5 rounded-2xl border border-[#2E90FF]/30 bg-[#0B1E3D]/80 backdrop-blur-md transition-all duration-300 shine-border">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#2E90FF]">
                      PILLAR 0{activeItem.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E90FF]/20 text-[#2E90FF] border border-[#2E90FF]/30 font-mono font-medium">
                      {activeItem.badge}
                    </span>
                  </div>
                </div>
                <h4 className="font-secondary text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeItem.title}
                </h4>
                <p className="mt-1 font-primary text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {activeItem.fullDescription}
                </p>
              </div>

              {/* Quick Number Selector Tabs */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5">
                {LAPCIRCUIT_CHIPS.map((chip) => {
                  const isActive = chip.id === activeId;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleCardClick(chip.id)}
                      className={`size-8 sm:size-9 rounded-xl font-mono text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                        isActive
                          ? "bg-[#2E90FF] text-white shadow-[0_0_15px_rgba(46,144,255,0.6)] scale-110"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                      title={chip.title}
                    >
                      {chip.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 7 Pillars Cards List */}
          <div className="lg:col-span-6 flex flex-col gap-3.5">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-mono tracking-widest text-[#2E90FF] uppercase">
                Explore The 7 Pillars
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Click any pillar to drop
              </span>
            </div>

            {LAPCIRCUIT_CHIPS.map((pillar) => {
              const isActive = pillar.id === activeId;
              const Icon = pillar.icon || Sparkles;

              return (
                <div
                  key={pillar.id}
                  onClick={() => handleCardClick(pillar.id)}
                  className={`group relative flex items-start gap-4 p-4 sm:p-4.5 rounded-2xl cursor-pointer transition-all duration-300 border shine-border ${
                    isActive
                      ? "border-[#2E90FF] bg-gradient-to-r from-[#07152B] via-[#0B1E3D] to-[#07152B] shadow-[0_0_30px_rgba(46,144,255,0.25)] ring-1 ring-[#2E90FF]/40 -translate-y-0.5"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Icon Box */}
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive
                        ? "bg-[#2E90FF] text-white shadow-[0_0_15px_rgba(46,144,255,0.5)]"
                        : "bg-[#030508]/80 text-[#2E90FF] border border-white/10 group-hover:border-[#2E90FF]/40 group-hover:bg-[#2E90FF]/10"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* Body Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2E90FF]">
                          0{pillar.id}
                        </span>
                        <h3
                          className={`font-secondary text-sm sm:text-base font-semibold tracking-tight transition-colors duration-200 ${
                            isActive
                              ? "text-white"
                              : "text-slate-200 group-hover:text-white"
                          }`}
                        >
                          {pillar.title}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border shrink-0 hidden sm:inline-block ${
                          isActive
                            ? "bg-[#2E90FF]/20 text-[#2E90FF] border-[#2E90FF]/40"
                            : "bg-white/5 text-slate-400 border-white/10"
                        }`}
                      >
                        {pillar.badge}
                      </span>
                    </div>

                    <p className="mt-1 font-primary text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {pillar.fullDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Headline Banner: "Built for your business. Paid once. Yours for life." */}
        <div className="mt-16 sm:mt-24 relative overflow-hidden rounded-3xl border border-[#2E90FF]/35 bg-gradient-to-r from-[#07152B] via-[#0B1E3D] to-[#040D1C] p-8 sm:p-12 backdrop-blur-xl shadow-[0_20px_60px_rgba(46,144,255,0.18)] shine-border">
          {/* Subtle neon ambient circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2E90FF]/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-[#1d4ed8]/20 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E90FF]/15 border border-[#2E90FF]/30 text-xs font-mono text-[#2E90FF] font-semibold uppercase mb-4">
                <Check className="size-3.5" />
                <span>The LapCircuit Commitment</span>
              </div>
              <h3 className="font-secondary text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                Built for your business. Paid once. Yours for life.
              </h3>
              <p className="mt-3 font-primary text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Say goodbye to recurring subscription lock-ins and unpredictable renewal costs.
                Experience custom Sri Lankan software engineered directly for how your staff and business thrive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <LiquidMetalButton
                label="Talk to our team"
                href={whatsappUrl("Hello LapCircuit, I would like to talk to your team about POS software for my business.")}
                fullWidth
                className="sm:inline-flex sm:w-auto"
              />

              <a
                href="#pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-primary font-medium text-sm transition-all duration-200"
              >
                <span>See pricing</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyLapCircuitBucket;
