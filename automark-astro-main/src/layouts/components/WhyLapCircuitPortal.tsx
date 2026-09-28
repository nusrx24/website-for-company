"use client";

import React from "react";
import GlyphPortal from "@/components/ui/glyph-portal";

export interface WhyLapCircuitPortalProps {
  eyebrow?: string;
  title?: string;
  content?: string;
  items?: Array<{
    title: string;
    content: string;
  }>;
}

const defaultItems = [
  {
    title: "Customized",
    content:
      "Built around the way your business already works, rather than asking you to change your workflow to fit the software.",
  },
  {
    title: "Easy to manage",
    content:
      "Practical interfaces designed to be understood by the people who use them every day, not only by the person who bought the system.",
  },
  {
    title: "Affordable",
    content:
      "Transparent starting prices published openly, so you know the range before you contact us.",
  },
  {
    title: "Flexible",
    content:
      "Offline desktop, a dedicated desktop application, or cloud with desktop and mobile access — whichever suits how you operate.",
  },
  {
    title: "Multi-language",
    content:
      "Tamil, English and Sinhala, so your staff can work in the language they are most comfortable with.",
  },
  {
    title: "Direct support",
    content:
      "You talk to the people who built your system. No ticket queue and no call centre in between.",
  },
];

const icons: Record<string, React.ReactNode> = {
  Customized: (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.376 3.622a1 1 0 013.002 3.002L7.368 18.635a2 2 0 01-.855.506l-2.872.838a.5.5 0 01-.62-.62l.838-2.872a2 2 0 01.506-.854z" />
    </svg>
  ),
  "Easy to manage": (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
    </svg>
  ),
  Affordable: (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v2m0 8v2m-4-6h2m4 0h2" />
    </svg>
  ),
  Flexible: (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 6h8M8 10h8" />
    </svg>
  ),
  "Multi-language": (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  "Direct support": (
    <svg className="size-6 text-[#2E90FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
};

export function WhyLapCircuitPortal({
  eyebrow = "WHY LAPCIRCUIT",
  title = "Why businesses choose us.",
  content = "We are a small team that works directly with business owners. That shapes what we build and how we support it.",
  items = defaultItems,
}: WhyLapCircuitPortalProps) {
  return (
    <div className="relative w-full bg-[#030508] text-white">
      <GlyphPortal
        word="LAPCIRCUIT"
        scrollLength={2.6}
        fontWeight={900}
        fontFamily='"Outfit", "Inter", -apple-system, sans-serif'
        enterLabel="Step Inside"
        interactive={true}
        style={{
          "--gp-paper": "#030508",
          "--gp-field": "#04070D",
          "--gp-ink": "#ffffff",
          "--gp-foreground": "#ffffff",
        }}
        background={
          <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#030508]">
            {/* Realistic hardware image backdrop */}
            <img
              src="/images/lapcircuit-portal-bg.jpg"
              alt="LapCircuit hardware terminal lighting"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            {/* Ambient vignette and electric cyan reflections */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030508] via-transparent to-[#030508]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030508]/90 via-transparent to-[#030508]/90 pointer-events-none" />
            {/* Center glow behind the word */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[35vw] rounded-full bg-[#2E90FF]/15 blur-[120px] pointer-events-none" />
          </div>
        }
        front={
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 lg:p-16 select-none z-10">
            {/* Top Navigation Bar from Reference */}
            <div className="w-full flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 font-bold text-lg tracking-tight text-white pointer-events-auto">
                <span>lapcircuit</span>
                <span className="text-[#2E90FF] text-xl leading-none">.</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-xs tracking-wider uppercase">
                <span>Software</span>
                <span className="text-[#2E90FF]">•</span>
                <span>Hardware</span>
                <span className="text-[#2E90FF]">•</span>
                <span>Business Systems</span>
              </div>
            </div>

            {/* Central Eyebrow & Subtitle surrounding the giant word */}
            <div className="w-full text-center space-y-4 my-auto">
              <p className="text-xs sm:text-sm md:text-base font-medium tracking-wide text-slate-300">
                Technology engineered for{" "}
                <span className="text-[#2E90FF] font-semibold drop-shadow-[0_0_12px_rgba(46,144,255,0.7)]">
                  modern businesses.
                </span>
              </p>

              {/* Subtitle below the giant word */}
              <div className="pt-[14vw] max-[600px]:pt-[24vw] max-w-2xl mx-auto px-4">
                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed">
                  We build software, POS systems, inventory, billing and cloud solutions for growing businesses in Sri Lanka.
                </p>
              </div>
            </div>

            {/* Bottom space intentionally left open for caption and Step Inside button */}
            <div className="w-full h-12" />
          </div>
        }
      >
        {/* INSIDE THE PORTAL: Why LapCircuit Redesign */}
        <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header intro */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2E90FF]/30 bg-[#2E90FF]/10 text-xs font-mono font-semibold tracking-[0.2em] text-[#2E90FF] uppercase">
              <span>{eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {content}
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md transition-all duration-300 hover:border-[#2E90FF]/50 hover:bg-[#2E90FF]/[0.06] hover:shadow-[0_0_30px_rgba(46,144,255,0.2)] hover:-translate-y-1"
              >
                <div>
                  {/* Top card row: Icon + Index Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-white/15 bg-[#030508]/80 shadow-inner group-hover:border-[#2E90FF]/40 group-hover:bg-[#2E90FF]/15 transition-colors duration-300">
                      {icons[item.title] || (
                        <div className="size-3 rounded-full bg-[#2E90FF]" />
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest text-[#2E90FF]/80 group-hover:text-[#2E90FF] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2.5 group-hover:text-[#2E90FF] transition-colors">
                    {item.title}
                  </h3>

                  {/* Body Content */}
                  <p className="text-sm leading-relaxed text-slate-300">
                    {item.content}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>LapCircuit Core</span>
                  <span className="text-[#2E90FF] opacity-0 group-hover:opacity-100 transition-opacity">
                    &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlyphPortal>
    </div>
  );
}
export default WhyLapCircuitPortal;
