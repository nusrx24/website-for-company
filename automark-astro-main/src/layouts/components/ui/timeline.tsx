// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import React, {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessagesSquare,
  Workflow,
  Code2,
  MonitorCheck,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

type Month = keyof typeof monthOrder | string;

export type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  content: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  iconType?: "discuss" | "plan" | "develop" | "deploy" | "train" | "support" | string;
};

export type TimelineProps = {
  id?: string;
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  topItems?: JourneyItem[];
  bottomItems?: JourneyItem[];
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

function StepIcon({
  type,
  className = "size-3.5",
}: {
  type?: string;
  className?: string;
}) {
  switch (type) {
    case "discuss":
      return <MessagesSquare className={className} />;
    case "plan":
      return <Workflow className={className} />;
    case "develop":
      return <Code2 className={className} />;
    case "deploy":
      return <MonitorCheck className={className} />;
    case "train":
      return <Languages className={className} />;
    case "support":
      return <ShieldCheck className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

function StepMediaCard({
  item,
}: {
  item: JourneyItem;
}) {
  if (!item.image) return null;
  return (
    <div
      className={`media-${item.id} group/card relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#071324]/80 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:border-[#2E90FF]/80 hover:shadow-[0_0_25px_rgba(46,144,255,0.35)]`}
    >
      {/* 16:9 Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.imageAlt || item.content}
          className="h-full w-full object-cover saturate-[0.85] transition-all duration-700 ease-out group-hover/card:scale-105 group-hover/card:saturate-100"
          loading="lazy"
        />
        {/* Subtle dark gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030508]/90 via-[#030508]/20 to-transparent" />

        {/* Floating Animated Symbol Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full border border-[#2E90FF]/40 bg-[#050D1A]/90 px-2.5 py-1 backdrop-blur-md shadow-[0_0_14px_rgba(46,144,255,0.35)]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2E90FF] opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-[#2E90FF]"></span>
          </span>
          <StepIcon type={item.iconType} className="size-3.5 text-[#60A5FA]" />
          {item.tag && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-200">
              {item.tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const defaultTopJourneyData: JourneyItem[] = [
  {
    id: "2020-march",
    year: "2020",
    month: "March",
    content: "Signal research turns scattered notes into a clear product thesis",
  },
  {
    id: "2021-july",
    year: "2021",
    month: "July",
    content: "Founding release ships with the first live customer journeys",
  },
  {
    id: "2023-april",
    year: "2023",
    month: "April",
    content: "Automation layer connects insight, publishing, and sales motion",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    content: "New markets open with localized launches and faster onboarding",
  },
];

const defaultBottomJourneyData: JourneyItem[] = [
  {
    id: "2020-november",
    year: "2020",
    month: "November",
    content: "Prototype sprint validates the experience with real operators",
  },
  {
    id: "2022-october",
    year: "2022",
    month: "October",
    content: "Community feedback reshapes the roadmap into sharper releases",
  },
  {
    id: "2025-september",
    year: "2025",
    month: "September",
    content: "Companion mobile workflows make the timeline travel-ready",
  },
];

export default function Timeline({
  id = "journey",
  title = "HOW WE WORK",
  periodLabel = "STEP 01 — 06",
  textColor = "var(--color-foreground, #ffffff)",
  mutedTextColor = "var(--color-muted-foreground, #a1a1aa)",
  activeColor = "#2E90FF",
  backgroundColor = "var(--color-background, #05070A)",
  imageUrl = "/images/hardware-counter.webp",
  imageAlt = "LapCircuit POS hardware setup",
  topItems = defaultTopJourneyData,
  bottomItems = defaultBottomJourneyData,
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Combine and sort all items in timeline sequence (e.g. 01, 02, 03, 04, 05, 06)
  const allJourneyItems: JourneyItem[] = [...topItems, ...bottomItems].sort(
    (a, b) => {
      const aNum = parseFloat(a.year);
      const bNum = parseFloat(b.year);
      if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) {
        return aNum - bNum;
      }
      const aMonth = monthOrder[a.month as keyof typeof monthOrder] || 0;
      const bMonth = monthOrder[b.month as keyof typeof monthOrder] || 0;
      if (aMonth !== bMonth) return aMonth - bMonth;
      return a.id.localeCompare(b.id);
    },
  );

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const activeGlowStyle: CSSProperties = {
    backgroundColor: activeColor,
    boxShadow: `0 0 14px ${activeColor}, 0 0 28px ${activeColor}80`,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const slider = wholeSliderRef.current;
    if (!section || !slider) return;

    if (reducedMotion) {
      gsap.set(slider, { x: 0 });
      gsap.set(".journey-line", { width: "100%" });
      allJourneyItems.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1, opacity: 1 });
        gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 });
        gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 });
        gsap.set(`.media-${item.id}`, { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

    // Set initial unrevealed states for all items
    allJourneyItems.forEach((item) => {
      const isTop = topItems.some((topItem) => topItem.id === item.id);
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: isTop ? "bottom bottom" : "top top",
      });
      gsap.set(`.jd-${item.id}`, {
        scale: 0.3,
        opacity: 0.35,
      });
      gsap.set(`.title-${item.id}`, {
        y: isTop ? -18 : 18,
        opacity: 0.25,
      });
      gsap.set(`.description-${item.id}`, {
        y: isTop ? -12 : 12,
        opacity: 0,
      });
      gsap.set(`.media-${item.id}`, {
        y: isTop ? -14 : 14,
        opacity: 0,
        scale: 0.95,
      });
    });
    gsap.set(".journey-line", { width: "0%" });

    // Function to calculate horizontal travel distance
    const getScrollDistance = () => {
      const totalWidth = slider.scrollWidth;
      const viewWidth = window.innerWidth;
      return Math.max(100, totalWidth - viewWidth + 80);
    };

    // Total master timeline virtual duration
    const totalDuration = 10;
    const totalItems = allJourneyItems.length;

    // Master pinned timeline that orchestrates the horizontal slide AND all steps in perfect synchronization
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        anticipatePin: 1,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 2.4, getScrollDistance() * 1.6)}`,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Slide horizontal track across entire duration
    masterTimeline.to(
      slider,
      {
        x: () => -getScrollDistance(),
        ease: "none",
        duration: totalDuration,
      },
      0,
    );

    // 2. Draw horizontal line progress across entire duration
    masterTimeline.to(
      ".journey-line",
      {
        width: "100%",
        ease: "none",
        duration: totalDuration * 0.95,
      },
      0.1,
    );

    // 3. Orchestrate each milestone step reveal in exact sequence
    allJourneyItems.forEach((item, index) => {
      // Space milestones evenly across the scroll duration
      const startAt =
        totalItems <= 1
          ? 0.5
          : 0.4 + (index / (totalItems - 1)) * (totalDuration - 1.6);

      const stepDuration = 0.5;

      // Stem line grows to meet centerline
      masterTimeline.to(
        `.jl-${item.id}`,
        {
          scaleY: 1,
          duration: stepDuration,
          ease: "power2.out",
        },
        startAt,
      );

      // Dot pulses into full electric glow
      masterTimeline.to(
        `.jd-${item.id}`,
        {
          scale: 1.25,
          opacity: 1,
          duration: stepDuration * 0.7,
          ease: "back.out(2)",
        },
        startAt,
      );
      masterTimeline.to(
        `.jd-${item.id}`,
        {
          scale: 1,
          duration: stepDuration * 0.3,
          ease: "power1.inOut",
        },
        startAt + stepDuration * 0.7,
      );

      // Title animates in and lights up
      masterTimeline.to(
        `.title-${item.id}`,
        {
          y: 0,
          opacity: 1,
          duration: stepDuration * 0.8,
          ease: "power2.out",
        },
        startAt + 0.08,
      );

      // Description fades and slides into view
      masterTimeline.to(
        `.description-${item.id}`,
        {
          y: 0,
          opacity: 1,
          duration: stepDuration * 0.85,
          ease: "power2.out",
        },
        startAt + 0.16,
      );

      // Media Card unfolds below description
      masterTimeline.to(
        `.media-${item.id}`,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: stepDuration * 0.9,
          ease: "power2.out",
        },
        startAt + 0.22,
      );
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      masterTimeline.scrollTrigger?.kill();
      masterTimeline.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [allJourneyItems, reducedMotion, topItems, bottomItems]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="min-h-[700px] h-screen w-full relative overflow-hidden flex flex-col justify-center"
      style={sectionStyle}
    >
      <div className="h-full w-full relative pt-20 pb-6 flex flex-col justify-center overflow-hidden max-[600px]:pt-16">
        <div
          ref={wholeSliderRef}
          className="flex h-[52vw] min-h-[600px] max-h-[720px] w-fit items-center gap-[4vw] px-[6vw] max-[600px]:h-auto max-[600px]:py-8 max-[600px]:px-[6vw]"
        >
          {/* Hardware & Concept Lead-In Card */}
          <div className="h-full w-[26vw] min-w-[280px] max-w-[360px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-1 shadow-2xl backdrop-blur-sm max-[600px]:w-[80vw]">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2E90FF]">
                  LapCircuit Architecture
                </span>
                <span className="text-base font-semibold text-white/95 mt-1">
                  Custom hardware &amp; POS workflow engine
                </span>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Engineered directly around how Sri Lankan retail, restaurants, and shops operate.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Track & Steps */}
          <div className="relative h-full flex flex-col justify-between shrink-0">
            {/* Centerline Axis with Start & End nodes */}
            <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 flex items-center h-fit pointer-events-none z-10">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={activeGlowStyle}
              ></div>
              <div
                className="h-0.5 w-[0%] rounded-full journey-line"
                style={activeStyle}
              ></div>
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={activeGlowStyle}
              ></div>
            </div>

            {/* TOP ROW: Title & Odd Milestones (01 Discuss, 03 Develop, 05 Train) */}
            <div className="flex h-[49%] w-full items-end pb-2">
              {/* Header block on top row */}
              <div className="w-[18vw] min-w-[190px] shrink-0 pr-4">
                <p className="text-xs font-mono tracking-widest text-[#2E90FF] uppercase mb-1">
                  Process Workflow
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold uppercase leading-[1.1] tracking-tight text-white">
                  {title}
                </h2>
              </div>

              {/* Top Steps Row */}
              <div className="flex items-end gap-x-[16vw]">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative w-[24vw] min-w-[280px] max-w-[360px] shrink-0 flex flex-col justify-end"
                  >
                    {/* Content (Title, Description, and Media Card below) */}
                    <div className="space-y-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2E90FF]/20 text-[#2E90FF] border border-[#2E90FF]/30">
                          {item.year}
                        </span>
                        <h4
                          className={`title-${item.id} text-lg lg:text-xl font-bold uppercase tracking-tight text-white leading-tight`}
                        >
                          {item.month}
                        </h4>
                      </div>
                      <p
                        className={`description-${item.id} text-xs sm:text-sm leading-relaxed font-normal text-slate-300 max-w-[340px]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>

                      {/* Media Card below description */}
                      <StepMediaCard item={item} />
                    </div>

                    {/* Vertical Stem & Centerline Connector */}
                    <div className="relative w-full flex flex-col items-start">
                      <div
                        className={`h-6 w-0.5 jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-3.5 -mt-1 rounded-full aspect-square jd-${item.id}`}
                        style={activeGlowStyle}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM ROW: Period Label & Even Milestones (02 Plan, 04 Deploy, 06 Support) */}
            <div className="flex h-[49%] w-full items-start pt-2">
              {/* Period label column on bottom row */}
              <div className="w-[18vw] min-w-[190px] shrink-0 pr-4">
                <span className="inline-block px-3 py-1 rounded-full border border-white/10 text-xs font-mono tracking-widest text-[#2E90FF] uppercase bg-white/5">
                  {periodLabel}
                </span>
              </div>

              {/* Bottom Steps Row (offset horizontally by 16vw so it alternates cleanly between top steps) */}
              <div className="flex items-start gap-x-[16vw] ml-[16vw]">
                {bottomItems.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative w-[24vw] min-w-[280px] max-w-[360px] shrink-0 flex flex-col justify-start"
                  >
                    {/* Vertical Stem & Centerline Connector */}
                    <div className="relative w-full flex flex-col items-start pb-2">
                      <div
                        className={`size-3.5 -mb-1 rounded-full aspect-square jd-${item.id}`}
                        style={activeGlowStyle}
                      ></div>
                      <div
                        className={`h-6 w-0.5 jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    {/* Content (Title, Description, and Media Card below) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2E90FF]/20 text-[#2E90FF] border border-[#2E90FF]/30">
                          {item.year}
                        </span>
                        <h4
                          className={`title-${item.id} text-lg lg:text-xl font-bold uppercase tracking-tight text-white leading-tight`}
                        >
                          {item.month}
                        </h4>
                      </div>
                      <p
                        className={`description-${item.id} text-xs sm:text-sm leading-relaxed font-normal text-slate-300 max-w-[340px]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>

                      {/* Media Card below description */}
                      <StepMediaCard item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
