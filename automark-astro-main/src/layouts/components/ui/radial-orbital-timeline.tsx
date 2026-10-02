"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap, ExternalLink } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  price?: string;
  features?: string[];
  ctaText?: string;
  popular?: boolean;
}

export interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  centerTitle?: string;
  centerSubtitle?: string;
  className?: string;
}

export default function RadialOrbitalTimeline({
  timelineData,
  centerTitle = "LAPCIRCUIT",
  centerSubtitle = "CORE SYSTEM",
  className = "",
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  // The orbit is sized from the panel's own width, so the nodes on the left
  // and right (and their labels) stay inside it on narrow phones. Measured
  // after mount so the server render and first client render agree.
  const [radius, setRadius] = useState(210);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fit = () =>
      setRadius(Math.round(Math.min(210, Math.max(96, el.clientWidth / 2 - 62))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: ReturnType<typeof setInterval>;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-[#2E90FF] bg-[#2E90FF]/15 border-[#2E90FF]/40";
      case "in-progress":
        return "text-white bg-white/20 border-white/40";
      case "pending":
        return "text-slate-300 bg-black/60 border-white/20";
      default:
        return "text-slate-300 bg-black/60 border-white/20";
    }
  };

  return (
    <div
      className={`w-full min-h-[640px] h-[80vh] max-h-[850px] flex flex-col items-center justify-center bg-[#030508] relative overflow-hidden select-none ${className}`}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,144,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Orbit control button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <LiquidMetalButton
          size="sm"
          variant="control"
          label={autoRotate ? "Orbiting" : "Paused"}
          pressed={autoRotate}
          onClick={() => setAutoRotate(!autoRotate)}
          icon={
            <span
              aria-hidden="true"
              className={`size-2 rounded-full transition-colors ${
                autoRotate
                  ? "bg-[#2E90FF] shadow-[0_0_8px_rgba(46,144,255,0.9)] animate-pulse"
                  : "bg-[#5E6B7D]"
              }`}
            />
          }
        />
      </div>

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Glowing central core */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#2E90FF] via-[#10488f] to-[#041a3a] animate-pulse flex flex-col items-center justify-center z-10 shadow-[0_0_50px_rgba(46,144,255,0.4)] border border-[#2E90FF]/40">
            <div className="absolute w-28 h-28 rounded-full border border-[#2E90FF]/30 animate-ping opacity-60"></div>
            <div
              className="absolute w-36 h-36 rounded-full border border-white/10 animate-ping opacity-40"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Zap className="size-5 text-[#041a3a]" />
            </div>
            <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-mono tracking-widest text-[#2E90FF] uppercase font-bold">
              {centerTitle}
            </div>
          </div>

          {/* Orbital path rings */}
          <div
            className="absolute rounded-full border border-white/10 pointer-events-none"
            style={{ width: radius * 2, height: radius * 2 }}
          ></div>
          <div
            className="absolute rounded-full border border-dashed border-[#2E90FF]/15 pointer-events-none"
            style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Glow energy aura */}
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(46,144,255,0.4) 0%, rgba(46,144,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 46}px`,
                    height: `${item.energy * 0.5 + 46}px`,
                    left: `-${(item.energy * 0.5 + 46 - 44) / 2}px`,
                    top: `-${(item.energy * 0.5 + 46 - 44) / 2}px`,
                  }}
                ></div>

                {/* Node icon pill */}
                <div
                  className={`
                  w-11 h-11 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-[#2E90FF] text-white shadow-[0_0_25px_#2E90FF]"
                      : isRelated
                      ? "bg-[#2E90FF]/40 text-white"
                      : "bg-[#05070a] text-white/90"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-white shadow-lg shadow-white/30"
                      : isRelated
                      ? "border-[#2E90FF] animate-pulse"
                      : "border-white/30 hover:border-[#2E90FF]"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : "hover:scale-110"}
                `}
                >
                  <Icon size={18} />
                </div>

                {/* Node label */}
                <div
                  className={`
                  absolute top-12 left-1/2 -translate-x-1/2 w-28 sm:w-auto sm:whitespace-nowrap
                  text-xs font-semibold tracking-wider text-center
                  transition-all duration-300
                  ${isExpanded ? "text-[#2E90FF] scale-110" : "text-white/80"}
                `}
                >
                  <div>{item.title}</div>
                  {item.price && (
                    <div className="text-[10px] font-mono text-[#2E90FF] font-bold">
                      {item.price}
                    </div>
                  )}
                </div>

                {/* Expanded Card Detail */}
                {isExpanded && (
                  <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-72 sm:w-80 bg-[#060910]/95 backdrop-blur-xl border-[#2E90FF]/40 shadow-2xl shadow-[#2E90FF]/20 overflow-visible text-white z-50 shine-border">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#2E90FF]/80"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge
                          className={`px-2 py-0.5 text-[11px] font-mono uppercase font-bold border ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.popular
                            ? "MOST POPULAR"
                            : item.status === "completed"
                            ? "READY"
                            : item.status === "in-progress"
                            ? "CUSTOMIZABLE"
                            : "SOLUTION"}
                        </Badge>
                        <span className="text-xs font-mono text-[#2E90FF]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold uppercase tracking-tight mt-2 text-white">
                        {item.title}
                      </CardTitle>
                      {item.price && (
                        <div className="text-lg font-bold font-primary text-[#2E90FF]">
                          {item.price}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="text-xs text-slate-300 space-y-3">
                      <p className="leading-relaxed">{item.content}</p>

                      {/* Feature check items if available */}
                      {item.features && item.features.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-1.5">
                          {item.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2 text-[11px] text-slate-300"
                            >
                              <span className="text-[#2E90FF] font-mono font-bold">
                                /
                              </span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Energy / Workflow Efficiency bar */}
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="flex items-center text-slate-400">
                            <Zap size={10} className="mr-1 text-[#2E90FF]" />
                            System Power
                          </span>
                          <span className="font-mono text-[#2E90FF] font-bold">
                            {item.energy}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#2E90FF] to-cyan-400"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Related connecting tiers */}
                      {item.relatedIds.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="flex items-center mb-1.5">
                            <Link size={10} className="text-slate-400 mr-1" />
                            <h4 className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">
                              Compatible Upgrades
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <button
                                  key={relatedId}
                                  type="button"
                                  className="flex items-center h-6 px-2 text-[11px] rounded border border-white/15 bg-white/5 hover:bg-[#2E90FF]/20 hover:border-[#2E90FF]/40 text-slate-300 hover:text-white transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={10}
                                    className="ml-1 text-[#2E90FF]"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action CTA */}
                      <div className="pt-3">
                        <a
                          href="#contact"
                          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#2E90FF] hover:bg-[#2080ee] text-white font-semibold text-xs tracking-wider uppercase shadow-md shadow-[#2E90FF]/20 transition-all"
                        >
                          <span>{item.ctaText || "Request a Quote"}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
