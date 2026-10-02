"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Mapped to the site theme: body #05070A, light #141A23, border #232B37,
// primary #2E90FF, text-light #EEF2F8, text-dark #8A94A3.
const STYLES = `
.cf-wrap { -webkit-font-smoothing: antialiased; }
@keyframes cf-breathe {
  from { transform: translate(-50%, -50%) scale(1); opacity: .6; }
  to { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}
@keyframes cf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cf-breathe { animation: cf-breathe 8s ease-in-out infinite alternate; }
.cf-marquee { animation: cf-marquee 40s linear infinite; }
.cf-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(238,242,248,.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(238,242,248,.035) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}
.cf-aurora {
  background: radial-gradient(circle at 50% 50%, rgba(46,144,255,.18) 0%, rgba(18,104,216,.12) 40%, transparent 70%);
}
.cf-pill {
  background: linear-gradient(145deg, rgba(238,242,248,.05) 0%, rgba(238,242,248,.015) 100%);
  box-shadow: 0 10px 30px -10px rgba(5,7,10,.6), inset 0 1px 1px rgba(238,242,248,.1), inset 0 -1px 2px rgba(5,7,10,.8);
  border: 1px solid rgba(238,242,248,.09);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: background .4s cubic-bezier(.16,1,.3,1), border-color .4s cubic-bezier(.16,1,.3,1), box-shadow .4s cubic-bezier(.16,1,.3,1), color .2s ease;
}
.cf-pill:hover, .cf-pill:focus-visible {
  background: linear-gradient(145deg, rgba(46,144,255,.14) 0%, rgba(46,144,255,.04) 100%);
  border-color: rgba(46,144,255,.45);
  box-shadow: 0 20px 40px -10px rgba(5,7,10,.7), inset 0 1px 1px rgba(238,242,248,.18), 0 0 24px rgba(46,144,255,.18);
  color: #EEF2F8;
}
.cf-pill:focus-visible { outline: 2px solid #5AABFF; outline-offset: 3px; }
.cf-giant {
  font-size: 17.5vw;
  line-height: .75;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(238,242,248,.06);
  background: linear-gradient(180deg, rgba(46,144,255,.14) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}
.cf-glow {
  background: linear-gradient(180deg, #EEF2F8 0%, rgba(238,242,248,.45) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(46,144,255,.18));
}
@media (prefers-reduced-motion: reduce) {
  .cf-breathe, .cf-marquee { animation: none; }
}
`;

// ── magnetic pill: drifts towards the pointer (mouse only) ─────────────
type MagneticProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "a" | "button" };

function Magnetic({ as = "a", className, children, ...props }: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, rotationX: -y * 0.12, rotationY: x * 0.12, scale: 1.04, ease: "power2.out", duration: 0.4 });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)", duration: 1.2 });
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
      gsap.killTweensOf(el);
    };
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("cursor-pointer outline-none", className)} {...props}>
      {children}
    </Tag>
  );
}

// ── footer ─────────────────────────────────────────────────────────────
export interface CinematicFooterProps {
  whatsappHref: string;
  phoneHref: string;
  phoneLabel: string;
  email: string;
  emailHref: string;
  links: Array<{ label: string; href: string }>;
  places: string[];
  bandItems: string[];
  socials?: Array<{ name: string; href: string }>;
  /** Trusted HTML from config.json (contains &copy; and <strong>). */
  copyrightHtml: string;
}

function Band({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-10 px-5">
      {items.map((item) => (
        <React.Fragment key={item}>
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-[#2E90FF] shadow-[0_0_10px_rgba(46,144,255,.8)]" />
        </React.Fragment>
      ))}
    </div>
  );
}

export function CinematicFooter({
  whatsappHref,
  phoneHref,
  phoneLabel,
  email,
  emailHref,
  links,
  places,
  bandItems,
  socials = [],
  copyrightHtml,
}: CinematicFooterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Scroll-linked reveal, desktop only: there the footer is a full-height
  // curtain, so both trigger points are always reached. On phones the footer
  // is ordinary content and simply stays visible.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        giantRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: wrapper, start: "top 80%", end: "bottom bottom", scrub: 1 },
        },
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapper, start: "top 40%", end: "bottom bottom", scrub: 1 },
        },
      );
    });

    // Sections above hydrate and change height after this runs.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      mm.revert();
    };
  }, []);

  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* Curtain: the wrapper sits in the page flow; its clip-path limits the
          fixed footer inside it to the wrapper's own box, so scrolling the
          wrapper up reveals the footer from underneath. */}
      <div
        ref={wrapperRef}
        className="relative w-full md:h-screen"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cf-wrap relative flex w-full flex-col justify-between overflow-hidden bg-body pt-28 font-primary text-text-light md:fixed md:bottom-0 md:left-0 md:h-screen md:pt-0">
          <div aria-hidden="true" className="cf-aurora cf-breathe pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
          <div aria-hidden="true" className="cf-grid pointer-events-none absolute inset-0 z-0" />

          <div
            ref={giantRef}
            aria-hidden="true"
            className="cf-giant pointer-events-none absolute -bottom-[3vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-secondary font-bold uppercase"
          >
            LapCircuit
          </div>

          {/* Slanted band of what LapCircuit offers. */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-10 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/70 bg-body/70 py-4 shadow-2xl backdrop-blur-md md:top-12"
          >
            <div className="cf-marquee flex w-max font-secondary text-sm font-semibold text-text-dark md:text-base">
              <Band items={bandItems} />
              <Band items={bandItems} />
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-14 md:mt-20 md:px-6 md:pb-0">
            <h2
              ref={headingRef}
              className="cf-glow mb-10 text-center font-secondary text-4xl font-bold tracking-tight [text-wrap:balance] sm:text-5xl md:mb-12 md:text-7xl"
            >
              Ready to see it at your counter?
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
              <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-4">
                <Magnetic
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cf-pill group flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold text-text-light sm:px-9 sm:py-5 md:text-base"
                >
                  <svg className="size-5 text-[#2E90FF]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.24 8.24 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                  Request a demo on WhatsApp
                </Magnetic>
                <Magnetic
                  href={phoneHref}
                  className="cf-pill group flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold text-text-light sm:px-9 sm:py-5 md:text-base"
                >
                  <svg className="size-5 text-text-dark transition-colors group-hover:text-text-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75h3l1.5 4.5-2.25 1.5a11.25 11.25 0 0 0 5.5 5.5l1.5-2.25 4.5 1.5v3A1.5 1.5 0 0 1 16.75 19C9.43 19 5 14.57 5 7.25A1.5 1.5 0 0 1 4.5 3.75Z" />
                  </svg>
                  Call {phoneLabel}
                </Magnetic>
              </div>

              <nav aria-label="Footer" className="flex w-full flex-wrap justify-center gap-2.5 md:gap-3">
                <Magnetic href={emailHref} className="cf-pill rounded-full px-5 py-2.5 text-xs font-medium text-text-dark md:text-sm">
                  {email}
                </Magnetic>
                {links.map((link) => (
                  <Magnetic key={link.href} href={link.href} className="cf-pill rounded-full px-5 py-2.5 text-xs font-medium text-text-dark md:text-sm">
                    {link.label}
                  </Magnetic>
                ))}
                {socials.map((s) => (
                  <Magnetic
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="cf-pill rounded-full px-5 py-2.5 text-xs font-medium capitalize text-text-dark md:text-sm"
                  >
                    {s.name}
                  </Magnetic>
                ))}
              </nav>
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-5 px-5 pb-8 md:flex-row md:px-12">
            <p
              className="order-2 text-center text-xs text-text-dark md:order-1 md:text-left [&_strong]:font-semibold [&_strong]:text-text-light"
              dangerouslySetInnerHTML={{ __html: copyrightHtml }}
            />

            <p className="cf-pill order-1 flex items-center gap-2.5 rounded-full px-5 py-2.5 text-center text-xs text-text-dark md:order-2">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#2E90FF] shadow-[0_0_8px_rgba(46,144,255,.9)]" />
              <span>
                Local support in{" "}
                <span className="font-semibold text-text-light">
                  {places.length > 1 ? `${places.slice(0, -1).join(", ")} and ${places[places.length - 1]}` : places[0]}
                </span>
              </span>
            </p>

            <Magnetic
              as="button"
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="cf-pill group order-3 flex size-12 items-center justify-center rounded-full text-text-dark"
            >
              <svg className="size-5 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </Magnetic>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
