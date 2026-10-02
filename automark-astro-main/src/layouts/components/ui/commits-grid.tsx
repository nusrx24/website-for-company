"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export interface CommitsGridProps {
  text: string;
  colors?: string[];
  className?: string;
  cellSizeClassName?: string;
}

// Brand neon blue palette tailored for LapCircuit dark aesthetic
const DEFAULT_BRAND_COLORS = [
  "#2E90FF", // LapCircuit Primary Neon Blue
  "#00E5FF", // Cyber Cyan
  "#5AABFF", // Electric Sky Blue
  "#1268D8", // Deep Royal Blue
  "#38BDF8", // Vivid Light Blue
];

export const CommitsGrid = ({
  text,
  colors = DEFAULT_BRAND_COLORS,
  className,
  cellSizeClassName,
}: CommitsGridProps) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cleanString = (str: string): string => {
    const upperStr = str.toUpperCase();
    const withoutAccents = upperStr
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const allowedChars = Object.keys(letterPatterns);
    return withoutAccents
      .split("")
      .filter((char) => allowedChars.includes(char))
      .join("");
  };

  const generateHighlightedCells = (inputText: string) => {
    const cleanedText = cleanString(inputText);
    const width = Math.max(cleanedText.length * 6, 6) + 1;
    let currentPosition = 1;
    const highlightedCells: number[] = [];

    cleanedText
      .toUpperCase()
      .split("")
      .forEach((char) => {
        if (letterPatterns[char]) {
          const pattern = letterPatterns[char].map((pos) => {
            const row = Math.floor(pos / 50);
            const col = pos % 50;
            return (row + 1) * width + col + currentPosition;
          });
          highlightedCells.push(...pattern);
        }
        currentPosition += 6;
      });

    return {
      cells: highlightedCells,
      width,
      height: 9,
    };
  };

  const {
    cells: highlightedCells,
    width: gridWidth,
    height: gridHeight,
  } = React.useMemo(() => generateHighlightedCells(text), [text]);

  const totalCells = gridWidth * gridHeight;

  // Staggered column-based delay for a sweep wave animation across the letters,
  // plus randomized continuous twinkling for background cells
  const cellData = React.useMemo(() => {
    return Array.from({ length: totalCells }).map((_, index) => {
      const isHighlighted = highlightedCells.includes(index);
      const col = index % gridWidth;
      const pseudoRandom = ((index * 9301 + 49297) % 233280) / 233280;
      const shouldFlash = !isHighlighted && pseudoRandom < 0.28;
      const colorIndex = Math.floor(pseudoRandom * colors.length) % colors.length;
      
      // Sweep delay: left-to-right cascade (0ms to ~600ms)
      const sweepDelay = `${(col * 0.032 + (pseudoRandom * 0.08)).toFixed(3)}s`;
      // Twinkle delay: ongoing staggered periodic flash
      const flashDelay = `${(pseudoRandom * 3.5).toFixed(2)}s`;
      const flashDuration = `${(2.8 + pseudoRandom * 2.2).toFixed(2)}s`;

      return {
        isHighlighted,
        shouldFlash,
        color: colors[colorIndex] || colors[0],
        sweepDelay,
        flashDelay,
        flashDuration,
      };
    });
  }, [totalCells, gridWidth, highlightedCells, colors]);

  return (
    <>
      <style>{`
        @keyframes commitWaveIn {
          0% {
            opacity: 0.1;
            transform: scale(0.6);
            background-color: transparent;
            box-shadow: none;
          }
          65% {
            opacity: 1;
            transform: scale(1.15);
            background-color: var(--highlight);
            box-shadow: 0 0 12px var(--highlight);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            background-color: var(--highlight);
            box-shadow: 0 0 5px var(--highlight);
          }
        }

        @keyframes commitLivePulse {
          0%, 100% {
            opacity: 0.88;
            filter: brightness(1);
            box-shadow: 0 0 4px var(--highlight);
          }
          50% {
            opacity: 1;
            filter: brightness(1.35);
            box-shadow: 0 0 12px var(--highlight), 0 0 20px var(--highlight);
          }
        }

        @keyframes commitTwinkle {
          0%, 100% {
            background-color: transparent;
            opacity: 0.15;
            box-shadow: none;
          }
          50% {
            background-color: var(--highlight);
            opacity: 0.95;
            box-shadow: 0 0 8px var(--highlight);
          }
        }

        .commit-cell--highlighted {
          animation: commitWaveIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) var(--sweep-delay, 0s) forwards,
                     commitLivePulse 3s ease-in-out calc(var(--sweep-delay, 0s) + 0.5s) infinite;
        }

        .commit-cell--twinkle {
          animation: commitTwinkle var(--flash-duration, 3.5s) ease-in-out var(--flash-delay, 0s) infinite;
        }
      `}</style>

      <section
        className={cn(
          "w-full max-w-full bg-transparent border border-primary/20 grid p-1.5 sm:p-2.5 gap-[2px] sm:gap-[3px] rounded-xl overflow-hidden",
          className
        )}
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
        }}
        aria-label={`Commits matrix showing: ${text}`}
      >
        {cellData.map((cell, index) => {
          return (
            <div
              key={index}
              className={cn(
                "h-full w-full aspect-square rounded-[2px] transition-all duration-300",
                cell.isHighlighted
                  ? "border border-white/20 commit-cell--highlighted"
                  : cell.shouldFlash
                  ? "border border-white/10 commit-cell--twinkle"
                  : "border border-white/[0.08] bg-white/[0.02] hover:bg-primary/25 hover:border-primary/50",
                cellSizeClassName
              )}
              style={
                {
                  "--highlight": cell.color,
                  "--sweep-delay": cell.sweepDelay,
                  "--flash-delay": cell.flashDelay,
                  "--flash-duration": cell.flashDuration,
                  backgroundColor: !mounted && cell.isHighlighted ? cell.color : undefined,
                } as CSSProperties
              }
            />
          );
        })}
      </section>
    </>
  );
};

export const letterPatterns: { [key: string]: number[] } = {
  A: [
    1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152,
    153,
  ],
  B: [
    0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54,
    104, 152, 153, 204, 254, 303,
  ],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [
    0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254,
    303,
  ],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [
    0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 204, 154,
    304, 254,
  ],
  H: [
    0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254,
    304,
  ],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 302, 300, 301],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304,
  ],
  N: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  Ñ: [
    0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204,
    254, 304,
  ],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [
    1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 204, 202, 253, 304,
  ],
  R: [
    0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254,
    304,
  ],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [
    0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254,
    303,
  ],
  X: [0, 50, 203, 254, 304, 4, 54, 152, 101, 103, 201, 250, 300],
  Y: [0, 50, 101, 152, 202, 252, 302, 4, 54, 103],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  "0": [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  "1": [1, 52, 102, 152, 202, 252, 302, 0, 2, 300, 301, 302, 303, 304],
  "2": [0, 1, 2, 3, 54, 104, 152, 153, 201, 250, 300, 301, 302, 303, 304],
  "3": [0, 1, 2, 3, 54, 104, 152, 153, 204, 254, 300, 301, 302, 303],
  "4": [0, 50, 100, 150, 4, 54, 104, 151, 152, 153, 154, 204, 254, 304],
  "5": [0, 1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  "6": [
    1, 2, 3, 50, 100, 150, 151, 152, 153, 200, 250, 301, 302, 204, 254, 303,
  ],
  "7": [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300],
  "8": [
    1, 2, 3, 50, 100, 151, 152, 153, 200, 250, 301, 302, 303, 54, 104, 204, 254,
  ],
  "9": [1, 2, 3, 50, 100, 151, 152, 153, 154, 204, 254, 304, 54, 104],
  " ": [],
};

export default CommitsGrid;
