"use client";

import React from "react";
import ColorChangeCards, {
  type BenefitCardData,
} from "@/components/ui/color-change-card";

export interface BenefitsCardsProps {
  benefits?: BenefitCardData[];
}

export function BenefitsCards({ benefits }: BenefitsCardsProps) {
  return <ColorChangeCards benefits={benefits} />;
}

export default BenefitsCards;
