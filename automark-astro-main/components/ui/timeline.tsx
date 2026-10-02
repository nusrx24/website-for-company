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
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "var(--color-foreground, #ffffff)",
  mutedTextColor = "var(--color-muted-foreground, #a1a1aa)",
  activeColor = "#2E90FF",
  backgroundColor = "var(--color-background, #05070A)",
  imageUrl = "https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg",
  imageAlt = "Modern office workspace",
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
        end: () => `+=${Math.max(window.innerHeight * 2.2, getScrollDistance() * 1.6)}`,
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
      className="h-screen w-full relative overflow-hidden flex flex-col justify-center"
      style={sectionStyle}
    >
      <div className="h-full w-full relative pt-24 pb-8 flex flex-col justify-center overflow-hidden max-[600px]:pt-20">
        <div
          ref={wholeSliderRef}
          className="flex h-[36vw] min-h-[420px] max-h-[580px] w-fit items-center gap-[4vw] px-[6vw] max-[600px]:h-[80vh] max-[600px]:px-[6vw]"
        >
          {/* Hardware & Concept Lead-In Card */}
          <div className="h-full w-[26vw] min-w-[280px] max-w-[380px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-1 shadow-2xl backdrop-blur-sm max-[600px]:w-[80vw]">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#2E90FF]">
                  LapCircuit Architecture
                </span>
                <span className="text-sm font-medium text-white/90">
                  Custom hardware &amp; POS workflow engine
                </span>
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
            <div className="flex h-[48%] w-full items-end pb-3">
              {/* Header block on top row */}
              <div className="w-[18vw] min-w-[190px] shrink-0 pr-4">
                <p className="text-xs font-mono tracking-widest text-[#2E90FF] uppercase mb-1">
                  Process Workflow
                </p>
                <h2 className="text-[2.4vw] min-text-[22px] max-text-[36px] font-bold uppercase leading-[1.05] tracking-tight">
                  {title}
                </h2>
              </div>

              {/* Top Steps Row */}
              <div className="flex items-end gap-x-[16vw]">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative w-[24vw] min-w-[250px] max-w-[340px] shrink-0 flex flex-col justify-between h-full"
                  >
                    {/* Content (Title & Description) */}
                    <div className="space-y-2 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2E90FF]/20 text-[#2E90FF] border border-[#2E90FF]/30">
                          {item.year}
                        </span>
                        <h4
                          className={`title-${item.id} text-[1.8vw] min-text-[18px] font-bold uppercase tracking-tight text-white leading-tight`}
                        >
                          {item.month}
                        </h4>
                      </div>
                      <p
                        className={`description-${item.id} text-[1.1vw] min-text-[13px] leading-[1.45] font-normal`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>

                    {/* Vertical Stem & Centerline Connector */}
                    <div className="relative w-full flex flex-col items-start pt-1">
                      <div
                        className={`h-10 w-0.5 jl-${item.id}`}
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
            <div className="flex h-[48%] w-full items-start pt-3">
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
                    className="relative w-[24vw] min-w-[250px] max-w-[340px] shrink-0 flex flex-col justify-start h-full"
                  >
                    {/* Vertical Stem & Centerline Connector */}
                    <div className="relative w-full flex flex-col items-start pb-2">
                      <div
                        className={`size-3.5 -mb-1 rounded-full aspect-square jd-${item.id}`}
                        style={activeGlowStyle}
                      ></div>
                      <div
                        className={`h-10 w-0.5 jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    {/* Content (Title & Description) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2E90FF]/20 text-[#2E90FF] border border-[#2E90FF]/30">
                          {item.year}
                        </span>
                        <h4
                          className={`title-${item.id} text-[1.8vw] min-text-[18px] font-bold uppercase tracking-tight text-white leading-tight`}
                        >
                          {item.month}
                        </h4>
                      </div>
                      <p
                        className={`description-${item.id} text-[1.1vw] min-text-[13px] leading-[1.45] font-normal`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
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
