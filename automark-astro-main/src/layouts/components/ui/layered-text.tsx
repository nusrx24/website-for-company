"use client"

import React, { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"

interface LayeredTextProps {
  lines?: Array<{ top: string; bottom: string }>
  fontSize?: string
  fontSizeMd?: string
  lineHeight?: number
  lineHeightMd?: number
  className?: string
}

// Below 768px the `Md` sizes apply (font size, row height and the sideways
// step between rows), so the stack fits a phone instead of stretching the
// hero past the screen edge. Phones have no hover, so there a tap rolls the
// words, and the roll plays once by itself the first time the headline is in
// view so the effect is not hidden from touch users.
export function LayeredText({
  lines = [
    { top: " ", bottom: "YOUR" },
    { top: "YOUR", bottom: "BUSINESS." },
    { top: "BUSINESS.", bottom: "YOUR" },
    { top: "YOUR", bottom: "POS." },
    { top: "POS.", bottom: "YOUR" },
    { top: "YOUR", bottom: "WAY." },
    { top: "WAY.", bottom: " " },
  ],
  fontSize = "72px",
  fontSizeMd = "36px",
  lineHeight = 60,
  lineHeightMd = 35,
  className = "",
}: LayeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const calculateTranslateX = useCallback(
    (index: number) => {
      const baseOffset = 30
      const baseOffsetMd = 18
      const centerIndex = Math.floor(lines.length / 2)
      // Shift all rows right so the leftmost skewed letters don't clip
      const shiftRight = 70
      const shiftRightMd = 8
      return {
        desktop: (index - centerIndex) * baseOffset + shiftRight,
        mobile: (index - centerIndex) * baseOffsetMd + shiftRightMd,
      }
    },
    [lines],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const paragraphs = container.querySelectorAll("p")

    // yPercent, not a pixel shift: each paragraph is exactly one row tall at
    // every breakpoint, so -100% is always one row, even after a resize.
    const tl = gsap.timeline({ paused: true }).to(paragraphs, {
      yPercent: -100,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.08,
    })

    const play = () => tl.play()
    const reverse = () => tl.reverse()

    if (!window.matchMedia("(hover: none)").matches) {
      container.addEventListener("mouseenter", play)
      container.addEventListener("mouseleave", reverse)
      return () => {
        container.removeEventListener("mouseenter", play)
        container.removeEventListener("mouseleave", reverse)
        tl.kill()
      }
    }

    // Touch: tap to roll forward or back, plus one roll-and-return on first view.
    let intro: gsap.core.Tween | undefined
    let outro: gsap.core.Tween | undefined
    const toggle = () => {
      intro?.kill()
      outro?.kill()
      if (!tl.reversed() && tl.progress() > 0) tl.reverse()
      else tl.play()
    }
    container.addEventListener("click", toggle)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        intro = gsap.delayedCall(0.6, () => {
          tl.play()
          outro = gsap.delayedCall(2.6, reverse)
        })
      },
      { threshold: 0.6 },
    )
    io.observe(container)

    return () => {
      container.removeEventListener("click", toggle)
      io.disconnect()
      intro?.kill()
      outro?.kill()
      tl.kill()
    }
  }, [lines])

  return (
    <div
      ref={containerRef}
      className={`font-secondary font-bold tracking-[-0.02em] uppercase antialiased cursor-pointer select-none [-webkit-tap-highlight-color:transparent] [font-size:var(--lt-size)] [--row:var(--lt-row)] max-md:[font-size:var(--lt-size-md)] max-md:[--row:var(--lt-row-md)] ${className}`}
      style={
        {
          "--lt-size": fontSize,
          "--lt-size-md": fontSizeMd,
          "--lt-row": `${lineHeight}px`,
          "--lt-row-md": `${lineHeightMd}px`,
        } as React.CSSProperties
      }
      role="heading"
      aria-level={1}
      aria-label="Your business. Your POS. Your way."
    >
      <ul aria-hidden="true" className="list-none p-0 m-0 flex flex-col items-center lg:items-start">
        {lines.map((line, index) => {
          const translateX = calculateTranslateX(index)
          const isEven = index % 2 === 0
          const skew = `skew(${isEven ? "60deg, -30deg" : "0deg, -30deg"}) scaleY(${isEven ? "0.66667" : "1.33333"})`
          return (
            <li
              key={index}
              className="relative overflow-hidden h-[var(--row)] [transform:var(--lt-t)] max-md:[transform:var(--lt-t-md)]"
              style={
                {
                  "--lt-t": `translateX(${translateX.desktop}px) ${skew}`,
                  "--lt-t-md": `translateX(${translateX.mobile}px) ${skew}`,
                } as React.CSSProperties
              }
            >
              <p
                className="m-0 h-[var(--row)] whitespace-nowrap px-[14px] align-top leading-[calc(var(--row)-4px)] max-md:px-2"
                style={{
                  color: isEven ? "#2E90FF" : "#ffffff",
                  textShadow: isEven
                    ? "0 0 40px rgba(46, 144, 255, 0.5), 0 0 80px rgba(46, 144, 255, 0.15)"
                    : "0 2px 10px rgba(0, 0, 0, 0.4)",
                }}
              >
                {line.top}
              </p>
              <p
                className="m-0 h-[var(--row)] whitespace-nowrap px-[14px] align-top leading-[calc(var(--row)-4px)] max-md:px-2"
                style={{
                  color: isEven ? "#ffffff" : "#2E90FF",
                  textShadow: isEven
                    ? "0 2px 10px rgba(0, 0, 0, 0.4)"
                    : "0 0 40px rgba(46, 144, 255, 0.5), 0 0 80px rgba(46, 144, 255, 0.15)",
                }}
              >
                {line.bottom}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
