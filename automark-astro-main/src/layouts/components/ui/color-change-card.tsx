"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

/* ─── Card data for LapCircuit benefits ──────────────────────────── */
export interface BenefitCardData {
  kicker: string;
  heading: string;
  description: string;
  imgSrc: string;
}

const defaultBenefits: BenefitCardData[] = [
  {
    kicker: "At the counter",
    heading: "Billing without the calculator",
    description:
      "Scan or tap a product and the bill totals itself — no handwritten invoice, no adding up by hand while a customer waits.",
    imgSrc: "/images/benefits-checkout.jpg",
  },
  {
    kicker: "Behind the counter",
    heading: "Stock that updates itself",
    description:
      "The same sale takes those items out of stock as it happens, and a low stock alert tells you what needs reordering.",
    imgSrc: "/images/benefits-stock.jpg",
  },
  {
    kicker: "End of the day",
    heading: "The day's numbers, ready",
    description:
      "Sales, purchases and net profit for any date range. Payments, credit customers and cheques are all recorded.",
    imgSrc: "/images/benefits-report.jpg",
  },
  {
    kicker: "For the customer",
    heading: "Bills printed in your name",
    description:
      "Customized bill printing on an 80 mm thermal printer, carrying your own shop's name and layout.",
    imgSrc: "/images/benefits-receipt.jpg",
  },
];

/* ─── Main export ───────────────────────────────────────────────── */
export interface ColorChangeCardsProps {
  benefits?: BenefitCardData[];
}

const ColorChangeCards = ({
  benefits = defaultBenefits,
}: ColorChangeCardsProps) => {
  return (
    <div className="w-full px-4 py-6 md:px-8 md:py-0">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {benefits.map((b, i) => (
          <Card
            key={i}
            kicker={b.kicker}
            heading={b.heading}
            description={b.description}
            imgSrc={b.imgSrc}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Single Card ───────────────────────────────────────────────── */
interface CardProps {
  kicker: string;
  heading: string;
  description: string;
  imgSrc: string;
}

const cardVariants: Variants = {
  rest: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  active: { transition: { staggerChildren: 0.035 } },
};

// Touch screens have no hover, so there the card activates while it crosses
// the middle band of the viewport instead.
const useIsTouch = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);
  return isTouch;
};

const Card = ({ kicker, heading, description, imgSrc }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const inCenter = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const [hovered, setHovered] = useState(false);
  const active = isTouch ? inCenter : hovered;

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="rest"
      animate={active ? "active" : "rest"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative h-72 w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0F16] md:h-80 shine-border ${active ? "is-active" : ""}`}
    >
      {/* Background image — desaturated at rest, vivid when active */}
      <div
        className="absolute inset-0 saturate-[0.35] transition-all duration-700 ease-out group-[.is-active]:scale-110 group-[.is-active]:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030508]/95 via-[#030508]/60 to-[#030508]/20 transition-opacity duration-500 group-[.is-active]:from-[#030508]/85 group-[.is-active]:via-[#030508]/45 group-[.is-active]:to-transparent" />

      {/* Content layer */}
      <div className="relative z-20 flex h-full flex-col justify-between p-5 md:p-6">
        {/* Top: kicker label. No arrow: the card is not a link. */}
        <div className="flex items-center">
          <span className="inline-block rounded-full border border-[#2E90FF]/30 bg-[#2E90FF]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E90FF] backdrop-blur-sm transition-all duration-500 group-[.is-active]:border-[#2E90FF]/50 group-[.is-active]:bg-[#2E90FF]/20 group-[.is-active]:shadow-[0_0_12px_rgba(46,144,255,0.15)]">
            {kicker}
          </span>        </div>

        {/* Bottom: title with letter animation + description */}
        <div className="space-y-2.5">
          <h4 aria-label={heading} className="text-[22px] leading-[1.2] md:text-[26px]">
            {heading.split(" ").map((word, w) => (
              <React.Fragment key={w}>
                {w > 0 && " "}
                <span aria-hidden="true" className="inline-block whitespace-nowrap">
                  {word.split("").map((letter, index) => (
                    <AnimatedLetter letter={letter} key={index} />
                  ))}
                </span>
              </React.Fragment>
            ))}
          </h4>
          <p className="text-sm leading-relaxed text-slate-300 transition-colors duration-500 group-[.is-active]:text-slate-100 md:text-[13px]">
            {description}
          </p>
        </div>
      </div>

      {/* Hover glow border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#2E90FF]/0 transition-all duration-500 group-[.is-active]:border-[#2E90FF]/30 group-[.is-active]:shadow-[inset_0_0_40px_rgba(46,144,255,0.06)]" />
    </motion.div>
  );
};

/* ─── Letter animation helper ───────────────────────────────────── */
interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  rest: { y: "0%" },
  active: { y: "-50%" },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  const reduceMotion = useReducedMotion();
  return (
    <span className="inline-block h-[1.15em] overflow-hidden align-top leading-[1.15] font-bold uppercase tracking-tight text-white">
      <motion.span
        className="flex flex-col"
        variants={reduceMotion ? undefined : letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter}</span>
        <span className="text-[#2E90FF]">{letter}</span>
      </motion.span>
    </span>
  );
};

export default ColorChangeCards;
