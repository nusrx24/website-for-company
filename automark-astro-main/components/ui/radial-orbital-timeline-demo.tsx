"use client";

import { Monitor, Cpu, Cloud, Store, Sparkles } from "lucide-react";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";

const pricingTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Offline Desktop",
    date: "Essential",
    content: "A complete system that runs on the shop computer, with no internet needed.",
    category: "POS",
    icon: Monitor,
    price: "LKR 30,000+",
    relatedIds: [2],
    status: "completed",
    energy: 85,
    features: [
      "Runs fully offline",
      "Single location",
      "Installed and configured for you"
    ],
  },
  {
    id: 2,
    title: "Desktop Application",
    date: "Tailored",
    content: "A dedicated desktop application built around your workflow.",
    category: "Custom",
    icon: Cpu,
    price: "LKR 35,000+",
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 90,
    features: [
      "Dedicated application",
      "Workflow customization",
      "Training for your team"
    ],
  },
  {
    id: 3,
    title: "Cloud + Mobile",
    date: "Multi-device",
    content: "Desktop and mobile access to the same system, so you can check the business from anywhere.",
    category: "Cloud",
    icon: Cloud,
    price: "LKR 55,000+",
    relatedIds: [2, 4],
    status: "completed",
    popular: true,
    energy: 98,
    features: [
      "Desktop + mobile access",
      "Suitable for multiple branches",
      "Reporting on the move"
    ],
  },
  {
    id: 4,
    title: "Software + Hardware",
    date: "Complete Turnkey",
    content: "A complete counter setup — software plus the hardware to run it.",
    category: "Hardware",
    icon: Store,
    price: "LKR 120,000+",
    relatedIds: [3],
    status: "in-progress",
    energy: 100,
    features: [
      "Software and setup",
      "Barcode scanner, printer, cash drawer",
      "Depends on configuration"
    ],
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full bg-[#030508] py-12">
      <RadialOrbitalTimeline
        timelineData={pricingTimelineData}
        centerTitle="LAPCIRCUIT"
        centerSubtitle="PRICING MATRIX"
      />
    </div>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
