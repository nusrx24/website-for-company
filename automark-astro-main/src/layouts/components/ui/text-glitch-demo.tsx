"use client"

import React from "react"
import { TextGlitch } from "@/components/ui/text-glitch-effect"

export default function DemoGlitch() {
  return (
    <main className="h-screen overflow-hidden flex items-center justify-center bg-black">
      <div className="container max-w-4xl mx-auto px-4">
        <TextGlitch text="TEXT FLOW" hoverText="DYNAMIC TEXT" delay={0} />
        <TextGlitch text="HOVER ME" hoverText="FIND ME" href="https://lab.xubh.top/" delay={0.2} />
      </div>
    </main>
  )
}
