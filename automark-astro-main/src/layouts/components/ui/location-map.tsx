"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

export interface LocationItem {
  name: string
  coordinates: string
  district?: string
}

export interface LocationMapProps {
  location?: string
  coordinates?: string
  places?: LocationItem[]
  className?: string
  pinColor?: string
}

export const DEFAULT_LOCATIONS: LocationItem[] = [
  { name: "Eravur", coordinates: "7.7767° N, 81.6033° E", district: "Batticaloa District" },
  { name: "Batticaloa", coordinates: "7.7102° N, 81.6924° E", district: "Batticaloa City" },
  { name: "Oddamavadi", coordinates: "7.9220° N, 81.5312° E", district: "Valaichchenai" },
  { name: "Velikanda", coordinates: "7.9167° N, 81.2500° E", district: "Polonnaruwa Border" },
]

export function LocationMap({
  location = "Eravur, Sri Lanka",
  coordinates = "7.7767° N, 81.6033° E",
  places = DEFAULT_LOCATIONS,
  className,
  pinColor = "#38BDF8", // Light blue color
}: LocationMapProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [maxCardWidth, setMaxCardWidth] = useState(380)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        // Leave 32px padding for phone margins (16px on each side)
        const availableWidth = window.innerWidth - 32
        const bounded = Math.min(Math.max(availableWidth, 260), 380)
        setMaxCardWidth(bounded)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const activeLocation = places && places.length > 0 ? places[selectedIdx].name : location
  const activeCoordinates = places && places.length > 0 ? places[selectedIdx].coordinates : coordinates

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle if not clicking interactive location pills inside
    const target = e.target as HTMLElement
    if (target.closest("[data-prevent-expand]")) return
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative cursor-pointer select-none max-w-full w-fit mx-auto", className)}
      style={{
        perspective: 1000,
        maxWidth: "100%",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="bg-card/90 border-border/80 relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-xl max-w-full"
        style={{
          maxWidth: "100%",
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          width: isExpanded ? maxCardWidth : Math.min(maxCardWidth, 260),
          height: isExpanded ? (maxCardWidth < 360 ? 335 : 300) : 150,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
      >
        {/* Subtle light blue / primary gradient overlay */}
        <div className="from-sky-500/10 via-transparent to-primary/10 absolute inset-0 bg-gradient-to-br pointer-events-none" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-body/95 absolute inset-0 rounded-2xl" />

              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
              >
                {/* Main roads in light blue / sky accent */}
                <motion.line
                  x1="0%"
                  y1="35%"
                  x2="100%"
                  y2="35%"
                  className="stroke-sky-400/30"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                <motion.line
                  x1="0%"
                  y1="65%"
                  x2="100%"
                  y2="65%"
                  className="stroke-sky-400/30"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />

                {/* Vertical main roads */}
                <motion.line
                  x1="30%"
                  y1="0%"
                  x2="30%"
                  y2="100%"
                  className="stroke-sky-400/25"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
                <motion.line
                  x1="70%"
                  y1="0%"
                  x2="70%"
                  y2="100%"
                  className="stroke-sky-400/25"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />

                {/* Secondary streets */}
                {[20, 50, 80].map((y, i) => (
                  <motion.line
                    key={`h-${i}`}
                    x1="0%"
                    y1={`${y}%`}
                    x2="100%"
                    y2={`${y}%`}
                    className="stroke-sky-300/15"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line
                    key={`v-${i}`}
                    x1={`${x}%`}
                    y1="0%"
                    x2={`${x}%`}
                    y2="100%"
                    className="stroke-sky-300/15"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  />
                ))}
              </svg>

              {/* Buildings */}
              <motion.div
                className="bg-sky-900/30 border-sky-500/20 absolute top-[40%] left-[10%] h-[20%] w-[15%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
              <motion.div
                className="bg-sky-900/25 border-sky-500/15 absolute top-[15%] left-[35%] h-[15%] w-[12%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              />
              <motion.div
                className="bg-sky-900/28 border-sky-500/18 absolute top-[70%] left-[75%] h-[18%] w-[18%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              />
              <motion.div
                className="bg-sky-900/22 border-sky-500/15 absolute top-[20%] right-[10%] h-[25%] w-[10%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
              />
              <motion.div
                className="bg-sky-900/20 border-sky-500/12 absolute top-[55%] left-[5%] h-[12%] w-[8%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.65 }}
              />
              <motion.div
                className="bg-sky-900/22 border-sky-500/15 absolute top-[8%] left-[75%] h-[10%] w-[14%] rounded-sm border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.75 }}
              />

              {/* Light blue location pin with pulse and glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.3,
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute size-10 rounded-full bg-sky-400/25 animate-ping" />
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-lg relative z-10"
                    style={{
                      filter: `drop-shadow(0 0 14px rgba(56, 189, 248, 0.7))`,
                    }}
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill={pinColor}
                    />
                    <circle cx="12" cy="9" r="2.5" className="fill-body" />
                  </svg>
                </div>
              </motion.div>

              <div className="from-body/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-70" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern - only show when collapsed */}
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          animate={{ opacity: isExpanded ? 0 : 0.04 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern
                id="grid-loc"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  className="stroke-sky-400"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-loc)" />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <motion.div
                className="relative"
                animate={{
                  opacity: isExpanded ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Light Blue Map Icon */}
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-400"
                  animate={{
                    filter: isHovered
                      ? "drop-shadow(0 0 10px rgba(56, 189, 248, 0.75))"
                      : "drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </motion.svg>
              </motion.div>
            </div>

            {/* Status indicator with Light Blue theme */}
            <motion.div
              className="bg-sky-500/10 border border-sky-400/20 flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)] animate-pulse" />
              <span className="text-sky-300 text-[10px] font-semibold tracking-wider uppercase font-primary">
                Local Active
              </span>
            </motion.div>
          </div>

          {/* Bottom section */}
          <div className="space-y-1.5">
            <motion.h3
              className="text-white text-sm sm:text-base font-semibold tracking-tight font-primary flex items-center gap-1.5"
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span>{activeLocation}</span>
              <span className="text-sky-400 text-xs font-normal">· Sri Lanka</span>
            </motion.h3>

            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded-details"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 pt-1"
                >
                  <p className="text-sky-300 font-mono text-[11px] tracking-wide">
                    {activeCoordinates}
                  </p>

                  {/* Multi-location selector pills when expanded */}
                  {places && places.length > 1 && (
                    <div
                      data-prevent-expand="true"
                      className="flex flex-wrap gap-1.5 pt-1 pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {places.map((place, idx) => (
                        <button
                          key={place.name}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedIdx(idx)
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation()
                            setSelectedIdx(idx)
                          }}
                          className={cn(
                            "text-[10px] font-primary font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer touch-manipulation",
                            selectedIdx === idx
                              ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                              : "bg-light/40 border-white/10 text-text-dark hover:border-sky-400/40 hover:text-white",
                          )}
                        >
                          {place.name}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <p className="text-text-dark font-primary text-xs">
                  {places && places.length > 0 ? `${places.length} active service hubs` : "On-site installation"}
                </p>
              )}
            </AnimatePresence>

            {/* Animated light blue underline */}
            <motion.div
              className="h-[2px] bg-gradient-to-r from-sky-400 via-primary to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{
                scaleX: isHovered || isExpanded ? 1 : 0.4,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Click hint */}
      <motion.p
        className="text-sky-300/80 font-primary absolute -bottom-6 left-1/2 text-[10px] tracking-wider uppercase whitespace-nowrap"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          y: isHovered ? 0 : 4,
        }}
        transition={{ duration: 0.2 }}
      >
        Click to explore map
      </motion.p>
    </motion.div>
  )
}

export default LocationMap
