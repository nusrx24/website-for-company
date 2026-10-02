"use client"

import React from "react"
import { TextGlitch } from "@/components/ui/text-glitch-effect"
import { cn } from "@/lib/utils"

interface HeroGlitchHeadlineProps {
  className?: string
}

export function HeroGlitchHeadline({ className = "" }: HeroGlitchHeadlineProps) {
  return (
    <div className={cn("w-full flex flex-col items-start justify-center gap-2 sm:gap-3 py-2 select-none", className)}>
      <TextGlitch
        text="YOUR BUSINESS."
        hoverText="YOUR WORKFLOW."
        delay={0.1}
        as="h1"
        className="text-[clamp(1.75rem,7.5vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.35rem] 2xl:text-[3.75rem] font-black font-secondary tracking-tight border-b-2 border-white/15 pb-1"
        baseClassName="text-white/40 bg-gradient-to-r from-white via-neutral-100 to-neutral-400"
        glitchColor="#D4D4D8"
        glitchTextColor="text-black"
        autoGlitchOnMount={true}
        autoGlitchDelay={1.2}
        autoGlitchInterval={9.0}
      />
      <TextGlitch
        text="YOUR POS."
        hoverText="OFFLINE + CLOUD."
        delay={0.25}
        as="div"
        className="text-[clamp(1.75rem,7.5vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.35rem] 2xl:text-[3.75rem] font-black font-secondary tracking-tight border-b-2 border-primary/30 pb-1"
        baseClassName="text-primary/50 bg-gradient-to-r from-primary via-cyan-200 to-white"
        glitchColor="#D4D4D8"
        glitchTextColor="text-black"
        autoGlitchOnMount={true}
        autoGlitchDelay={2.4}
        autoGlitchInterval={9.0}
      />
      <TextGlitch
        text="YOUR WAY."
        hoverText="BUILT FOR YOU."
        delay={0.4}
        as="div"
        className="text-[clamp(1.75rem,7.5vw,2.5rem)] sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[3.35rem] 2xl:text-[3.75rem] font-black font-secondary tracking-tight border-b-2 border-white/15 pb-1"
        baseClassName="text-white/40 bg-gradient-to-r from-white via-neutral-100 to-neutral-400"
        glitchColor="#D4D4D8"
        glitchTextColor="text-black"
        autoGlitchOnMount={true}
        autoGlitchDelay={3.6}
        autoGlitchInterval={9.0}
      />
    </div>
  )
}

export default HeroGlitchHeadline
