"use client";

import React, { useEffect, useState } from "react";
import PixelFlowField from "@/components/ui/pixel-flow-field";

/**
 * The warranty promise acted out: restless pixels pull together into FIXED.
 * A click or tap scatters them again (a new bug) and they re-form (the fix).
 */
export default function WarrantyField() {
  const [scatter, setScatter] = useState(0);
  // A phone-width panel has too few columns for the I and X at the desktop
  // cell size, so small screens get a finer grid.
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      onClick={() => setScatter((n) => n + 1)}
      className="h-full w-full cursor-pointer select-none"
    >
      <PixelFlowField
        // Plus Jakarta ExtraBold rather than Clash Display: the word is fitted to
        // the panel's width, and a narrower face comes out taller, so thin
        // strokes like the I survive at pixel resolution.
        className="h-full w-full font-primary"
        text="FIXED"
        weight={800}
        shape="square"
        cellSize={fine ? 2.6 : 4}
        gap={fine ? 1.4 : 2}
        pointerRadius={110}
        scatter={scatter}
        colors={["#5E6B7D", "#2E90FF", "#EEF2F8"]}
      />
    </div>
  );
}
