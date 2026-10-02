"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";

export interface PillNavItem {
  label: string;
  href: string;
}

/**
 * Adaptive navigation pill: open with every link at the top of the page,
 * then it springs down to the section being read and opens again on hover,
 * keyboard focus or tap. Links are real anchors, so it works before hydration.
 */

const TOP_THRESHOLD = 80;
const COLLAPSE_DELAY = 600;
const SPRING = { stiffness: 220, damping: 25, mass: 1 };
// Gunmetal pill with a static brushed-chrome rim (same family as the liquid-metal buttons).
const PILL_BG =
  "linear-gradient(180deg, #2a3445 0%, #1b2331 46%, #111822 100%) padding-box, linear-gradient(135deg, #4a5462, #b9c3d0 25%, #394351 50%, #8f9aa8 75%, #4a5462) border-box";
const EMBOSS = "0 -1px 0 rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.05)";

const idOf = (href: string) => href.split("#")[1] ?? "";

export function PillBase({ items }: { items: PillNavItem[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [atTop, setAtTop] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const widths = useRef({ open: 540, closed: 150 });
  const width = useSpring(540, SPRING);

  const want = atTop || hovering || keyboard || pinned;
  const activeItem = items.find((i) => idOf(i.href) === active) ?? null;

  // The section whose area contains the 40% line of the viewport.
  useEffect(() => {
    const ids = items.map((i) => idOf(i.href));
    let raf = 0;
    const update = () => {
      raf = 0;
      setAtTop(window.scrollY < TOP_THRESHOLD);
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= line && r.bottom > line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // Size the pill to its content: all links when open, the one label when closed.
  const setWidth = (value: number) => (reduceMotion ? width.jump(value) : width.set(value));
  useEffect(() => {
    const measure = () => {
      if (linksRef.current) widths.current.open = linksRef.current.scrollWidth + 12;
      if (labelRef.current) widths.current.closed = labelRef.current.scrollWidth + 36;
      setWidth(open ? widths.current.open : widths.current.closed);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [open, activeItem?.href]);

  // Opening is immediate; closing waits a moment so the pill does not flicker.
  useEffect(() => {
    if (want) {
      setOpen(true);
      return;
    }
    const t = window.setTimeout(() => setOpen(false), COLLAPSE_DELAY);
    return () => window.clearTimeout(t);
  }, [want]);

  // A tap outside closes a pill that was opened by tapping.
  useEffect(() => {
    if (!pinned) return;
    const close = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [pinned]);

  return (
    <motion.nav
      ref={navRef}
      aria-label="Main"
      className="relative h-[50px] overflow-hidden rounded-full"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setKeyboard(true)}
      onBlur={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node)) setKeyboard(false);
      }}
      style={{
        width,
        border: "1px solid transparent",
        background: PILL_BG,
        boxShadow: open
          ? "0 10px 30px rgba(0,0,0,.5), 0 0 28px rgba(46,144,255,.16), inset 0 1px 0 rgba(255,255,255,.12), inset 0 -3px 8px rgba(0,0,0,.45)"
          : "0 6px 18px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1), inset 0 -3px 8px rgba(0,0,0,.4)",
        transition: "box-shadow .3s ease-out",
      }}
    >
      {/* Light on the metal: top ridge, upper light catch, gloss and a shaded underside. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.4) 15%, rgba(255,255,255,.45) 85%, transparent)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] rounded-full"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,0))" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[16%] h-3 rounded-full transition-all duration-300"
        style={{
          left: open ? "16%" : "14%",
          width: open ? 140 : 56,
          background: "radial-gradient(ellipse at center, rgba(255,255,255,.18), rgba(255,255,255,0) 70%)",
          filter: "blur(4px)",
          transform: "rotate(-10deg)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-full"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,0))" }}
      />

      {/* Every link is always in the page, so keyboards and screen readers reach them. */}
      <div
        ref={linksRef}
        className="relative z-10 flex h-full w-max items-center px-1.5 font-primary transition-opacity duration-200"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      >
        {items.map((item, i) => {
          const on = idOf(item.href) === active;
          return (
            <motion.a
              key={item.href}
              href={item.href}
              aria-current={on ? "location" : undefined}
              onClick={() => {
                setPinned(false);
                setHovering(false);
              }}
              initial={false}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ delay: open ? i * 0.05 : 0, duration: 0.22, ease: "easeOut" }}
              className="relative rounded-full px-4 py-2 text-[15px] whitespace-nowrap outline-none transition-colors duration-200 hover:text-[#EEF2F8] focus-visible:ring-2 focus-visible:ring-[#5AABFF]"
              style={{ color: on ? "#EEF2F8" : "#9AA5B5", fontWeight: on ? 650 : 500, textShadow: EMBOSS }}
            >
              {on && (
                <motion.span
                  layoutId="pill-nav-active"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[#2E90FF]/45 bg-[#2E90FF]/15 shadow-[0_0_14px_rgba(46,144,255,.25)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </motion.a>
          );
        })}
      </div>

      {/* Closed: only the section being read (or "Menu"); tap opens it on touch screens. */}
      <div
        aria-hidden="true"
        onClick={() => setPinned(true)}
        className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center font-primary transition-opacity duration-200"
        style={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
      >
        <span ref={labelRef} className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={`size-1.5 rounded-full ${activeItem ? "bg-[#2E90FF] shadow-[0_0_8px_rgba(46,144,255,.9)]" : "bg-[#5E6B7D]"}`}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeItem?.href ?? "menu"}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="text-[15px] font-semibold text-[#EEF2F8]"
              style={{ textShadow: EMBOSS }}
            >
              {activeItem?.label ?? "Menu"}
            </motion.span>
          </AnimatePresence>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#8A94A3]">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </motion.nav>
  );
}

export default PillBase;
