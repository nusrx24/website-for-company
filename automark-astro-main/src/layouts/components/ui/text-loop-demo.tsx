"use client";

import React from "react";
import TextLoop from "@/components/ui/text-loop";

export function TextLoopDemo() {
  return (
    <div className="flex min-h-[250px] w-full items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/10">
      <TextLoop
        staticText="Software & Hardware."
        rotatingTexts={["Ready to run.", "Counter ready.", "Plug & play.", "Zero downtime."]}
      />
    </div>
  );
}

export default TextLoopDemo;
