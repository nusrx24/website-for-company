"use client";

import React, { useState } from "react";
import {
  Monitor,
  Cpu,
  Cloud,
  Store,
  Sparkles,
  List,
  Orbit,
  ExternalLink,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";

export interface PricingTier {
  name: string;
  description: string;
  price_prefix?: string;
  price: string;
  featured?: boolean;
  features: string[];
  enquiry?: string;
}

export interface PricingOrbitalProps {
  eyebrow?: string;
  title?: string;
  content?: string;
  cta_label?: string;
  note?: string;
  tiers?: PricingTier[];
}

const tierIcons: Record<string, React.ElementType> = {
  "Offline Desktop": Monitor,
  "Desktop Application": Cpu,
  "Cloud + Mobile": Cloud,
  "Software + Hardware": Store,
};

const defaultTiers: PricingTier[] = [
  {
    name: "Offline Desktop",
    description:
      "A complete system that runs on the shop computer, with no internet needed.",
    price_prefix: "Starting from (One-Time)",
    price: "LKR 30,000+",
    features: [
      "One-time payment • Rs. 0/mo",
      "Runs fully offline",
      "Single location",
      "Installed and configured for you",
    ],
    enquiry: "Hello LapCircuit, I would like a quote for the Offline Desktop POS system.",
  },
  {
    name: "Desktop Application",
    description: "A dedicated desktop application built around your workflow.",
    price_prefix: "Starting from (One-Time)",
    price: "LKR 35,000+",
    features: [
      "One-time payment • Rs. 0/mo",
      "Dedicated application",
      "Workflow customization",
      "Training for your team",
    ],
    enquiry: "Hello LapCircuit, I would like a quote for the Desktop Application system.",
  },
  {
    name: "Cloud + Mobile",
    description:
      "Desktop and mobile access to the same system, so you can check the business from anywhere.",
    price_prefix: "Starting from (One-Time)",
    price: "LKR 55,000+",
    featured: true,
    features: [
      "One-time payment • Rs. 0/mo",
      "Desktop + mobile access",
      "Suitable for multiple branches",
      "Reporting on the move",
    ],
    enquiry: "Hello LapCircuit, I would like a quote for the Cloud + Mobile POS solution.",
  },
  {
    name: "Software + Hardware",
    description:
      "A complete counter setup — software plus the hardware to run it.",
    price_prefix: "Around (One-Time)",
    price: "LKR 120,000+",
    features: [
      "One-time payment • Rs. 0/mo",
      "Software and setup",
      "Barcode scanner, printer, cash drawer",
      "Depends on configuration",
    ],
    enquiry: "Hello LapCircuit, I would like a quote for the complete Software + Hardware setup.",
  },
];

export function PricingOrbital({
  eyebrow = "TRANSPARENT PRICING",
  title = "CLEAR STARTING PRICES. NO GUESSWORK.",
  content = "Every business needs something slightly different, so we publish where each solution starts rather than hiding it behind a call.",
  cta_label = "Request a Quote",
  note = "Starting prices only. Final pricing depends on features, customization, number of users, branches, integrations, hardware and your business requirements.",
  tiers = defaultTiers,
}: PricingOrbitalProps) {
  const [activeTab, setActiveTab] = useState<"orbital" | "list">("orbital");

  // Map tiers into timeline items for the orbital visualization
  const orbitalData: TimelineItem[] = tiers.map((tier, idx) => {
    const IconComponent =
      tierIcons[tier.name] ||
      (tier.featured ? Cloud : idx % 2 === 0 ? Monitor : Store);

    const related = [];
    if (idx > 0) related.push(idx); // previous
    if (idx < tiers.length - 1) related.push(idx + 2); // next

    return {
      id: idx + 1,
      title: tier.name,
      date: "Paid Once For Life",
      content: tier.description,
      category: "One-Time • Rs. 0/mo",
      icon: IconComponent,
      price: tier.price,
      relatedIds: related,
      status: tier.featured
        ? ("completed" as const)
        : idx === 1
        ? ("in-progress" as const)
        : ("pending" as const),
      energy: tier.featured ? 98 : idx === 3 ? 100 : 75 + idx * 8,
      features: tier.features,
      ctaText: cta_label,
      popular: tier.featured,
    };
  });

  const getWhatsappUrl = (enquiryText?: string) => {
    const text = enquiryText || "Hello LapCircuit, I would like to enquire about your pricing.";
    return `https://wa.me/94770000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full bg-[#030508] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Intro Header & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-3">
            {eyebrow && (
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-[#2E90FF] uppercase">
                {eyebrow}
              </p>
            )}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight hasHighlight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {content && (
              <p
                className="text-sm sm:text-base text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* Toggle pill */}
          <div className="inline-flex items-center p-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md self-start md:self-end">
            <button
              type="button"
              onClick={() => setActiveTab("orbital")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all ${
                activeTab === "orbital"
                  ? "bg-[#2E90FF] text-white shadow-[0_0_16px_rgba(46,144,255,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Orbit size={14} />
              <span>Orbital 3D View</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all ${
                activeTab === "list"
                  ? "bg-[#2E90FF] text-white shadow-[0_0_16px_rgba(46,144,255,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List size={14} />
              <span>Rate Sheet</span>
            </button>
          </div>
        </div>

        {/* Zero-Subscription Lifetime Promise Banner */}
        <div className="mb-10 relative overflow-hidden rounded-2xl border border-[#2E90FF]/40 bg-gradient-to-r from-[#07152B]/95 via-[#0B1E3D] to-[#040D1C]/95 p-5 sm:p-7 backdrop-blur-xl shadow-[0_0_35px_rgba(46,144,255,0.2)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2E90FF]/25 text-[#2E90FF] border border-[#2E90FF]/40 shadow-[0_0_15px_rgba(46,144,255,0.35)]">
                <ShieldCheck className="size-6 text-[#60A5FA]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#93C5FD] uppercase">
                    The Zero-Subscription Guarantee
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                    100% Lifetime Ownership
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Every package below is a <strong className="text-white">one-time payment</strong>. You own your system for life.{" "}
                  <span className="text-emerald-400 font-semibold">Zero monthly subscriptions. Zero recurring software fees.</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Monthly Rent: <strong className="text-white">Rs. 0</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                <span className="size-2 rounded-full bg-[#2E90FF]"></span>
                <span>Ownership: <strong className="text-white">Forever</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode 1: 3D Radial Orbital System */}
        {activeTab === "orbital" && (
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#060912] to-[#030508] p-2 sm:p-4 shadow-2xl relative overflow-hidden">
            <div className="text-center pt-4 pb-2">
              <span className="text-xs font-mono tracking-widest text-[#2E90FF] uppercase bg-[#2E90FF]/10 px-3 py-1 rounded-full border border-[#2E90FF]/20">
                Click any satellite node to inspect tier details &bull; One-Time Payment Forever
              </span>
            </div>
            <RadialOrbitalTimeline
              timelineData={orbitalData}
              centerTitle="LAPCIRCUIT"
              centerSubtitle="ONE-TIME PRICING"
            />
          </div>
        )}

        {/* View Mode 2: Sleek Interactive Rate Sheet */}
        {activeTab === "list" && (
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-md divide-y divide-white/10 shadow-2xl">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`grid gap-6 p-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-8 transition-colors ${
                  tier.featured
                    ? "bg-[#2E90FF]/[0.08] relative border-l-4 border-l-[#2E90FF]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="lg:col-span-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span className="inline-flex items-center rounded-full border border-[#2E90FF]/40 bg-[#2E90FF]/15 px-3 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#2E90FF] uppercase">
                        Most popular
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                      One-Time &bull; Rs. 0/mo
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {tier.description}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  {tier.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {tier.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center gap-2.5 text-xs text-slate-300"
                        >
                          <Check className="size-3.5 text-emerald-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="lg:col-span-3 lg:text-right space-y-2">
                  <div className="flex flex-wrap lg:justify-end items-center gap-2">
                    {tier.price_prefix && (
                      <span className="block font-mono text-xs tracking-wider text-slate-400 uppercase">
                        {tier.price_prefix}
                      </span>
                    )}
                  </div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#2E90FF] tracking-tight tabular-nums">
                    {tier.price}
                  </span>
                  <span className="block text-[11px] font-mono text-slate-400">
                    Yours for life &bull; Zero monthly fees
                  </span>
                  <a
                    href={getWhatsappUrl(tier.enquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:border-[#2E90FF] hover:bg-[#2E90FF]/20 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all"
                  >
                    <span>{cta_label}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Note Footer */}
        {note && (
          <p className="mt-8 max-w-3xl border-l-2 border-[#2E90FF]/60 pl-4 font-mono text-xs leading-relaxed text-slate-400">
            {note}
          </p>
        )}

        {/* Bottom Headline Banner: "Built for your business. Paid once. Yours for life." */}
        <div className="mt-14 sm:mt-18 relative overflow-hidden rounded-3xl border border-[#2E90FF]/35 bg-gradient-to-r from-[#07152B] via-[#0B1E3D] to-[#040D1C] p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(46,144,255,0.18)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2E90FF]/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-[#1d4ed8]/20 blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E90FF]/15 border border-[#2E90FF]/30 text-xs font-mono text-[#2E90FF] font-semibold uppercase mb-4">
                <Check className="size-3.5" />
                <span>The LapCircuit Commitment</span>
              </div>
              <h3 className="font-['Clash_Display',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                Built for your business. Paid once. Yours for life.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Say goodbye to recurring subscription lock-ins and unpredictable renewal costs.
                Experience custom Sri Lankan software engineered directly for how your staff and business thrive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <a
                href={getWhatsappUrl("Hello LapCircuit, I want to learn more about your One-Time Payment POS software.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2E90FF] hover:bg-[#1B7FE8] text-white font-['Clash_Display',sans-serif] font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(46,144,255,0.45)] transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Talk Directly to Founders</span>
                <ArrowRight className="size-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200"
              >
                <span>Book Live Counter Demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingOrbital;
