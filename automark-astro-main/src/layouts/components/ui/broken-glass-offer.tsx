"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const GLASS_CSS = `
/* broken-glass-offer ──────────────────────────────────────────────────── */

.bgo {
  --bgo-primary: #2E90FF;
  --bgo-primary-glow: rgba(46, 144, 255, 0.35);
  --bgo-body: #05070A;
  --bgo-border: #232B37;
  --bgo-text: #CBD3DF;
  --bgo-text-light: #EEF2F8;

  position: relative;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  perspective: 900px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

@media (min-width: 1024px) {
  .bgo {
    max-width: 440px;
  }
}

/* ── stage: the glass pane container ─────────────────────────────────── */
.bgo-stage {
  position: relative;
  width: 100%;
  height: 80px;
  transform-style: preserve-3d;
}

@media (min-width: 1024px) {
  .bgo-stage {
    height: 56px;
  }
}

/* ── SVG crack network ───────────────────────────────────────────────── */
.bgo-cracks {
  position: absolute;
  left: -48px;
  top: -48px;
  width: calc(100% + 96px);
  height: calc(100% + 96px);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  animation: bgo-crack-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
}

@media (min-width: 1024px) {
  .bgo-cracks {
    left: -16px;
    top: -16px;
    width: calc(100% + 32px);
    height: calc(100% + 32px);
  }
}

.bgo-cracks-glow path {
  fill: none;
  stroke: rgba(46, 144, 255, 0.6);
  stroke-width: 3.5;
  vector-effect: non-scaling-stroke;
  filter: blur(1px);
}

.bgo-cracks-line path {
  fill: none;
  stroke: rgba(198, 214, 244, 0.55);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

.bgo-cracks-fine path {
  fill: none;
  stroke: rgba(198, 214, 244, 0.3);
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
}

@keyframes bgo-crack-in {
  to { opacity: 1; }
}

/* ── glass shard ─────────────────────────────────────────────────────── */
.bgo-shard {
  position: absolute;
  transform-origin: 50% 50%;
  will-change: transform;
  transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  touch-action: pan-y;
  cursor: default;
}

.bgo-shard--entering {
  opacity: 0;
  animation: bgo-shard-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes bgo-shard-enter {
  from {
    opacity: 0;
    transform: translate3d(var(--bgo-enter-tx, 0), var(--bgo-enter-ty, 0), 100px)
               rotateX(var(--bgo-enter-rx, 0)) rotateY(var(--bgo-enter-ry, 0));
    filter: brightness(2) blur(2px);
  }
  55% {
    opacity: 1;
    filter: brightness(1.1) blur(0px);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, var(--bgo-rest-tz, 0))
               rotateX(var(--bgo-rest-rx, 0)) rotateY(var(--bgo-rest-ry, 0));
    filter: none;
  }
}

.bgo-shard:active {
  z-index: 40 !important;
  filter:
    brightness(1.25)
    drop-shadow(0 14px 22px rgba(0, 0, 0, 0.6))
    drop-shadow(0 0 12px var(--bgo-primary-glow));
  transform: translate3d(0, -1px, 28px) rotateX(-1deg) rotateY(2deg) scale(1.03) !important;
}

/* ── glass surface ───────────────────────────────────────────────────── */
.bgo-glass {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.bgo-glass-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      135deg,
      rgba(5, 7, 10, 0.8) 0%,
      rgba(14, 20, 32, 0.88) 40%,
      rgba(5, 7, 10, 0.78) 100%
    );
  border: 1.5px solid rgba(46, 144, 255, 0.4);
  border-radius: inherit;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.bgo-glass-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      132deg,
      rgba(165, 185, 232, 0.12) 0%,
      rgba(46, 144, 255, 0.05) 28%,
      transparent 46%,
      transparent 60%,
      rgba(46, 144, 255, 0.08) 100%
    );
  mix-blend-mode: screen;
  border-radius: inherit;
}

/* ── main shard (the one with content) ───────────────────────────────── */
.bgo-shard--main {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  clip-path: polygon(2% 0%, 98% 2%, 100% 38%, 97% 96%, 3% 100%, 0% 42%);
  border-radius: 14px;
}

.bgo-shard--main .bgo-glass-bg {
  border-color: rgba(46, 144, 255, 0.5);
  box-shadow:
    0 0 0 1px rgba(46, 144, 255, 0.2),
    0 0 30px rgba(46, 144, 255, 0.3),
    0 0 60px rgba(46, 144, 255, 0.1),
    inset 0 0 15px rgba(46, 144, 255, 0.1);
}

/* ── content layout inside main shard ────────────────────────────────── */
.bgo-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
}

.bgo-content__lead {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 100%;
  background: var(--bgo-primary);
  color: var(--bgo-body);
  font-weight: 700;
  white-space: nowrap;
  clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
  padding-right: 1.4rem;
}

.bgo-content__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--bgo-body);
  flex-shrink: 0;
  box-shadow: 0 0 4px rgba(5, 7, 10, 0.5);
}

.bgo-content__rest {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem 0 0.8rem;
  height: 100%;
  color: #FFFFFF;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(46, 144, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5);
}

.bgo-content__sep {
  color: var(--bgo-primary);
  font-weight: 700;
  text-shadow: 0 0 6px var(--bgo-primary-glow);
}

/* ── shimmer sweep ───────────────────────────────────────────────────── */
.bgo-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255, 255, 255, 0.22) 44%,
    rgba(200, 220, 255, 0.12) 50%,
    transparent 62%
  );
  transform: translateX(-100%);
  animation: bgo-sweep 5s ease-in-out 1.2s infinite;
  pointer-events: none;
  border-radius: inherit;
  z-index: 3;
}

@keyframes bgo-sweep {
  0%, 65% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ── edge highlights ─────────────────────────────────────────────────── */
.bgo-edge {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 4;
}

.bgo-edge::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px solid rgba(46, 144, 255, 0.35);
  border-radius: inherit;
}

.bgo-edge::after {
  content: '';
  position: absolute;
  inset: -1px;
  border: 1px solid rgba(46, 144, 255, 0.1);
  border-radius: inherit;
  filter: blur(4px);
}

/* ── decorative splinter shards ──────────────────────────────────────── */
.bgo-splinter {
  position: absolute;
  pointer-events: none;
}

.bgo-splinter-inner {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(
      135deg,
      rgba(14, 20, 35, 0.85) 0%,
      rgba(46, 144, 255, 0.12) 50%,
      rgba(14, 20, 35, 0.7) 100%
    );
  border: 1.5px solid rgba(46, 144, 255, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 0 12px rgba(46, 144, 255, 0.15),
    inset 0 0 6px rgba(46, 144, 255, 0.05);
}

.bgo-splinter-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      120deg,
      rgba(165, 185, 232, 0.08) 0%,
      transparent 40%,
      rgba(46, 144, 255, 0.04) 100%
    );
  mix-blend-mode: screen;
}

/* ── specular on main shard ──────────────────────────────────────────── */
.bgo-specular {
  position: absolute;
  inset: 0;
  opacity: 0;
  background:
    radial-gradient(
      ellipse 50% 50% at var(--bgo-mx, 50%) var(--bgo-my, 50%),
      rgba(205, 225, 255, 0.2),
      rgba(46, 144, 255, 0.06) 50%,
      transparent 78%
    );
  mix-blend-mode: screen;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  border-radius: inherit;
}

.bgo-shard:active .bgo-specular {
  opacity: 1;
}

/* ── a11y ─────────────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .bgo-shard,
  .bgo-specular {
    transition: none !important;
  }
  .bgo-shard--entering {
    animation: none !important;
    opacity: 1 !important;
  }
  .bgo-cracks {
    animation: none !important;
    opacity: 1 !important;
  }
  .bgo-shimmer {
    animation: none !important;
  }
}
`;

/* ─── CRACK PATHS ─────────────────────────────────────────────────────── */
const CRACK_MAIN = [
  // Long horizontal fractures
  "M0 22L42 18L88 24L130 20L175 25L218 19L260 23L302 17L345 22L388 20L420 23",
  "M0 36L55 32L120 38L195 34L270 37L340 33L420 36",
  // Radiating from impact points
  "M210 0L205 10L212 22L208 35L215 44",
  "M85 0L90 12L83 22L88 36L82 44",
  "M310 0L315 8L308 18L312 30L305 44",
  // Diagonal web
  "M175 22L155 28L130 38",
  "M260 22L280 30L310 36",
  "M42 18L50 30L65 38",
  "M345 22L338 32L320 38",
  // Secondary fractures
  "M130 20L140 12L160 8",
  "M302 17L290 10L265 5",
];

const CRACK_FINE = [
  "M95 22L100 25", "M240 20L245 17", "M155 35L148 38",
  "M360 22L365 18", "M50 32L45 36", "M280 34L285 30",
  "M190 8L195 12", "M330 10L335 14", "M110 28L105 32",
  "M380 30L375 34",
];

/* ─── SPLINTER DEFINITIONS ────────────────────────────────────────────── */
type SplinterDef = {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  clip: string;
  rx: number;
  ry: number;
  tz: number;
  enterTx: number;
  enterTy: number;
  enterRx: number;
  enterRy: number;
  delay: number;
  z: number;
};

const SPLINTERS: SplinterDef[] = [
  // Top-left fragment
  {
    id: "tl", left: "-10%", top: "-65%", width: "38%", height: "100%",
    clip: "polygon(15% 30%, 85% 0%, 100% 60%, 80% 100%, 5% 85%)",
    rx: 3.2, ry: -4.8, tz: 22,
    enterTx: -50, enterTy: -35, enterRx: 10, enterRy: -15, delay: 0.3, z: 18,
  },
  // Top-right fragment
  {
    id: "tr", left: "76%", top: "-60%", width: "36%", height: "95%",
    clip: "polygon(8% 12%, 95% 0%, 100% 55%, 82% 100%, 0% 78%)",
    rx: -2.8, ry: 5.2, tz: 18,
    enterTx: 45, enterTy: -32, enterRx: -8, enterRy: 12, delay: 0.38, z: 17,
  },
  // Bottom-left fragment
  {
    id: "bl", left: "-12%", top: "70%", width: "34%", height: "90%",
    clip: "polygon(10% 0%, 100% 15%, 90% 80%, 65% 100%, 0% 88%)",
    rx: 2.4, ry: -3.4, tz: 15,
    enterTx: -38, enterTy: 30, enterRx: -7, enterRy: -10, delay: 0.45, z: 16,
  },
  // Bottom-right fragment
  {
    id: "br", left: "80%", top: "65%", width: "32%", height: "88%",
    clip: "polygon(0% 8%, 90% 0%, 100% 70%, 88% 100%, 12% 92%)",
    rx: -3.6, ry: 4.2, tz: 20,
    enterTx: 40, enterTy: 28, enterRx: 9, enterRy: 11, delay: 0.52, z: 19,
  },
  // Small top splinter
  {
    id: "tc", left: "35%", top: "-55%", width: "24%", height: "72%",
    clip: "polygon(20% 0%, 80% 10%, 95% 85%, 5% 100%)",
    rx: 4.5, ry: -1.5, tz: 28,
    enterTx: 8, enterTy: -42, enterRx: 12, enterRy: -4, delay: 0.58, z: 20,
  },
  // Small bottom splinter
  {
    id: "bc", left: "40%", top: "82%", width: "22%", height: "65%",
    clip: "polygon(5% 0%, 95% 12%, 80% 100%, 15% 88%)",
    rx: -3, ry: 2, tz: 24,
    enterTx: -8, enterTy: 38, enterRx: -10, enterRy: 3, delay: 0.62, z: 21,
  },
];

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
export interface BrokenGlassOfferProps {
  className?: string;
}

export default function BrokenGlassOffer({ className = "" }: BrokenGlassOfferProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const shard = e.currentTarget as HTMLDivElement;
    const r = shard.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const my = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    shard.style.setProperty("--bgo-mx", `${mx}%`);
    shard.style.setProperty("--bgo-my", `${my}%`);
  }, []);

  return (
    <>
      <style>{GLASS_CSS}</style>
      <div className={`bgo ${className}`} aria-label="Paid once — Yours for life — Zero monthly subscriptions">
        <div className="bgo-stage">

          {/* SVG Crack Network */}
          <svg
            className="bgo-cracks"
            viewBox="0 0 420 44"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g className="bgo-cracks-glow">
              {CRACK_MAIN.map((d, i) => (
                <path key={`g${i}`} d={d} />
              ))}
            </g>
            <g className="bgo-cracks-line">
              {CRACK_MAIN.map((d, i) => (
                <path key={`l${i}`} d={d} />
              ))}
            </g>
            <g className="bgo-cracks-fine">
              {CRACK_FINE.map((d, i) => (
                <path key={`f${i}`} d={d} />
              ))}
            </g>
          </svg>

          {/* Decorative splinter shards (no content) */}
          {SPLINTERS.map((s) => (
            <div
              key={s.id}
              className={`bgo-shard bgo-splinter ${entered ? "bgo-shard--entering" : ""}`}
              style={{
                left: s.left,
                top: s.top,
                width: s.width,
                height: s.height,
                clipPath: s.clip,
                zIndex: s.z,
                animationDelay: `${s.delay}s`,
                ["--bgo-enter-tx" as string]: `${s.enterTx}px`,
                ["--bgo-enter-ty" as string]: `${s.enterTy}px`,
                ["--bgo-enter-rx" as string]: `${s.enterRx}deg`,
                ["--bgo-enter-ry" as string]: `${s.enterRy}deg`,
                ["--bgo-rest-rx" as string]: `${s.rx}deg`,
                ["--bgo-rest-ry" as string]: `${s.ry}deg`,
                ["--bgo-rest-tz" as string]: `${s.tz}px`,
              } as React.CSSProperties}
            >
              <div className="bgo-splinter-inner" />
            </div>
          ))}

          {/* Main glass shard (holds the offer text) */}
          <div
            className={`bgo-shard bgo-shard--main ${entered ? "bgo-shard--entering" : ""}`}
            onPointerMove={handlePointerMove}
            style={{
              animationDelay: "0.15s",
              ["--bgo-enter-tx" as string]: "0px",
              ["--bgo-enter-ty" as string]: "-20px",
              ["--bgo-enter-rx" as string]: "-6deg",
              ["--bgo-enter-ry" as string]: "0deg",
              ["--bgo-rest-rx" as string]: "0deg",
              ["--bgo-rest-ry" as string]: "0deg",
              ["--bgo-rest-tz" as string]: "8px",
            } as React.CSSProperties}
          >
            <div className="bgo-glass">
              <div className="bgo-glass-bg" />
              <div className="bgo-specular" />
            </div>
            <div className="bgo-edge" />

            <div className="bgo-content">
              <span className="bgo-content__lead">
                <span className="bgo-content__dot" aria-hidden="true" />
                Paid once
              </span>
              <span className="bgo-content__rest">
                <span>Yours for life</span>
                <span className="bgo-content__sep" aria-hidden="true">/</span>
                <span>Zero monthly subscriptions</span>
              </span>
            </div>
            <div className="bgo-shimmer" />
          </div>

        </div>
      </div>
    </>
  );
}

export { BrokenGlassOffer };
