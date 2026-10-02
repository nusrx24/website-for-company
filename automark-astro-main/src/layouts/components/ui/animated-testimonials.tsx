"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Adapted from the 21st.dev "animated testimonials" card stack for the
// LapCircuit team: a plain <img> instead of next/image, lucide icons, a fixed
// tilt per card (random tilts re-rolled on every render and differed between
// server and browser), a monogram card when no photo is set, and the site's
// own colours and type.

export type TeamCard = {
  name: string;
  role: string;
  /** A plain description of the role. Not a quote. */
  line?: string;
  /** Path under public/, e.g. /images/team/nusair.webp. */
  photo?: string;
};

const TILTS = [-6, 5, -3, 7, -8, 4];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

function Monogram({ name }: { name: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border"
      style={{
        background:
          "radial-gradient(120% 90% at 20% 10%, rgba(46,144,255,0.28) 0%, rgba(46,144,255,0) 55%), linear-gradient(160deg, #1a2433 0%, #0b1119 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#EEF2F8 1px, transparent 1px), linear-gradient(to right, #EEF2F8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <span className="relative font-secondary text-7xl font-bold tracking-tight text-text-light/90 sm:text-8xl">
        {initials(name)}
      </span>
    </div>
  );
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: TeamCard[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const count = testimonials.length;

  const handleNext = () => setActive((prev) => (prev + 1) % count);
  const handlePrev = () => setActive((prev) => (prev - 1 + count) % count);
  const isActive = (index: number) => index === active;
  const tilt = (index: number) => TILTS[index % TILTS.length];

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, reduceMotion, count]);

  const current = testimonials[active];

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-10">
        {/* The stack. 4:5 to match the portrait crops in public/images/team. */}
        <div className="relative mx-auto lg:ml-auto lg:mr-0 aspect-[4/5] w-full max-w-[17rem] sm:max-w-[19rem]">
          <AnimatePresence>
            {testimonials.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, scale: 0.9, z: -100, rotate: tilt(index) }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : tilt(index),
                  zIndex: isActive(index) ? 10 : count + 2 - index,
                  y: isActive(index) && !reduceMotion ? [0, -60, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, z: 100, rotate: tilt(index) }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
                aria-hidden={isActive(index) ? undefined : true}
              >
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    width={800}
                    height={1000}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-3xl border border-border object-cover object-top"
                  />
                ) : (
                  <Monogram name={person.name} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Name, role and the line about what they do */}
        <div className="flex flex-col justify-between">
          <motion.div
            key={active}
            aria-live="polite"
            initial={{ y: reduceMotion ? 0 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="font-secondary text-2xl font-bold uppercase leading-tight text-text-light">
              {current.name}
            </h3>
            <p className="mt-1 font-primary text-sm text-primary">{current.role}</p>
            {current.line && (
              <p className="mt-5 max-w-md font-primary text-base leading-relaxed text-text">
                {current.line.split(" ").map((word, index) => (
                  <motion.span
                    key={`${active}-${index}`}
                    initial={reduceMotion ? false : { filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
            )}
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous team member"
                className="group/button flex size-10 items-center justify-center rounded-full border border-border bg-light text-text-light transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                <ArrowLeft className="size-5 transition-transform duration-300 group-hover/button:rotate-12" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next team member"
                className="group/button flex size-10 items-center justify-center rounded-full border border-border bg-light text-text-light transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                <ArrowRight className="size-5 transition-transform duration-300 group-hover/button:-rotate-12" />
              </button>
            </div>

            {/* Everyone is listed, so no one needs a click to know who is on the team. */}
            <ul className="flex flex-wrap gap-x-4 gap-y-1 font-primary text-[13px]">
              {testimonials.map((person, index) => (
                <li key={person.name}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={isActive(index) ? "true" : undefined}
                    className={cn(
                      "rounded py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light",
                      isActive(index) ? "text-text-light" : "text-text-dark hover:text-text-light",
                    )}
                  >
                    {person.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;
