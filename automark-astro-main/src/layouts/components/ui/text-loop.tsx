"use client";

import React, { useEffect, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface TextLoopProps {
  staticText?: string;
  rotatingTexts?: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  staticTextClassName?: string;
  rotatingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
}

export function TextLoop({
  staticText = "Design",
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  className,
  interval = 3000,
  transition = { duration: 0.8, ease: "easeInOut" },
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!rotatingTexts || rotatingTexts.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [rotatingTexts, interval]);

  const currentText = rotatingTexts[index] || "";

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "flex flex-wrap items-center justify-start w-fit text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-secondary font-bold tracking-tight",
          className,
        )}
      >
        {staticText && (
          <span className={cn("mr-2.5 sm:mr-3.5 whitespace-normal", staticTextClassName)}>
            {staticText}
          </span>
        )}
        <div className="relative inline-flex items-center">
          <AnimatePresence mode="wait">
            <m.div
              key={currentText}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition}
              className="overflow-hidden whitespace-nowrap relative"
            >
              {/* Background gradient box */}
              <div
                className={cn(
                  "absolute inset-0 rounded",
                  "bg-gradient-to-r from-transparent via-[#2E90FF]/15 to-[#2E90FF]/25",
                  backgroundClassName,
                )}
              />

              <span
                className={cn(
                  "relative bg-clip-text text-transparent",
                  "bg-gradient-to-r from-[#5AABFF] via-[#2E90FF] to-[#00E5FF] pr-1",
                  "drop-shadow-[0_0_12px_rgba(46,144,255,0.4)]",
                  rotatingTextClassName,
                )}
              >
                {currentText}
              </span>
            </m.div>
          </AnimatePresence>

          {/* Cursor Line */}
          <m.div
            className={cn(
              "w-[3px] md:w-[4px] bg-[#2E90FF] h-[1.10em] sm:h-[1em] ml-0.5 rounded-full shadow-[0_0_8px_rgba(46,144,255,0.9)]",
              cursorClassName,
            )}
            animate={{ opacity: [1, 0.4] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    </LazyMotion>
  );
}

export default TextLoop;
