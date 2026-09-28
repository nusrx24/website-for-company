"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Sliders,
  CheckCircle2,
  BadgeDollarSign,
  Smartphone,
  Languages,
  Headphones,
  Sparkles,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface BucketItem {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  badge?: string;
  icon?: React.ElementType;
}

export const LAPCIRCUIT_CHIPS: BucketItem[] = [
  {
    id: 1,
    title: "Lifetime One-Time Payment",
    description: "Pay once and use your software for life.",
    fullDescription:
      "Pay once and use your software for life. No monthly subscriptions, no recurring software fees, and no being locked into a never-ending payment plan.",
    badge: "Zero Subscriptions",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Customized",
    description: "Built around how your business operates.",
    fullDescription:
      "Built around the way your business already works, instead of forcing your team to change its workflow to fit the software.",
    badge: "100% Tailored",
    icon: Sliders,
  },
  {
    id: 3,
    title: "Easy to Manage",
    description: "Simple, practical interfaces for everyday users.",
    fullDescription:
      "Simple, practical interfaces designed for the people who use them every day—not just the person who purchased the system.",
    badge: "Intuitive UI",
    icon: CheckCircle2,
  },
  {
    id: 4,
    title: "Affordable",
    description: "Clear, transparent pricing available upfront.",
    fullDescription:
      "Clear, transparent pricing with starting prices available upfront, so you know what to expect before you contact us.",
    badge: "Upfront Pricing",
    icon: BadgeDollarSign,
  },
  {
    id: 5,
    title: "Flexible",
    description: "Offline desktop, dedicated app, or cloud.",
    fullDescription:
      "Choose what fits your operation: offline desktop software, a dedicated desktop application, or cloud-based access across desktop and mobile.",
    badge: "Offline + Cloud",
    icon: Smartphone,
  },
  {
    id: 6,
    title: "Multi-Language",
    description: "Available in Tamil, English, and Sinhala.",
    fullDescription:
      "Available in Tamil, English, and Sinhala, helping your team work comfortably in the language they know best.",
    badge: "3 Languages",
    icon: Languages,
  },
  {
    id: 7,
    title: "Direct Support",
    description: "Talk directly to the people who built your system.",
    fullDescription:
      "Talk directly to the people who built your system. No ticket queues, no call centres, and no unnecessary middlemen.",
    badge: "Direct Contact",
    icon: Headphones,
  },
];

export interface BucketProps {
  items?: BucketItem[];
  intervalMs?: number;
  activeId?: number;
  onItemChange?: (item: BucketItem) => void;
  className?: string;
  autoPlay?: boolean;
}

export const Bucket: React.FC<BucketProps> = ({
  items = LAPCIRCUIT_CHIPS,
  intervalMs = 3200,
  activeId,
  onItemChange,
  className = "",
  autoPlay = true,
}) => {
  // If activeId is provided by parent, use it; otherwise manage internal index cycling
  const [internalIndex, setInternalIndex] = useState<number>(0);
  const isMobile = useIsMobile();

  const isControlled = activeId !== undefined;
  const currentIndex = isControlled
    ? Math.max(
        0,
        items.findIndex((i) => i.id === activeId)
      )
    : internalIndex;

  // Standalone auto-play (when activeId is NOT controlled by parent)
  useEffect(() => {
    if (isControlled || !autoPlay) return;

    const interval = setInterval(() => {
      setInternalIndex((prev) => {
        const nextIndex = (prev + 1) % items.length;
        if (onItemChange && items[nextIndex]) {
          onItemChange(items[nextIndex]);
        }
        return nextIndex;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isControlled, autoPlay, intervalMs, items, onItemChange]);

  const currentItem = items[currentIndex] || items[0];
  const CurrentIcon = currentItem?.icon || Sparkles;

  return (
    <div
      className={`flex flex-col gap-4 items-center justify-center h-fit relative w-full select-none ${className}`}
    >
      <div
        className="relative isolate w-full max-w-[655px]"
        style={{ aspectRatio: "655/352" }}
      >
        {/* Background Box SVG Layer */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-0 drop-shadow-[0_15px_35px_rgba(46,144,255,0.2)]"
        >
          <foreignObject
            x="443.561"
            y="-10.5141"
            width="211.24"
            height="166.977"
          >
            <div
              style={{
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                clipPath: "url(#bgblur_0_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>

          {/* Right Flap (Dark Blue Glass) */}
          <g filter="url(#filter1_dddi_51_65)">
            <path
              d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z"
              fill="url(#lapcircuit_flap_blue)"
              shapeRendering="crispEdges"
            />
          </g>

          <foreignObject
            x="-3.43323e-05"
            y="-10.9516"
            width="215.96"
            height="167.786"
          >
            <div
              style={{
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                clipPath: "url(#bgblur_1_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>

          {/* Left Flap (Dark Blue Glass) */}
          <g filter="url(#filter2_dddi_51_65)">
            <path
              d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z"
              fill="url(#lapcircuit_flap_blue)"
              shapeRendering="crispEdges"
            />
          </g>

          {/* Back Box Inside (Deep Midnight Dark Blue Interior) */}
          <foreignObject
            x="78.7048"
            y="20.823"
            width="501.297"
            height="136.012"
          >
            <div
              style={{
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                clipPath: "url(#bgblur_2_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter3_dddi_51_65)">
            <path
              d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z"
              fill="url(#lapcircuit_interior_blue)"
              shapeRendering="crispEdges"
            />
          </g>

          {/* Interior Left Wedge */}
          <g filter="url(#filter4_dddi_51_65)">
            <path
              d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z"
              fill="#061224"
              fillOpacity="0.88"
              shapeRendering="crispEdges"
            />
          </g>

          {/* Interior Right Wedge */}
          <g filter="url(#filter5_dddi_51_65)">
            <path
              d="M487.973 78.9088V42.8774L536.404 79.1144L487.973 78.9088Z"
              fill="#061224"
              fillOpacity="0.88"
              shapeRendering="crispEdges"
            />
          </g>

          <defs>
            {/* Dark Blue Gradients for LapCircuit Branding */}
            <linearGradient
              id="lapcircuit_flap_blue"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2E90FF" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#0B1E3D" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#061224" stopOpacity="0.96" />
            </linearGradient>

            <linearGradient
              id="lapcircuit_interior_blue"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#030812" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#0A1E3F" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient
              id="lapcircuit_front_blue"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0E2854" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#081A38" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#040D1C" stopOpacity="1" />
            </linearGradient>

            <clipPath
              id="bgblur_0_51_65_clip_path"
              transform="translate(-443.561 10.5141)"
            >
              <path d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z" />
            </clipPath>
            <clipPath
              id="bgblur_1_51_65_clip_path"
              transform="translate(3.43323e-05 10.9516)"
            >
              <path d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z" />
            </clipPath>
            <clipPath
              id="bgblur_2_51_65_clip_path"
              transform="translate(-78.7048 -20.823)"
            >
              <path d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z" />
            </clipPath>
            <clipPath id="center_box_clip">
              <rect x="123.766" y="0" width="413" height="352" />
            </clipPath>
          </defs>
        </svg>

        {/* Dropping Chip Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="relative w-full h-full flex justify-center items-center"
            style={{ paddingBottom: "58%" }}
          >
            <AnimatePresence mode="popLayout">
              {currentItem && (
                <motion.div
                  key={currentItem.id}
                  initial={{
                    y: isMobile ? -80 : -130,
                    opacity: 0,
                    scale: 0.8,
                    rotate: -2,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: isMobile ? 0.95 : 1.15,
                    rotate: 0,
                  }}
                  exit={{
                    y: isMobile ? 90 : 130,
                    scale: 0.82,
                    opacity: 0.3,
                    rotate: 2,
                    transition: {
                      duration: 0.65,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="bg-[#07152B]/95 border border-[#2E90FF]/60 rounded-2xl p-3 w-[270px] sm:w-[330px] shadow-[0_0_35px_rgba(46,144,255,0.4)] backdrop-blur-xl absolute pointer-events-auto flex items-center gap-3 origin-bottom text-white ring-1 ring-white/10"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2E90FF]/25 text-[#2E90FF] border border-[#2E90FF]/40 shadow-[0_0_15px_rgba(46,144,255,0.35)]">
                    <CurrentIcon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Clash_Display',sans-serif] text-sm font-semibold tracking-tight text-white leading-tight truncate">
                        {currentItem.title}
                      </span>
                    </div>
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-slate-300 line-clamp-1 leading-snug">
                      {currentItem.description}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Front Box SVG Layer */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          style={{
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {/* Main Front Body (Midnight Dark Blue with electric cyan border) */}
          <path
            d="M512.766 79.1595L147.766 79.1624C136.453 79.1625 130.796 79.1626 127.281 82.6773C123.766 86.192 123.766 91.8488 123.766 103.162V327.159C123.766 338.473 123.766 344.13 127.281 347.645C130.796 351.159 136.453 351.159 147.766 351.159H512.766C524.08 351.159 529.737 351.159 533.252 347.645C536.766 344.13 536.766 338.473 536.766 327.159V103.159C536.766 91.8457 536.766 86.1888 533.252 82.6741C529.737 79.1594 524.08 79.1594 512.766 79.1595Z"
            fill="url(#lapcircuit_front_blue)"
            stroke="#2E90FF"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />

          {/* Front Center Fold Highlight Line */}
          <line
            x1="130"
            y1="80"
            x2="530"
            y2="80"
            stroke="#2E90FF"
            strokeWidth="2"
            strokeOpacity="0.75"
          />

          {/* Front Top Flap (Frosted Dark Blue Glass) */}
          <g clipPath="url(#center_box_clip)">
            <foreignObject x="0" y="0" width="655" height="352">
              <div
                style={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  height: "100%",
                  width: "100%",
                  background:
                    "linear-gradient(180deg, rgba(46,144,255,0.24) 0%, rgba(7,21,43,0.92) 100%)",
                  clipPath:
                    "path('M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z')",
                }}
              ></div>
            </foreignObject>
          </g>

          {/* Front Top Flap Border */}
          <path
            d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z"
            stroke="#2E90FF"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            fill="none"
          />
        </svg>

        {/* Brand Stamp on the Front of the Dark Blue Box */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
          <div className="flex items-center justify-center gap-1.5 font-['Clash_Display',sans-serif] font-bold tracking-tight text-white text-base sm:text-lg">
            <span>lapcircuit</span>
            <span className="text-[#2E90FF] text-xl leading-none">.</span>
          </div>
          <p className="font-['IBM_Plex_Mono',monospace] text-[10px] sm:text-xs font-semibold tracking-widest text-[#2E90FF] uppercase mt-0.5">
            Built For Your Business &bull; Yours For Life
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bucket;
