"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useTransform } from "motion/react";
import {
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroVideo,
  useContainerScrollContext,
} from "@/components/ui/animated-video-on-scroll";

// The clip opens on a weak wide frame, so playback is held to the push-in.
const LOOP_START = 1.3;
const LOOP_END = 3.95;

// The frame opens from a narrow slot of light to the full frame.
// Phone: a square crop. Desktop (wide): the native 16:9, opening from a wide slit.
const INSET_Y: [number, number] = [38, 0];
const INSET_X: [number, number] = [30, 0];
const WIDE_INSET_Y: [number, number] = [40, 0];
const WIDE_INSET_X: [number, number] = [36, 0];
const ROUNDING: [number, number] = [999, 14];

// Reduced motion: CSS overrides the inline motion styles, so the server and
// client render the same markup and the frame simply sits open.
const STILL = "motion-reduce:[clip-path:none]! motion-reduce:[transform:none]! motion-reduce:opacity-100! motion-reduce:[filter:none]!";

function useHeldLoop(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const toStart = () => {
      try {
        video.currentTime = LOOP_START;
      } catch {
        /* metadata not ready yet; loadedmetadata retries */
      }
    };
    const onTime = () => {
      if (video.currentTime >= LOOP_END || video.currentTime < LOOP_START - 0.15) toStart();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      video.addEventListener("timeupdate", onTime);
    }
    if (video.readyState >= 1) toStart();
    else video.addEventListener("loadedmetadata", toStart, { once: true });

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", toStart);
    };
  }, [ref]);
}

/** Viewfinder brackets that ride the corners of the opening frame. */
function Viewfinder({ insetY, insetX }: { insetY: [number, number]; insetX: [number, number] }) {
  const { scrollYProgress } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, [0, 0.8], insetY);
  const x = useTransform(scrollYProgress, [0, 0.8], insetX);
  const opacity = useTransform(scrollYProgress, [0.3, 0.75], [0, 1]);
  const vy = useMotionTemplate`${y}%`;
  const vx = useMotionTemplate`${x}%`;

  const base = `pointer-events-none absolute m-3 size-4 border-[#2E90FF]/80 ${STILL}`;
  return (
    <>
      <motion.span aria-hidden="true" className={`${base} border-l border-t motion-reduce:top-0! motion-reduce:left-0!`} style={{ top: vy, left: vx, opacity }} />
      <motion.span aria-hidden="true" className={`${base} border-r border-t motion-reduce:top-0! motion-reduce:right-0!`} style={{ top: vy, right: vx, opacity }} />
      <motion.span aria-hidden="true" className={`${base} border-b border-l motion-reduce:bottom-0! motion-reduce:left-0!`} style={{ bottom: vy, left: vx, opacity }} />
      <motion.span aria-hidden="true" className={`${base} border-b border-r motion-reduce:bottom-0! motion-reduce:right-0!`} style={{ bottom: vy, right: vx, opacity }} />
    </>
  );
}

/** The caption sharpens into view once the frame has opened. */
function Caption({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useContainerScrollContext();
  const opacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
  const blur = useTransform(scrollYProgress, [0.6, 0.9], [8, 0]);
  const y = useTransform(scrollYProgress, [0.6, 0.9], [14, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.p
      className={`max-w-[36ch] text-center font-mono text-[11px] leading-relaxed tracking-wide text-text-dark ${STILL}`}
      style={{ opacity, filter, y }}
    >
      {children}
    </motion.p>
  );
}

/** Content above the frame (e.g. the offer strip) sharpens in as the stage arrives. */
function Heading({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useContainerScrollContext();
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  return (
    <motion.div
      className={STILL}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 100, damping: 16, mass: 0.75 }}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroVideoScroll({
  src,
  caption,
  wide = false,
  children,
}: {
  src: string;
  caption?: string;
  /** Desktop layout: native 16:9 frame, a longer scroll, optional heading. */
  wide?: boolean;
  children?: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useHeldLoop(videoRef);
  const insetY = wide ? WIDE_INSET_Y : INSET_Y;
  const insetX = wide ? WIDE_INSET_X : INSET_X;

  return (
    <ContainerScroll className={`${wide ? "h-[260svh]" : "h-[220svh]"} motion-reduce:h-auto`}>
      <ContainerSticky
        className={`flex flex-col items-center justify-center motion-reduce:static ${
          wide ? "gap-7 px-8 pt-24 pb-10" : "gap-5 px-4 pt-20 pb-10"
        }`}
        style={{
          background:
            "radial-gradient(70% 45% at 50% 48%, rgba(46,144,255,0.14) 0%, rgba(5,7,10,0) 70%), #05070A",
        }}
      >
        {children && <Heading>{children}</Heading>}
        <div
          className={
            wide
              ? "relative w-[min(100%,1120px,calc(64svh*16/9))]"
              : "relative w-full max-w-[min(100%,64svh)]"
          }
        >
          <ContainerInset
            insetYRange={insetY}
            insetXRange={insetX}
            roundednessRange={ROUNDING}
            className={`${wide ? "aspect-video rounded-[16px]" : "aspect-square rounded-[14px]"} w-full bg-[#0A0F16] ${STILL}`}
          >
            <HeroVideo
              ref={videoRef}
              src={src}
              preload="metadata"
              aria-label={caption}
              className={`h-full w-full object-cover ${wide ? "object-center" : "object-[80%_50%]"} ${STILL}`}
            />
          </ContainerInset>
          <Viewfinder insetY={insetY} insetX={insetX} />
        </div>
        {caption && <Caption>{caption}</Caption>}
      </ContainerSticky>
    </ContainerScroll>
  );
}
