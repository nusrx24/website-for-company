"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const BASE_SPEED = 0.6;
const HOVER_SPEED = 1;
const PRESS_SPEED = 2.4;

// 0.0.81 uniform set: shape 0 fills the whole canvas, so the metal reads as
// a continuous ring around the pill rather than a masked circle.
const UNIFORMS = {
  u_colorBack: [0.66, 0.68, 0.72, 1],
  u_colorTint: [0.8, 0.88, 1, 1],
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_shape: 0,
  u_isImage: false,
  u_fit: 0,
  u_scale: 1,
  u_rotation: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
  u_worldWidth: 0,
  u_worldHeight: 0,
  u_imageAspectRatio: 1,
};

const STYLE_ID = "liquid-metal-button-style";
const GLOBAL_CSS = `
.lmb-shader canvas {
  position: absolute !important; inset: 0 !important;
  width: 100% !important; height: 100% !important;
  display: block !important; border-radius: 999px !important;
}
@keyframes lmb-ripple {
  from { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
  to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}`;

/** Static chrome edge for things that are not buttons (info chips). */
export const brushedMetalEdge: React.CSSProperties = {
  border: "1px solid transparent",
  background:
    "linear-gradient(#0B1320, #0B1320) padding-box, linear-gradient(135deg, #4a5462, #b9c3d0 25%, #394351 50%, #8f9aa8 75%, #4a5462) border-box",
};

interface LiquidMetalFrameProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Animated chrome rim around a dark pill. Anything inside is laid out on top;
 * hover, press and click on any child drive the metal.
 */
export function LiquidMetalFrame({ children, fullWidth = false, className }: LiquidMetalFrameProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const mount = useRef<ShaderMount | null>(null);
  const hovered = useRef(false);
  const rippleId = useRef(0);
  const still = useRef(false);

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }

    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    const host = shaderRef.current;
    if (!root || !host) return;

    // Each frame owns a WebGL context, so it is only created once the frame
    // is near the viewport and the animation stops while off screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !mount.current) {
          try {
            mount.current = new ShaderMount(
              host,
              liquidMetalFragmentShader,
              UNIFORMS as unknown as ConstructorParameters<typeof ShaderMount>[2],
              undefined,
              still.current ? 0 : BASE_SPEED,
            );
          } catch {
            /* No WebGL: the CSS chrome gradient underneath stays visible. */
          }
        }
        if (!still.current) {
          mount.current?.setSpeed(
            entry.isIntersecting ? (hovered.current ? HOVER_SPEED : BASE_SPEED) : 0,
          );
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      mount.current?.dispose();
      mount.current = null;
    };
  }, []);

  const setSpeed = (speed: number) => {
    if (!still.current) mount.current?.setSpeed(speed);
  };

  const handleEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered.current = true;
    setIsHovered(true);
    setSpeed(HOVER_SPEED);
  };

  const handleLeave = () => {
    hovered.current = false;
    setIsHovered(false);
    setIsPressed(false);
    setSpeed(BASE_SPEED);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setSpeed(PRESS_SPEED);
    window.setTimeout(() => setSpeed(hovered.current ? HOVER_SPEED : BASE_SPEED), 300);

    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
  };

  const shadow = isPressed
    ? "0 0 0 1px rgba(0,0,0,.5), 0 1px 2px rgba(0,0,0,.3)"
    : isHovered
      ? "0 0 0 1px rgba(0,0,0,.4), 0 8px 18px rgba(0,0,0,.35), 0 0 28px rgba(46,144,255,.35)"
      : "0 0 0 1px rgba(0,0,0,.3), 0 20px 12px rgba(0,0,0,.08), 0 9px 9px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.15), 0 0 18px rgba(46,144,255,.18)";

  return (
    <span
      ref={rootRef}
      className={cn(
        "relative isolate rounded-full transition-[transform,box-shadow] duration-200 ease-out",
        fullWidth ? "flex w-full" : "inline-flex",
        className,
      )}
      style={{ boxShadow: shadow, transform: isPressed ? "translateY(1px) scale(0.98)" : "none" }}
      onClick={handleClick}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
    >
      {/* Metal ring. The gradient is the no-WebGL fallback; the canvas paints over it. */}
      <span
        ref={shaderRef}
        aria-hidden="true"
        className="lmb-shader absolute inset-0 overflow-hidden rounded-full"
        style={{
          background:
            "conic-gradient(from 210deg, #8d96a3, #f4f7fb 18%, #6f7885 35%, #dfe6ef 52%, #7f8894 70%, #f4f7fb 86%, #8d96a3)",
        }}
      />
      {/* Inner pill */}
      <span
        aria-hidden="true"
        className="absolute inset-[2px] rounded-full transition-shadow duration-150"
        style={{
          background: "linear-gradient(180deg, #111c2b 0%, #02050a 100%)",
          boxShadow: isPressed
            ? "inset 0 2px 4px rgba(0,0,0,.45), inset 0 1px 2px rgba(0,0,0,.3)"
            : "inset 0 1px 0 rgba(255,255,255,.07)",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[2px] z-[5] overflow-hidden rounded-full">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute size-5 rounded-full"
            style={{
              left: r.x - 2,
              top: r.y - 2,
              background: "radial-gradient(circle, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 70%)",
              animation: "lmb-ripple .6s ease-out",
            }}
          />
        ))}
      </span>
      {children}
    </span>
  );
}

interface LiquidMetalButtonProps {
  label: string;
  /** Renders a link when set, otherwise a button. */
  href?: string;
  target?: string;
  onClick?: () => void;
  size?: "md" | "sm";
  /** "cta" for calls to action; "control" for interface toggles. */
  variant?: "cta" | "control";
  icon?: React.ReactNode;
  pressed?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function LiquidMetalButton({
  label,
  href,
  target,
  onClick,
  size = "md",
  variant = "cta",
  icon,
  pressed,
  fullWidth = false,
  className,
}: LiquidMetalButtonProps) {
  const external = target ?? (href?.startsWith("http") ? "_blank" : undefined);
  const interactive = cn(
    "relative z-10 inline-flex h-full w-full items-center justify-center gap-2 rounded-full whitespace-nowrap text-[#EEF2F8] outline-none [text-shadow:0_1px_2px_rgba(0,0,0,.5)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-light",
    variant === "cta"
      ? "font-primary font-semibold uppercase"
      : "font-mono font-semibold normal-case",
    variant === "cta"
      ? size === "md"
        ? "px-8 text-sm tracking-[0.08em]"
        : "px-4 text-xs tracking-[0.06em]"
      : "px-4 text-xs",
  );

  return (
    <LiquidMetalFrame fullWidth={fullWidth} className={cn(size === "md" ? "h-12" : "h-9", className)}>
      {href ? (
        <a
          href={href}
          target={external}
          rel={external === "_blank" ? "noopener noreferrer" : undefined}
          className={interactive}
          onClick={onClick}
        >
          {icon}
          {label}
        </a>
      ) : (
        <button type="button" className={interactive} onClick={onClick} aria-pressed={pressed}>
          {icon}
          {label}
        </button>
      )}
    </LiquidMetalFrame>
  );
}

export default LiquidMetalButton;
