"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TextBlurRevealBy = "words" | "letters";
export type TextBlurRevealDirection = "top" | "bottom";

export interface TextBlurRevealProps {
  /** The string to reveal. */
  text?: string;
  /** Children if passed as text. */
  children?: React.ReactNode;
  /** Stagger delay between segments, in milliseconds. */
  delay?: number;
  /** Initial delay before stagger begins on first mount, in seconds. */
  initialDelay?: number;
  /** Outer layout class (size, weight, tracking, color). */
  className?: string;
  /** How to split the text. Default: `"words"`. */
  animateBy?: TextBlurRevealBy;
  /** Enter direction for the blur travel. Default: `"top"`. */
  direction?: TextBlurRevealDirection;
  /** IntersectionObserver threshold (0–1). */
  threshold?: number;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Fired when the last segment finishes. */
  onAnimationComplete?: () => void;
  /** Duration of each keyframe step, in seconds. */
  stepDuration?: number;
  /** When false, play on mount instead of waiting for viewport. Default: true. */
  startOnView?: boolean;
  /** Replay animation when user hovers or clicks. Default: true. */
  replayOnHover?: boolean;
}

/**
 * TextBlurReveal
 *
 * Blur-in stagger for headlines — by word or letter — with a two-step
 * settle from top or bottom. Reduced-motion safe.
 *
 * Letter mode keeps each word in a nowrap group so wraps never split
 * mid-word (e.g. "inte" / "nt.").
 */
export function TextBlurReveal({
  text = "",
  children,
  delay = 120,
  initialDelay = 0,
  className,
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  onAnimationComplete,
  stepDuration = 0.35,
  startOnView = true,
  replayOnHover = true,
}: TextBlurRevealProps) {
  const resolvedText = text || (typeof children === "string" ? children : "");
  const [inView, setInView] = React.useState(false);
  const [isReplay, setIsReplay] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);
  const ref = React.useRef<HTMLParagraphElement>(null);

  const fromY = direction === "top" ? -35 : 35;
  const midY = direction === "top" ? 4 : -4;
  const totalDuration = Math.max(0.1, stepDuration * 2);
  const words = React.useMemo(() => resolvedText.split(" "), [resolvedText]);
  const letterCount = React.useMemo(
    () => words.reduce((sum, word) => sum + word.length, 0),
    [words],
  );

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  React.useEffect(() => {
    if (reduceMotion) {
      setInView(true);
      return;
    }

    if (!startOnView) {
      const id = window.requestAnimationFrame(() => setInView(true));
      return () => window.cancelAnimationFrame(id);
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, startOnView, reduceMotion, animKey]);

  const handleMouseEnter = () => {
    if (!replayOnHover) return;
    setInView(false);
    setIsReplay(true);
    setTimeout(() => {
      setAnimKey((k) => k + 1);
      setInView(true);
    }, 40);
  };

  function segmentMotion(index: number, isLast: boolean) {
    const effectiveInitialDelay = isReplay ? 0 : initialDelay;

    return {
      className: "inline-block",
      initial: {
        filter: "blur(12px)",
        opacity: 0,
        y: fromY,
      },
      animate: inView
        ? {
            filter: ["blur(12px)", "blur(5px)", "blur(0px)"],
            opacity: [0, 0.5, 1],
            y: [fromY, midY, 0],
          }
        : {
            filter: "blur(12px)",
            opacity: 0,
            y: fromY,
          },
      transition: {
        duration: totalDuration,
        times: [0, 0.5, 1] as number[],
        delay: effectiveInitialDelay + (index * delay) / 1000,
        ease: "easeOut" as const,
      },
      onAnimationComplete: isLast ? onAnimationComplete : undefined,
    };
  }

  if (reduceMotion) {
    return (
      <p className={cn("flex flex-wrap", className)} ref={ref}>
        {resolvedText}
      </p>
    );
  }

  if (animateBy === "letters") {
    let stagger = 0;

    return (
      <p
        key={animKey}
        className={cn("flex flex-wrap", className)}
        ref={ref}
        aria-label={resolvedText}
        onMouseEnter={handleMouseEnter}
      >
        <span className="sr-only">{resolvedText}</span>
        {words.map((word, wordIndex) => (
          <span
            key={`word-${wordIndex}-${word}`}
            className="inline-flex whitespace-nowrap"
            aria-hidden="true"
          >
            {word.split("").map((char) => {
              const index = stagger;
              stagger += 1;
              return (
                <motion.span
                  key={`letter-${index}`}
                  {...segmentMotion(index, index === letterCount - 1)}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 ? (
              <span className="inline-block">&nbsp;</span>
            ) : null}
          </span>
        ))}
      </p>
    );
  }

  return (
    <p
      key={animKey}
      className={cn("flex flex-wrap", className)}
      ref={ref}
      aria-label={resolvedText}
      onMouseEnter={handleMouseEnter}
    >
      <span className="sr-only">{resolvedText}</span>
      {words.map((word, index) => (
        <motion.span
          key={`word-${index}-${word}`}
          {...segmentMotion(index, index === words.length - 1)}
          aria-hidden="true"
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </p>
  );
}

export default TextBlurReveal;
