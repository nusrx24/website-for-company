"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export interface DashboardScrollDemoProps {
  /**
   * Path to the POS dashboard preview image.
   * You can replace this with your own dashboard screenshot anytime!
   * Examples:
   *   - "/images/pos-dashboard-preview.jpg" (local file in public/images/)
   *   - "https://your-domain.com/my-pos-screenshot.png" (external URL)
   */
  imageSrc?: string;
  imageAlt?: string;
}

export function DashboardScrollDemo({
  imageSrc = "/images/pos-dashboard-preview.jpg",
  imageAlt = "LapCircuit POS & Business Management Software Dashboard",
}: DashboardScrollDemoProps) {
  return (
    <section className="relative overflow-hidden -my-10 md:-my-16">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Unified POS Command Center
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl uppercase">
              Run Your Operations <br />
              <span className="mt-2 block bg-gradient-to-r from-primary via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                From One Intelligent Screen
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-text-light/80 sm:text-base">
              Real-time sales tracking, lightning-fast barcode checkout, automated inventory deductions, and instant end-of-day revenue reports.
            </p>
          </div>
        }
      >
        {/*
          ============================================================
          FUTURE DASHBOARD IMAGE REPLACEMENT:
          To replace this image with your own custom POS screenshot:
          1. Place your screenshot in `public/images/your-file.png`
          2. Change `imageSrc` below or pass it as a prop from index.astro
          ============================================================
        */}
        <div className="relative h-full w-full bg-[#05070A] overflow-hidden rounded-xl">
          <img
            src={imageSrc}
            alt={imageAlt}
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-top rounded-xl select-none"
            loading="lazy"
            draggable={false}
          />
        </div>
      </ContainerScroll>
    </section>
  );
}

export default DashboardScrollDemo;
