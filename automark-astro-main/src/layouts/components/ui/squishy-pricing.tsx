"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ExternalLink } from "lucide-react";

export interface PricingCardProps {
  label: string;
  monthlyPrice: string;
  pricePrefix?: string;
  period?: string;
  description: string;
  cta: string;
  background: string;
  BGComponent: React.ComponentType<{ className?: string }>;
  badge?: string;
  features?: string[];
  href?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  label,
  monthlyPrice,
  pricePrefix = "$",
  period = "Month",
  description,
  cta,
  background,
  BGComponent,
  badge,
  features,
  href,
  onCtaClick,
  className = "",
}) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
      }}
      transition={{ duration: 0.8, ease: "backInOut" }}
      className={`relative min-h-[440px] w-80 shrink-0 overflow-hidden rounded-2xl p-7 ${background} shadow-2xl hover:shadow-[0_15px_40px_rgba(46,144,255,0.25)] transition-all duration-300 flex flex-col justify-between border-2 border-white/30 hover:border-white/70 shine-border ${className}`}
    >
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="block w-fit rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-white border border-white/30 uppercase tracking-wider">
            {label}
          </span>
          {badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white text-neutral-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="size-3 text-amber-500 fill-amber-500" />
              {badge}
            </span>
          )}
        </div>

        <motion.span
          initial="initial"
          variants={{
            initial: { scale: 0.85 },
            hover: { scale: 1 },
          }}
          transition={{ duration: 0.8, ease: "backInOut" }}
          className="my-3 block origin-top-left font-mono text-4xl sm:text-5xl font-black leading-[1.15] text-white drop-shadow-sm tracking-tight"
        >
          {pricePrefix}{monthlyPrice}
          {period ? (
            <>
              <br />
              <span className="text-xl sm:text-2xl font-bold opacity-90 tracking-normal font-sans">
                /{period}
              </span>
            </>
          ) : null}
        </motion.span>

        <p className="text-sm text-white/95 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="space-y-1.5 pt-3 border-t border-white/20 text-xs text-white/90">
            {features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0 stroke-[2.5]" />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative z-20 pt-6">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCtaClick}
            className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-white bg-white py-2.5 text-center font-mono font-black text-xs uppercase tracking-wider text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span>{cta}</span>
            <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={onCtaClick}
            className="block w-full rounded-xl border-2 border-white bg-white py-2.5 text-center font-mono font-black text-xs uppercase tracking-wider text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {cta}
          </button>
        )}
      </div>

      <BGComponent />
    </motion.div>
  );
};

export const BGComponent1 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial="initial"
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.5 },
    }}
    transition={{ duration: 0.8, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none w-full h-full"
  >
    <motion.circle
      initial="initial"
      variants={{
        initial: { scaleY: 1, y: 0 },
        hover: { scaleY: 0.5, y: -25 },
      }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.15 }}
      cx="160.5"
      cy="114.5"
      r="101.5"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
    />
    <motion.ellipse
      initial="initial"
      variants={{
        initial: { scaleY: 1, y: 0 },
        hover: { scaleY: 2.25, y: -25 },
      }}
      transition={{ duration: 0.8, ease: "backInOut", delay: 0.15 }}
      cx="160.5"
      cy="265.5"
      rx="101.5"
      ry="43.5"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
    />
  </motion.svg>
);

export const BGComponent2 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial="initial"
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.05 },
    }}
    transition={{ duration: 0.8, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none w-full h-full"
  >
    <motion.rect
      x="14"
      width="153"
      height="153"
      rx="15"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
      initial="initial"
      variants={{
        initial: { y: 12, rotate: 0, scaleX: 1 },
        hover: { y: 219, rotate: 90, scaleX: 2 },
      }}
      transition={{ delay: 0.15, duration: 0.8, ease: "backInOut" }}
    />
    <motion.rect
      x="155"
      width="153"
      height="153"
      rx="15"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
      initial="initial"
      variants={{
        initial: { y: 219, rotate: 0, scaleX: 1 },
        hover: { y: 12, rotate: 90, scaleX: 2 },
      }}
      transition={{ delay: 0.15, duration: 0.8, ease: "backInOut" }}
    />
  </motion.svg>
);

export const BGComponent3 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial="initial"
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.25 },
    }}
    transition={{ duration: 0.8, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none w-full h-full"
  >
    <motion.path
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -50 },
      }}
      transition={{ delay: 0.25, duration: 0.8, ease: "backInOut" }}
      d="M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
    />
    <motion.path
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -50 },
      }}
      transition={{ delay: 0.15, duration: 0.8, ease: "backInOut" }}
      d="M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
    />
    <motion.path
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -50 },
      }}
      transition={{ delay: 0.08, duration: 0.8, ease: "backInOut" }}
      d="M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
    />
  </motion.svg>
);

export const BGComponent4 = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial="initial"
    variants={{
      initial: { scale: 1 },
      hover: { scale: 1.3 },
    }}
    transition={{ duration: 0.8, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none w-full h-full"
  >
    <motion.polygon
      points="160,30 280,140 230,290 90,290 40,140"
      fill="rgba(0, 0, 0, 0.25)"
      className="dark:fill-white/15"
      initial="initial"
      variants={{
        initial: { rotate: 0, scale: 1 },
        hover: { rotate: 72, scale: 1.1 },
      }}
      transition={{ delay: 0.15, duration: 0.8, ease: "backInOut" }}
    />
    <motion.circle
      cx="160"
      cy="160"
      r="60"
      fill="rgba(0, 0, 0, 0.2)"
      className="dark:fill-white/15"
      initial="initial"
      variants={{
        initial: { scale: 1, y: 0 },
        hover: { scale: 1.35, y: 15 },
      }}
      transition={{ delay: 0.1, duration: 0.8, ease: "backInOut" }}
    />
  </motion.svg>
);

export interface SquishyPricingProps {
  cards?: PricingCardProps[];
  className?: string;
  sectionClassName?: string;
}

export const Component: React.FC<SquishyPricingProps> = ({
  cards,
  className = "",
  sectionClassName = "bg-background px-4 py-12 transition-colors",
}) => {
  const defaultCards: PricingCardProps[] = [
    {
      label: "Individual",
      monthlyPrice: "299",
      description: "For individuals who want to understand why their landing pages aren't working",
      cta: "Sign up",
      background: "bg-indigo-500 dark:bg-indigo-600",
      BGComponent: BGComponent1,
    },
    {
      label: "Company",
      monthlyPrice: "999",
      description: "For mid-sized companies who are serious about boosting their revenue by 30%",
      cta: "Sign up",
      background: "bg-purple-500 dark:bg-purple-600",
      BGComponent: BGComponent2,
    },
    {
      label: "Enterprise",
      monthlyPrice: "4,999",
      description: "For large enterprises looking to outsource their conversion rate optimization",
      cta: "Book a call",
      background: "bg-pink-500 dark:bg-pink-600",
      BGComponent: BGComponent3,
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <section className={sectionClassName}>
      <div className={`mx-auto flex w-fit flex-wrap justify-center gap-6 ${className}`}>
        {displayCards.map((card, idx) => (
          <PricingCard key={card.label || idx} {...card} />
        ))}
      </div>
    </section>
  );
};

export default Component;
