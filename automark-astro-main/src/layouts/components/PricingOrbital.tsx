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
} from "lucide-react";
import RadialOrbitalTimeline, {
  type TimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { whatsappUrl } from "@/lib/utils/contact";
import { motion } from "motion/react";
import {
  LiquidMetalButton,
  LiquidMetalFrame,
  brushedMetalEdge,
} from "@/components/ui/liquid-metal-button";
import TextLoop from "@/components/ui/text-loop";
import {
  PricingCard,
  BGComponent1,
  BGComponent2,
  BGComponent3,
  BGComponent4,
} from "@/components/ui/squishy-pricing";

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
  const [activeTab, setActiveTab] = useState<"cards" | "orbital" | "list">("cards");

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
    return whatsappUrl(
      enquiryText || "Hello LapCircuit, I would like to enquire about your pricing.",
    );
  };

  return (
    <div className="w-full bg-[#030508] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Intro Header & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-3">
            {eyebrow && (
              <p className="font-primary text-xs font-semibold tracking-[0.2em] text-[#2E90FF] uppercase">
                {eyebrow}
              </p>
            )}
            <TextLoop
              staticText="Clear starting prices."
              rotatingTexts={["No guesswork.", "Zero hidden dues.", "Paid once.", "Yours for life."]}
              className="text-3xl sm:text-4xl lg:text-5xl font-secondary font-bold uppercase tracking-tight text-white leading-tight flex-col items-start sm:flex-row sm:items-center sm:flex-wrap"
              staticTextClassName="text-white mr-0 sm:mr-3 whitespace-normal sm:whitespace-nowrap"
              rotatingTextClassName="text-primary pr-1 font-secondary font-bold uppercase drop-shadow-[0_0_14px_rgba(46,144,255,0.45)]"
              cursorClassName="bg-primary shadow-[0_0_10px_rgba(46,144,255,0.8)]"
              backgroundClassName="bg-gradient-to-r from-transparent via-primary/15 to-primary/25 rounded"
              interval={2800}
            />
            {content && (
              <p
                className="text-sm sm:text-base text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* View switch: one chrome rim, the chosen view is the lit segment. */}
          <LiquidMetalFrame className="self-start md:self-end">
            <span role="group" aria-label="Pricing view" className="relative z-10 flex items-center gap-1 p-[5px]">
              {(
                [
                  { id: "cards", label: "Interactive cards", Icon: Sparkles },
                  { id: "orbital", label: "Orbital 3D view", Icon: Orbit },
                  { id: "list", label: "Rate sheet", Icon: List },
                ] as const
              ).map(({ id, label, Icon }) => {
                const on = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveTab(id)}
                    className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AABFF] ${
                      on ? "text-[#05070A]" : "text-[#8A94A3] hover:text-[#EEF2F8]"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="pricing-view-lit"
                        className="absolute inset-0 rounded-full bg-[#2E90FF] shadow-[0_0_18px_rgba(46,144,255,0.55)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon size={14} className="relative" />
                    <span className="relative">{label}</span>
                  </button>
                );
              })}
            </span>
          </LiquidMetalFrame>
        </div>

        {/* Zero-subscription guarantee */}
        <div className="mb-10 relative overflow-hidden rounded-2xl border-2 border-[#2E90FF]/50 bg-[linear-gradient(110deg,#0B1320_0%,#0E1A2C_55%,#080E18_100%)] p-5 sm:p-7 shadow-[0_0_35px_rgba(46,144,255,0.18)] shine-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2E90FF]/15 border border-[#2E90FF]/40">
                <ShieldCheck className="size-6 text-[#5AABFF]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h3 className="font-secondary text-lg font-semibold text-[#EEF2F8]">
                    The zero-subscription guarantee
                  </h3>
                  <span className="rounded-full border border-[#2E90FF]/45 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#5AABFF]">
                    Lifetime ownership
                  </span>
                </div>
                <p className="text-sm text-[#8A94A3] leading-relaxed">
                  Every package below is a one-time payment, and the system is yours for life.{" "}
                  <strong className="font-semibold text-[#EEF2F8]">No monthly subscription and no recurring software fees.</strong>
                </p>
              </div>
            </div>

            <dl className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto font-mono text-[11px]">
              <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5" style={brushedMetalEdge}>
                <span className="size-1.5 rounded-full bg-[#2E90FF] shadow-[0_0_8px_rgba(46,144,255,0.9)]" aria-hidden="true" />
                <dt className="text-[#8A94A3]">Monthly rent</dt>
                <dd className="font-semibold text-[#EEF2F8]">Rs. 0</dd>
              </div>
              <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5" style={brushedMetalEdge}>
                <span className="size-1.5 rounded-full bg-[#2E90FF] shadow-[0_0_8px_rgba(46,144,255,0.9)]" aria-hidden="true" />
                <dt className="text-[#8A94A3]">Ownership</dt>
                <dd className="font-semibold text-[#EEF2F8]">Forever</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* View Mode 1: Squishy Interactive Cards */}
        {activeTab === "cards" && (
          <div className="py-2">
            <div className="mx-auto flex w-full flex-wrap justify-center gap-6">
              {tiers.map((tier, idx) => {
                const bgStyles = [
                  "bg-gradient-to-br from-[#0B1B36] via-[#0E264D] to-[#061021] border-[#2E90FF]/60 hover:border-[#2E90FF]",
                  "bg-gradient-to-br from-[#1C1338] via-[#2A1B54] to-[#0E091F] border-purple-500/60 hover:border-purple-400",
                  "bg-gradient-to-br from-[#07243B] via-[#0D3B61] to-[#041524] border-[#00E5FF]/70 hover:border-[#00E5FF]",
                  "bg-gradient-to-br from-[#0D261E] via-[#143D30] to-[#061510] border-emerald-500/60 hover:border-emerald-400",
                ];
                const bgComponents = [BGComponent1, BGComponent2, BGComponent3, BGComponent4];
                const BG = bgComponents[idx % bgComponents.length];
                const cleanPrice = tier.price.replace(/^LKR\s*/i, "");

                return (
                  <PricingCard
                    key={tier.name}
                    label={tier.name}
                    monthlyPrice={cleanPrice}
                    pricePrefix="LKR "
                    period="One-Time"
                    description={tier.description}
                    cta={cta_label || "Request Quote"}
                    background={bgStyles[idx % bgStyles.length]}
                    BGComponent={BG}
                    badge={tier.featured ? "Most Popular" : idx === 3 ? "Complete Setup" : undefined}
                    features={tier.features}
                    href={getWhatsappUrl(tier.enquiry)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: 3D Radial Orbital System */}
        {activeTab === "orbital" && (
          <div className="rounded-2xl border-2 border-white/20 bg-gradient-to-b from-[#060912] to-[#030508] p-2 sm:p-4 shadow-2xl relative overflow-hidden shine-border">
            <div className="text-center pt-4 pb-2">
              <span className="font-mono text-xs text-[#8A94A3]">
                Tap a plan on the orbit to see what it includes.
              </span>
            </div>
            <RadialOrbitalTimeline
              timelineData={orbitalData}
              centerTitle="LAPCIRCUIT"
              centerSubtitle="ONE-TIME PRICING"
            />
          </div>
        )}

        {/* View Mode 3: Sleek Interactive Rate Sheet with individual bordered rectangles */}
        {activeTab === "list" && (
          <div className="space-y-4">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`rounded-2xl border-2 p-6 lg:p-8 grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-8 transition-all duration-300 shadow-xl shine-border ${
                  tier.featured
                    ? "bg-[#0B1528] border-[#2E90FF]/60 hover:border-[#2E90FF] shadow-[0_0_35px_rgba(46,144,255,0.18)]"
                    : "bg-[#060A14]/90 border-white/20 hover:border-[#2E90FF]/60 hover:bg-[#080E1C]"
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
        <div className="mt-14 sm:mt-18 relative overflow-hidden rounded-3xl border-2 border-[#2E90FF]/45 bg-gradient-to-r from-[#07152B] via-[#0B1E3D] to-[#040D1C] p-8 sm:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(46,144,255,0.18)] shine-border">
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
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Say goodbye to recurring subscription lock-ins and unpredictable renewal costs.
                Experience custom Sri Lankan software engineered directly for how your staff and business thrive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
              <LiquidMetalButton
                label="Talk to our team"
                href={getWhatsappUrl("Hello LapCircuit, I want to learn more about your one-time payment POS software.")}
                fullWidth
                className="sm:inline-flex sm:w-auto"
              />

              <a
                href={getWhatsappUrl("Hello LapCircuit, I would like to book a live POS demo at my counter.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200"
              >
                <span>Book a counter demo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingOrbital;
