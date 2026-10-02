"use client";

import React from "react";
import Timeline, { type JourneyItem } from "@/components/ui/timeline";

export interface WorkflowTimelineProps {
  eyebrow?: string;
  title?: string;
  periodLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const lapcircuitTopSteps: JourneyItem[] = [
  {
    id: "step-01-discuss",
    year: "01",
    month: "Discuss",
    tag: "Discovery & Audit",
    iconType: "discuss",
    image: "/images/timeline/timeline-01-discuss.jpg",
    imageAlt: "LapCircuit discovery session analyzing business workflows and counter operations",
    content: "We sit with you and learn how the business actually works day to day.",
  },
  {
    id: "step-03-develop",
    year: "03",
    month: "Develop",
    tag: "Custom Engineering",
    iconType: "develop",
    image: "/images/timeline/timeline-03-develop.jpg",
    imageAlt: "Custom POS development with modular architecture and multi-language support",
    content: "We build the system and customize it to the agreed plan.",
  },
  {
    id: "step-05-train",
    year: "05",
    month: "Train",
    tag: "Staff Empowerment",
    iconType: "train",
    image: "/images/timeline/timeline-05-train.jpg",
    imageAlt: "Cashier and store manager training with localized POS interface",
    content: "We show your team how to use it, in the language they work in.",
  },
];

const lapcircuitBottomSteps: JourneyItem[] = [
  {
    id: "step-02-plan",
    year: "02",
    month: "Plan",
    tag: "System Architecture",
    iconType: "plan",
    image: "/images/timeline/timeline-02-plan.jpg",
    imageAlt: "POS hardware topology and offline-first database blueprint",
    content: "We map your workflow and agree what the system needs to handle.",
  },
  {
    id: "step-04-deploy",
    year: "04",
    month: "Deploy",
    tag: "On-Site Hardware",
    iconType: "deploy",
    image: "/images/timeline/timeline-04-deploy.jpg",
    imageAlt: "Direct on-site installation of touchscreen POS, printer, and barcode scanner",
    content: "We install and configure it directly at your place of business.",
  },
  {
    id: "step-06-support",
    year: "06",
    month: "Support",
    tag: "Lifetime Hotline",
    iconType: "support",
    image: "/images/timeline/timeline-06-support.jpg",
    imageAlt: "Direct engineer support desk with real-time system monitoring",
    content: "We stay available directly for the software we delivered.",
  },
];

export function WorkflowTimeline({
  title = "HOW WE WORK",
  periodLabel = "STEP 01 — 06",
  imageUrl = "/images/hardware-counter.webp",
  imageAlt = "LapCircuit POS setup",
}: WorkflowTimelineProps) {
  return (
    <div className="relative w-full overflow-hidden bg-[#05070A]">
      <Timeline
        id="workflow-timeline"
        title={title}
        periodLabel={periodLabel}
        textColor="#FFFFFF"
        mutedTextColor="#94a3b8"
        activeColor="#2E90FF"
        backgroundColor="#05070A"
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        topItems={lapcircuitTopSteps}
        bottomItems={lapcircuitBottomSteps}
        duration={1.2}
      />
    </div>
  );
}

export default WorkflowTimeline;
