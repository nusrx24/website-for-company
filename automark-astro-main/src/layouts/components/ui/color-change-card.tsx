"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

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

const Card = ({ kicker, heading, description, imgSrc }: CardProps) => {
  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      className="group relative h-72 w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0F16] md:h-80"
    >
      {/* Background image — desaturated at rest, vivid on hover */}
      <div
        className="absolute inset-0 saturate-100 transition-all duration-700 ease-out group-hover:scale-110 md:saturate-[0.25] md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030508]/95 via-[#030508]/60 to-[#030508]/20 transition-opacity duration-500 group-hover:from-[#030508]/80 group-hover:via-[#030508]/40 group-hover:to-transparent" />

      {/* Content layer */}
      <div className="relative z-20 flex h-full flex-col justify-between p-5 md:p-6">
        {/* Top: kicker label + arrow */}
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full border border-[#2E90FF]/30 bg-[#2E90FF]/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E90FF] backdrop-blur-sm transition-all duration-500 group-hover:border-[#2E90FF]/50 group-hover:bg-[#2E90FF]/20 group-hover:shadow-[0_0_12px_rgba(46,144,255,0.15)]">
            {kicker}
          </span>
          <FiArrowRight className="text-2xl text-white/40 transition-all duration-500 group-hover:-rotate-45 group-hover:text-[#2E90FF]" />
        </div>

        {/* Bottom: title with letter animation + description */}
        <div className="space-y-2.5">
          <h4 className="leading-tight">
            {heading.split("").map((letter, index) => (
              <AnimatedLetter letter={letter} key={index} />
            ))}
          </h4>
          <p className="text-sm leading-relaxed text-slate-400 transition-colors duration-500 group-hover:text-slate-200 md:text-[13px]">
            {description}
          </p>
        </div>
      </div>

      {/* Hover glow border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#2E90FF]/0 transition-all duration-500 group-hover:border-[#2E90FF]/20 group-hover:shadow-[inset_0_0_40px_rgba(46,144,255,0.04)]" />
    </motion.div>
  );
};

/* ─── Letter animation helper ───────────────────────────────────── */
interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: {
    y: "-50%",
  },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div className="inline-block h-[32px] overflow-hidden text-[22px] font-bold uppercase tracking-tight text-white md:h-[38px] md:text-[26px]">
      <motion.span
        className="flex min-w-[4px] flex-col"
        style={{ y: "0%" }}
        variants={letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter}</span>
        <span className="text-[#2E90FF]">{letter}</span>
      </motion.span>
    </div>
  );
};

export default ColorChangeCards;
