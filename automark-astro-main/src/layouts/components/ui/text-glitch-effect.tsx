"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface TextEffectProps {
  text: string
  hoverText?: string
  href?: string
  className?: string
  baseClassName?: string
  delay?: number
  glitchColor?: string
  glitchTextColor?: string
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "p" | "span"
  autoGlitchOnMount?: boolean
  autoGlitchDelay?: number
  autoGlitchInterval?: number
}

export function TextGlitch({
  text,
  hoverText,
  href,
  className = "",
  baseClassName = "",
  delay = 0,
  glitchColor = "#D4D4D8",
  glitchTextColor = "text-black",
  as = "h1",
  autoGlitchOnMount = false,
  autoGlitchDelay = 1.2,
  autoGlitchInterval = 0,
}: TextEffectProps) {
  const containerRef = useRef<HTMLElement>(null)
  const baseTextRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const [displayHoverText, setDisplayHoverText] = useState(hoverText || text)
  const [isHovered, setIsHovered] = useState(false)
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    setDisplayText(text)
    setDisplayHoverText(hoverText || text)
  }, [text, hoverText])

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null
    let isMounted = true

    const loadGSAP = async () => {
      const { gsap } = await import("gsap")

      if (!isMounted || !baseTextRef.current) return

      gsap.set(baseTextRef.current, {
        backgroundSize: "0% 100%",
        scale: 0.95,
        opacity: 0.7,
      })

      tl = gsap.timeline({ delay: delay })

      tl.to(baseTextRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }).to(
        baseTextRef.current,
        {
          backgroundSize: "100% 100%",
          duration: 2,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.3",
      )
    }

    loadGSAP()

    return () => {
      isMounted = false
      if (tl) tl.kill()
    }
  }, [delay])

  const triggerGlitch = () => {
    setIsHovered(true)
    const targetHover = hoverText || text
    if (targetHover) {
      let iteration = 0

      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
      }

      hoverIntervalRef.current = setInterval(() => {
        setDisplayHoverText(
          targetHover
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return targetHover[index]
              }
              if (letter === " ") {
                return " "
              }
              if (letter === "." || letter === "!" || letter === "?" || letter === "-" || letter === "&") {
                return letter
              }
              return letters[Math.floor(Math.random() * letters.length)]
            })
            .join(""),
        )

        if (iteration >= targetHover.length) {
          if (hoverIntervalRef.current) {
            clearInterval(hoverIntervalRef.current)
          }
        }

        iteration += 1 / 3
      }, 30)
    }
  }

  const stopGlitch = () => {
    setIsHovered(false)
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current)
    }
    setDisplayHoverText(hoverText || text)
  }

  const handleMouseEnter = () => {
    triggerGlitch()
  }

  const handleMouseLeave = () => {
    stopGlitch()
  }

  const handleClick = (_e?: React.MouseEvent | React.TouchEvent) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    triggerGlitch()
    clickTimeoutRef.current = setTimeout(() => {
      stopGlitch()
    }, 1800)
  }

  // Auto-trigger glitch showcase for mobile / viewports without hover
  useEffect(() => {
    if (!autoGlitchOnMount) return
    const initialTimer = setTimeout(() => {
      handleClick()
    }, autoGlitchDelay * 1000)

    let intervalTimer: ReturnType<typeof setInterval> | null = null
    if (autoGlitchInterval && autoGlitchInterval > 0) {
      intervalTimer = setInterval(() => {
        handleClick()
      }, autoGlitchInterval * 1000)
    }

    return () => {
      clearTimeout(initialTimer)
      if (intervalTimer) clearInterval(intervalTimer)
    }
  }, [autoGlitchOnMount, autoGlitchDelay, autoGlitchInterval])

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const spanContent = (hoverText || text) ? (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" className="no-underline text-inherit block w-full">
        {displayHoverText}
      </a>
    ) : (
      displayHoverText
    )
  ) : (
    text
  )

  const Tag = as as any

  return (
    <Tag
      ref={containerRef}
      className={cn(
        "text-[10vw] font-bold leading-none tracking-tight m-0",
        "border-b border-neutral-600/30",
        "flex flex-col items-start justify-center relative",
        "transition-all duration-500 ease-out",
        "cursor-pointer select-none touch-manipulation",
        "overflow-hidden",
        className,
      )}
      style={{
        width: "100%",
        maxWidth: "100%",
        wordBreak: "break-word",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <span
        ref={baseTextRef}
        className={cn(
          "w-full bg-clip-text bg-no-repeat inline-block",
          baseClassName || "text-neutral-400/30 bg-gradient-to-r from-white via-neutral-100 to-neutral-400",
        )}
        style={{
          backgroundSize: "100% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {displayText}
      </span>

      {isHovered && (
        <span
          className={cn(
            "absolute inset-0 w-full h-full",
            glitchTextColor,
            "font-bold flex flex-col justify-center px-1 z-10",
            "transition-all duration-200 ease-out",
            "pointer-events-none overflow-hidden",
          )}
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            WebkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            transformOrigin: "center",
            backgroundColor: glitchColor,
            maxWidth: "100%",
            whiteSpace: "nowrap",
            color: glitchTextColor === "text-black" ? "#000000" : undefined,
          }}
        >
          <span className="w-full">{spanContent}</span>
        </span>
      )}
    </Tag>
  )
}
