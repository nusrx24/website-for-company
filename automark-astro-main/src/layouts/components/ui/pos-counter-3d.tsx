"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PosSceneApi } from "./pos-counter-scene";
import { cn } from "@/lib/utils";

/** One sale through the counter, in order. Copy matches the Benefits section. */
export const POS_STEPS = [
  { name: "Billing", line: "Scan or tap the item and the bill totals itself." },
  { name: "Payment", line: "Payment is taken and the cash drawer opens." },
  { name: "Receipt", line: "The bill prints on the thermal printer in your shop's name." },
  { name: "Stock", line: "The same sale comes out of stock as it happens." },
  { name: "Reports", line: "It is added to the day's sales and profit figures." },
] as const;

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function PosCounter3D({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const apiRef = useRef<PosSceneApi | null>(null);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const [status, setStatus] = useState<"waiting" | "ready" | "failed">("waiting");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;

    const start = async () => {
      try {
        const { initPosScene } = await import("./pos-counter-scene");
        if (cancelled) return;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        apiRef.current = initPosScene(stage, {
          font: "Plus Jakarta Sans, sans-serif",
          lite: coarse || window.innerWidth < 768,
          reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          allowRotate: !coarse,
          onStep: setStep,
          onHover: (i, x, y) => setHover(i === null ? null : { i, x, y }),
          // Moved straight on the DOM every frame, so React does not re-render.
          onMarkers: (points) => {
            points.forEach((p, i) => {
              const el = markerRefs.current[i];
              if (!el) return;
              el.style.opacity = p ? "1" : "0";
              if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
            });
          },
        });
        setStatus("ready");
      } catch (err) {
        console.error("[PosCounter3D] Initialization failed:", err);
        setStatus("failed");
      }
    };

    let started = false;
    let observer: IntersectionObserver | null = null;
    const triggerStart = () => {
      if (started) return;
      started = true;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      start();
    };

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              triggerStart();
              break;
            }
          }
        },
        { rootMargin: "600px" },
      );
      observer.observe(stage);
    }

    // Safety fallback: start after 500ms even if observer doesn't fire
    const timer = setTimeout(triggerStart, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (observer) observer.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/10]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 58%, rgba(46,144,255,0.16) 0%, rgba(46,144,255,0.05) 45%, transparent 75%)",
        }}
      >
        <div
          ref={stageRef}
          className="absolute inset-0"
          role="img"
          aria-label="3D POS counter. One sale moves through five stations in order: billing, payment, receipt, stock and reports."
        />

        {status === "failed" && (
          <p className="absolute inset-0 flex items-center justify-center px-8 text-center font-mono text-xs leading-relaxed text-[#8A94A3]">
            The 3D counter needs WebGL, which this browser has turned off. The same sale is listed step by step below.
          </p>
        )}

        {/* A marker over every station; the one the sale is at shows its name. */}
        {POS_STEPS.map((s, i) => {
          const on = i === step;
          return (
            <div
              key={s.name}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-0 top-0 flex items-center gap-1.5 rounded-full border font-mono text-[11px] font-semibold whitespace-nowrap opacity-0 backdrop-blur-sm transition-[opacity,background-color,border-color,box-shadow] duration-300",
                on
                  ? "z-10 border-[#2E90FF]/70 bg-[#05070A]/90 px-3 py-1 text-[#EEF2F8] shadow-[0_0_18px_rgba(46,144,255,0.45)]"
                  : "border-white/15 bg-[#0B1320]/80 px-2 py-0.5 text-[#8A94A3]",
              )}
            >
              <span className={on ? "text-[#5AABFF]" : undefined}>{num(i)}</span>
              {on && s.name}
            </div>
          );
        })}

        {hover && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 max-w-[15rem] rounded-xl border border-white/10 bg-[#0B1320]/95 px-3.5 py-2.5 shadow-xl"
            style={{ left: Math.min(hover.x + 14, 9999), top: Math.max(hover.y - 70, 8) }}
          >
            <p className="font-mono text-[11px] font-semibold text-[#EEF2F8]">
              <span className="text-[#5AABFF]">{num(hover.i)}</span> {POS_STEPS[hover.i].name}
            </p>
            <p className="mt-1 text-xs leading-snug text-[#8A94A3]">{POS_STEPS[hover.i].line}</p>
          </div>
        )}
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-1.5" aria-label="One sale, step by step">
        {POS_STEPS.map((s, i) => {
          const on = i === step;
          return (
            <li key={s.name}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => {
                  apiRef.current?.focus(i);
                  setStep(i);
                }}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 rounded-lg border px-2 py-1.5 text-left outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AABFF]",
                  on
                    ? "border-[#2E90FF]/60 bg-[#2E90FF]/15"
                    : "border-white/5 bg-white/[0.03] hover:border-white/15",
                )}
              >
                <span className={cn("font-mono text-[10px] font-semibold", on ? "text-[#5AABFF]" : "text-[#5E6B7D]")}>
                  {num(i)}
                </span>
                <span className={cn("text-[11px] font-semibold sm:text-xs", on ? "text-[#EEF2F8]" : "text-[#8A94A3]")}>
                  {s.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p ref={captionRef} className="mt-3 min-h-[2.5em] font-mono text-xs leading-relaxed text-[#8A94A3]">
        {POS_STEPS[step].line}
      </p>
    </div>
  );
}
