"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";

// Lazy load Spline with client guard for SSR safety
const Spline = lazy(() => import("@splinetool/react-spline"));

interface LapCircuitSplineRobotProps {
  sceneUrl?: string;
  className?: string;
}

export function LapCircuitSplineRobot({
  sceneUrl = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  className = "",
}: LapCircuitSplineRobotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`relative w-full h-[500px] lg:h-[560px] flex items-center justify-center bg-transparent ${className}`}>
        <div className="flex items-center gap-3 text-xs font-mono text-text-dark bg-background-dark/30 px-4 py-2 rounded-full border border-border/30 backdrop-blur-sm">
          <span className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>Initializing 3D Robot...</span>
        </div>
      </div>
    );
  }

  const handleLoad = (splineApp: any) => {
    try {
      if (typeof window !== "undefined") {
        (window as any).__splineApp = splineApp;
      }

      // 1. Point Light color to vibrant electric cyan
      const objs = splineApp.getAllObjects ? splineApp.getAllObjects() : [];
      const pointLight = objs.find((o: any) => o.name === "Point Light");
      if (pointLight) {
        try {
          pointLight.color = "#00F0FF";
        } catch {
          // Ignore if unmodifiable
        }
      }

      // 2. Adjust Three.js scene lights and add dynamic front fill & cyan rim lights
      if (splineApp._scene) {
        splineApp._scene.traverse((child: any) => {
          if (child.isLight && child.color && typeof child.color.set === "function") {
            child.color.set("#00F0FF");
          }
        });

        // Add soft fill and rim lighting for cyber blue specular reflections
        const existingLight = splineApp._scene.children.find((c: any) => c.isLight);
        if (existingLight && !splineApp._scene.userData?.lapCircuitLights) {
          splineApp._scene.userData = splineApp._scene.userData || {};
          splineApp._scene.userData.lapCircuitLights = true;

          try {
            // Front-right fill light (soft electric blue)
            const fillLight = existingLight.clone();
            fillLight.position.set(400, 300, 500);
            fillLight.color.set("#2E90FA");
            fillLight.intensity = 14;
            splineApp._scene.add(fillLight);

            // Front-left rim light (bright cyan accent)
            const rimLight = existingLight.clone();
            rimLight.position.set(-450, 450, 400);
            rimLight.color.set("#00F0FF");
            rimLight.intensity = 18;
            splineApp._scene.add(rimLight);
          } catch {
            // Scene light clone fallback safe
          }
        }
      }

      // 3. Apply LapCircuit Cyber Blue palette to the robot meshes
      objs.forEach((o: any) => {
        const name = (o.name || "").toLowerCase();
        try {
          if (name.includes("head") || name.includes("body") || name.includes("bot")) {
            o.color = "#1D4ED8"; // Rich sapphire / cobalt blue
          } else if (
            name.includes("arm") ||
            name.includes("hand") ||
            name.includes("cube") ||
            name.includes("cylinder") ||
            name.includes("rectangle") ||
            name.includes("ellipse") ||
            name.includes("femur") ||
            name.includes("shin") ||
            name.includes("pelvic") ||
            name.includes("bottom")
          ) {
            o.color = "#2563EB"; // Vibrant electric blue
          }
        } catch {
          // Skip if object does not support color setter
        }
      });

      if (typeof splineApp.requestRender === "function") {
        splineApp.requestRender();
      }
    } catch (err) {
      console.warn("[LapCircuitSplineRobot] Applied default shader:", err);
    }
  };

  return (
    <div
      className={`relative w-full h-[500px] lg:h-[560px] flex items-center justify-center bg-transparent border-0 outline-none select-none ${className}`}
    >
      {/* Brand ambient spotlight tracking the cursor */}
      <Spotlight
        className="-top-10 left-10 md:left-20 md:-top-5"
        size={340}
      />

      {/* Atmospheric depth glow matching the dark smoke background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-35 blur-3xl"
        style={{
          background: "radial-gradient(circle at 60% 50%, rgba(46,144,255,0.2) 0%, rgba(14,35,70,0.1) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Interactive 3D Robot Scene */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <span className="size-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          <Spline
            scene={sceneUrl}
            onLoad={handleLoad}
            className="w-full h-full pointer-events-auto"
          />
        </Suspense>

        {/* LapCircuit Cybernetic Chest Plate Core Badge */}
        <div
          className="pointer-events-none select-none absolute z-20 flex items-center justify-center transition-all duration-300"
          style={{
            top: "56.5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "164px",
            height: "48px",
          }}
          aria-hidden="true"
        >
          <div className="relative w-full h-full rounded-lg bg-[#040813]/90 border border-cyan-400/60 shadow-[0_0_24px_rgba(0,240,255,0.45),inset_0_0_12px_rgba(30,64,175,0.35)] backdrop-blur-md flex items-center justify-center px-3 py-1.5 gap-2 overflow-hidden">
            {/* Glowing corner tech brackets */}
            <span className="absolute top-0.5 left-0.5 size-1.5 border-t border-l border-cyan-300" />
            <span className="absolute top-0.5 right-0.5 size-1.5 border-t border-r border-cyan-300" />
            <span className="absolute bottom-0.5 left-0.5 size-1.5 border-b border-l border-cyan-300" />
            <span className="absolute bottom-0.5 right-0.5 size-1.5 border-b border-r border-cyan-300" />

            {/* Ambient cybernetic scanner pulse */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full animate-[pulse_4s_ease-in-out_infinite]" />

            {/* Official LapCircuit SVG Brand Logo */}
            <img
              src="/images/logo.svg"
              alt="LapCircuit"
              className="h-6 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,240,255,0.85)]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LapCircuitSplineRobot;
