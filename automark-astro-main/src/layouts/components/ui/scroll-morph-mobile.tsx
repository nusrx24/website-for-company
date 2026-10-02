"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  RotateCw,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
} from "lucide-react";
import { LAPCIRCUIT_ACHIEVEMENTS, type ProjectAchievement } from "./scroll-morph-projects";
import { whatsappUrl } from "@/lib/utils/contact";

interface ScrollMorphMobileProps {
  onSwitchTo3D?: () => void;
}

export default function ScrollMorphMobile({ onSwitchTo3D }: ScrollMorphMobileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectAchievement | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const filmstripRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleOpenPhoto = (item: ProjectAchievement) => {
    if (isDraggingRef.current) return;
    setSelectedPhoto(item);
  };

  // Sector filter categorizer
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return LAPCIRCUIT_ACHIEVEMENTS;
    if (activeFilter === "grocery") {
      return LAPCIRCUIT_ACHIEVEMENTS.filter((p) =>
        p.sector.toLowerCase().includes("grocery") ||
        p.sector.toLowerCase().includes("supermarket") ||
        p.title.toLowerCase().includes("sku")
      );
    }
    if (activeFilter === "wholesale") {
      return LAPCIRCUIT_ACHIEVEMENTS.filter((p) =>
        p.sector.toLowerCase().includes("wholesale") ||
        p.sector.toLowerCase().includes("distribution") ||
        p.title.toLowerCase().includes("cheque")
      );
    }
    if (activeFilter === "mobile") {
      return LAPCIRCUIT_ACHIEVEMENTS.filter((p) =>
        p.sector.toLowerCase().includes("mobile") ||
        p.sector.toLowerCase().includes("tech") ||
        p.title.toLowerCase().includes("accessories")
      );
    }
    if (activeFilter === "hardware") {
      return LAPCIRCUIT_ACHIEVEMENTS.filter((p) =>
        p.sector.toLowerCase().includes("hardware") ||
        p.sector.toLowerCase().includes("deployment") ||
        p.tag.toLowerCase().includes("hardware") ||
        p.tag.toLowerCase().includes("training")
      );
    }
    return LAPCIRCUIT_ACHIEVEMENTS;
  }, [activeFilter]);

  // Ensure current index is within bounds of filtered items
  const safeIndex = Math.min(currentIndex, Math.max(0, filteredItems.length - 1));
  const activeItem = filteredItems[safeIndex] || LAPCIRCUIT_ACHIEVEMENTS[0];

  const handleNext = () => {
    setIsFlipped(false);
    const nextIdx = (safeIndex + 1) % filteredItems.length;
    setCurrentIndex(nextIdx);
    scrollThumbnailIntoView(nextIdx);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    const prevIdx = (safeIndex - 1 + filteredItems.length) % filteredItems.length;
    setCurrentIndex(prevIdx);
    scrollThumbnailIntoView(prevIdx);
  };

  const handleSelectIndex = (idx: number) => {
    setIsFlipped(false);
    setCurrentIndex(idx);
    scrollThumbnailIntoView(idx);
  };

  const scrollThumbnailIntoView = (idx: number) => {
    if (!filmstripRef.current) return;
    const thumbWidth = 72; // 64px width + 8px gap
    filmstripRef.current.scrollTo({
      left: Math.max(0, idx * thumbWidth - 100),
      behavior: "smooth",
    });
  };

  // WhatsApp link tailored to currently displayed client
  const waUrl = whatsappUrl(
    `Hello LapCircuit, I saw the deployment photo for ${activeItem.client} (${activeItem.title}) on your website and would like a live demo for my business.`,
  );

  return (
    <div className="relative w-full bg-[#03060E] rounded-3xl border border-[#2E90FF]/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(46,144,255,0.06)] p-4 sm:p-6">
      {/* Background Cyber Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-[#2E90FF]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 right-0 size-64 rounded-full bg-[#1d4ed8]/10 blur-[80px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #2E90FF 1px, transparent 1px), linear-gradient(to bottom, #2E90FF 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* --- TOP BAR: Header & View Switcher --- */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-4 border-b border-[#2E90FF]/20">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-[#2E90FF]/15 border border-[#2E90FF]/35 flex items-center justify-center text-[#2E90FF]">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[10px] font-mono font-bold tracking-wider text-[#93C5FD] uppercase">
                Real Shop Showcase
              </p>
            </div>
            <p className="text-xs font-bold text-white font-secondary tracking-tight">
              20+ Verified Deployments
            </p>
          </div>
        </div>

        {/* 3D Orbit Switch Button (Allows toggling into 3D mode) */}
        {onSwitchTo3D && (
          <button
            type="button"
            onClick={onSwitchTo3D}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081733] hover:bg-[#2E90FF]/25 border border-[#2E90FF]/40 text-[#93C5FD] text-[11px] font-mono font-medium transition-all shadow-[0_0_12px_rgba(46,144,255,0.2)] active:scale-95"
            aria-label="Switch to 3D Orbit view"
          >
            <Compass className="size-3.5 text-[#2E90FF]" />
            <span>3D Orbit</span>
          </button>
        )}
      </div>

      {/* --- CATEGORY FILTER CHIPS --- */}
      <div className="relative z-10 mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
        {[
          { id: "all", label: "All Photos", count: 20 },
          { id: "grocery", label: "Grocery & Marts", count: 6 },
          { id: "wholesale", label: "Wholesale & Depots", count: 5 },
          { id: "mobile", label: "Mobile & Tech", count: 4 },
          { id: "hardware", label: "Hardware Rigging", count: 5 },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveFilter(tab.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[#2E90FF] text-white font-semibold shadow-[0_0_12px_rgba(46,144,255,0.45)]"
                  : "bg-[#061226]/80 text-slate-300 border border-white/10 hover:border-[#2E90FF]/30 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- HERO 3D FLIP CARD STAGE --- */}
      <div className="relative z-10 mt-4 flex flex-col items-center">
        {/* Swipe Instruction Banner */}
        <div className="flex items-center justify-between w-full max-w-sm px-1 mb-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="text-[#2E90FF]">← Swipe Card →</span> or tap arrows
          </span>
          <span className="text-[#93C5FD] font-semibold">
            {String(safeIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
          </span>
        </div>

        {/* 3D Flip Card Container with Touch Drag Gesture */}
        <div
          className="relative w-full max-w-sm aspect-[4/5] sm:aspect-[1/1] max-h-[460px] touch-pan-y"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            key={activeItem.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={(_, info) => {
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 100);
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.55, type: "spring", stiffness: 200, damping: 22 }}
              className="relative w-full h-full rounded-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* --- FRONT SIDE: Real High-Res Photo --- */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[#2E90FF]/40 bg-[#071326] shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(46,144,255,0.2)] flex flex-col justify-between"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Photo Element */}
                <img
                  src={activeItem.src}
                  alt={activeItem.title}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  loading="eager"
                  decoding="async"
                  onClick={() => handleOpenPhoto(activeItem)}
                />

                {/* Cyber Gradient Overlays for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-black/25 to-black/60 pointer-events-none" />

                {/* Top Overlay Bar */}
                <div className="relative z-10 p-3 flex items-center justify-between">
                  {/* Verified Tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050C1A]/85 border border-[#2E90FF]/50 backdrop-blur-md">
                    <span className="size-1.5 rounded-full bg-[#2E90FF] animate-pulse" />
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#93C5FD] uppercase">
                      {activeItem.tag}
                    </span>
                  </div>

                  {/* Flip Specs Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#061226]/90 hover:bg-[#2E90FF]/30 border border-[#2E90FF]/50 text-white text-[10px] font-mono font-medium backdrop-blur-md shadow-md active:scale-95 transition-all"
                    aria-label="Flip card to read details"
                  >
                    <RotateCw className="size-3 text-[#2E90FF]" />
                    <span>Flip Specs</span>
                  </button>
                </div>

                {/* Center Tap-to-Zoom Touch Hint */}
                <div
                  className="relative z-10 my-auto flex items-center justify-center cursor-pointer"
                  onClick={() => handleOpenPhoto(activeItem)}
                >
                  <div className="size-12 rounded-full bg-black/50 border border-white/30 backdrop-blur-md flex items-center justify-center text-white/90 shadow-lg active:scale-90 transition-transform">
                    <Maximize2 className="size-5 text-[#2E90FF]" />
                  </div>
                </div>

                {/* Bottom Card Info Overlay */}
                <div
                  className="relative z-10 p-3.5 bg-gradient-to-t from-[#02050B] via-[#02050B]/90 to-transparent cursor-pointer"
                  onClick={() => handleOpenPhoto(activeItem)}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#60A5FA]">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-[#2E90FF]" />
                      {activeItem.location} • {activeItem.sector}
                    </span>
                    <span className="text-white/60">Tap to Zoom</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {activeItem.logoSrc && (
                      <div className="size-6 rounded-md bg-black/60 border border-[#2E90FF]/40 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={activeItem.logoSrc} alt={activeItem.client} className="size-full object-contain" />
                      </div>
                    )}
                    <h4 className="text-base font-bold text-white font-secondary uppercase tracking-tight line-clamp-1">
                      {activeItem.client}
                    </h4>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-slate-200 line-clamp-1">
                    {activeItem.title}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {activeItem.handles.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#2E90FF]/15 text-[#93C5FD] border border-[#2E90FF]/30"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- BACK SIDE: Full System Specs (Flipped 180deg) --- */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[#2E90FF]/60 bg-gradient-to-b from-[#0B1E3C] via-[#061226] to-[#030914] p-4 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(46,144,255,0.35)]"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div>
                  {/* Top Bar with Flip Back */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#2E90FF]/25">
                    <span className="text-[10px] font-mono text-[#60A5FA] flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="size-3 text-[#2E90FF]" />
                      {activeItem.location} • {activeItem.sector}
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2E90FF]/20 border border-[#2E90FF]/40 text-[#93C5FD] text-[10px] font-mono font-medium active:scale-95"
                    >
                      <RotateCw className="size-3" />
                      <span>Back to Photo</span>
                    </button>
                  </div>

                  {/* Client & Description */}
                  <div className="flex items-center gap-2.5 mt-2.5">
                    {activeItem.logoSrc && (
                      <div className="size-8 rounded-xl bg-black/60 border border-[#2E90FF]/40 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={activeItem.logoSrc} alt={activeItem.client} className="size-full object-contain" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white font-secondary uppercase tracking-tight">
                        {activeItem.client}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#93C5FD]">
                        {activeItem.title}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {activeItem.highlight}
                  </p>

                  {/* Modules Handled */}
                  <div className="mt-3.5 pt-3 border-t border-white/10">
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                      Modules Configured
                    </p>
                    <div className="space-y-1.5">
                      {activeItem.handles.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 text-xs font-mono text-slate-200"
                        >
                          <CheckCircle2 className="size-3.5 text-[#2E90FF] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Back Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(activeItem)}
                    className="flex-1 py-2 rounded-xl bg-[#2E90FF]/20 hover:bg-[#2E90FF]/30 border border-[#2E90FF]/40 text-[#93C5FD] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Maximize2 className="size-3.5" />
                    <span>Zoom Photo</span>
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-[#2E90FF] hover:bg-[#1B7FE8] text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(46,144,255,0.4)] active:scale-95 transition-all"
                  >
                    <span>Request Setup</span>
                    <ArrowRight className="size-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* --- NAV CONTROLS & STEPPER --- */}
        <div className="mt-4 flex items-center justify-between w-full max-w-sm px-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center justify-center size-11 rounded-2xl bg-[#061226]/90 hover:bg-[#2E90FF]/25 border border-[#2E90FF]/40 text-white transition-all shadow-md active:scale-95"
            aria-label="Previous deployment photo"
          >
            <ChevronLeft className="size-5 text-[#2E90FF]" />
          </button>

          {/* Center Indicator & Stepper Dots */}
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-bold text-white tracking-wide">
              {activeItem.client}
            </span>
            <div className="flex items-center gap-1 mt-1.5">
              {filteredItems.slice(0, Math.min(filteredItems.length, 10)).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectIndex(i)}
                  className={`size-1.5 rounded-full transition-all ${
                    i === safeIndex
                      ? "w-5 bg-[#2E90FF] shadow-[0_0_8px_#2E90FF]"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Jump to slide ${i + 1}`}
                />
              ))}
              {filteredItems.length > 10 && (
                <span className="text-[9px] font-mono text-slate-500 pl-0.5">
                  +{filteredItems.length - 10}
                </span>
              )}
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center justify-center size-11 rounded-2xl bg-[#061226]/90 hover:bg-[#2E90FF]/25 border border-[#2E90FF]/40 text-white transition-all shadow-md active:scale-95"
            aria-label="Next deployment photo"
          >
            <ChevronRight className="size-5 text-[#2E90FF]" />
          </button>
        </div>

        {/* --- HORIZONTAL FILMSTRIP OF THUMBNAILS --- */}
        <div className="w-full mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Quick Photo Jump ({filteredItems.length})
            </span>
            <span className="text-[10px] font-mono text-[#93C5FD]">
              Tap any tile
            </span>
          </div>

          <div
            ref={filmstripRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {filteredItems.map((item, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`shrink-0 relative w-16 h-20 rounded-xl overflow-hidden border transition-all ${
                    isActive
                      ? "border-[#2E90FF] ring-2 ring-[#2E90FF]/50 scale-105 shadow-[0_0_12px_rgba(46,144,255,0.4)]"
                      : "border-white/15 opacity-60 hover:opacity-100"
                  }`}
                  style={{ scrollSnapAlign: "center" }}
                  aria-label={`Select photo ${idx + 1}: ${item.client}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[#2E90FF]/20 border border-[#2E90FF]" />
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1 py-0.5 text-[8px] font-mono text-white truncate text-center">
                    {item.client.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- HIGH-RES LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-lg w-full max-h-[92vh] bg-[#071326] border border-[#2E90FF]/50 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_60px_rgba(46,144,255,0.4)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-30 size-9 rounded-full bg-black/80 border border-white/20 hover:border-[#2E90FF] flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>

              {/* Photo Area */}
              <div className="w-full bg-black/80 flex items-center justify-center p-2 relative max-h-[46vh]">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[44vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>

              {/* Info & Details (Scrollable on small devices) */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-gradient-to-b from-[#081733] to-[#040D1D] border-t border-[#2E90FF]/25">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2E90FF]/15 border border-[#2E90FF]/35 text-[9px] font-mono text-[#93C5FD] font-semibold uppercase">
                  <span className="size-1.5 rounded-full bg-[#2E90FF]" />
                  {selectedPhoto.tag}
                </div>

                <div className="flex items-center gap-2.5 mt-2">
                  {selectedPhoto.logoSrc && (
                    <div className="size-9 rounded-xl bg-black/60 border border-[#2E90FF]/40 p-1 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={selectedPhoto.logoSrc} alt={selectedPhoto.client} className="size-full object-contain" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-secondary text-xl font-bold text-white uppercase tracking-tight">
                      {selectedPhoto.client}
                    </h3>
                    <p className="font-mono text-xs text-[#60A5FA] flex items-center gap-1">
                      <MapPin className="size-3" />
                      {selectedPhoto.location} • {selectedPhoto.sector}
                    </p>
                  </div>
                </div>

                <h4 className="mt-3 text-xs font-semibold text-slate-200">
                  {selectedPhoto.title}
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {selectedPhoto.highlight}
                </p>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                    Verified Modules
                  </p>
                  <ul className="space-y-1">
                    {selectedPhoto.handles.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-300"
                      >
                        <CheckCircle2 className="size-3 text-[#2E90FF] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Action CTA */}
                <div className="mt-5 pt-3 border-t border-white/10">
                  <a
                    href={whatsappUrl(
                      `Hello LapCircuit, I saw the deployment photo for ${selectedPhoto.client} on your website and want to request a demo.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#2E90FF] hover:bg-[#1B7FE8] text-white font-mono text-xs font-semibold transition-all shadow-[0_0_20px_rgba(46,144,255,0.4)] flex items-center justify-center gap-2"
                  >
                    <span>Request Similar Setup on WhatsApp</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
