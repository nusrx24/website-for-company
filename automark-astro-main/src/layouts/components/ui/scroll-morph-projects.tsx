"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Store,
  MapPin,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Building2,
  RotateCw,
  ExternalLink,
  Filter
} from "lucide-react";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

export interface ProjectAchievement {
  id: string;
  src: string;
  title: string;
  client: string;
  clientId: string;
  location: string;
  sector: string;
  tag: string;
  highlight: string;
  handles: string[];
  logoSrc: string;
}

export interface VerifiedClient {
  id: string;
  name: string;
  shortName: string;
  sector: string;
  location: string;
  logoSrc: string;
  tagline: string;
  photoCount: number;
}

export const VERIFIED_CLIENTS: VerifiedClient[] = [
  {
    id: "uj-stores",
    name: "UJ Stores & Traders",
    shortName: "UJ Stores",
    sector: "Wholesale & Grocery Mart",
    location: "Eravur",
    logoSrc: "/images/clients/uj-traders.png",
    tagline: "High-volume counter sales, stock tracking & cheque clearing",
    photoCount: 3,
  },
  {
    id: "mbrk-rice",
    name: "MBRK Rice Distribution",
    shortName: "MBRK Rice",
    sector: "Bulk Rice Distribution",
    location: "Eravur",
    logoSrc: "/images/clients/mbrk-rice.jpg",
    tagline: "Lorry dispatches, trade credit limits & ledger audits",
    photoCount: 2,
  },
  {
    id: "red-zone",
    name: "Red Zone Private Limited",
    shortName: "Red Zone POS",
    sector: "Mobile Phones & Accessories",
    location: "Main Street, Eravur",
    logoSrc: "/images/clients/red-zone.jpg",
    tagline: "Desktop till software synced live to mobile smartphone app",
    photoCount: 3,
  },
  {
    id: "royal-foreign-city",
    name: "Royal Foreign City (RFC)",
    shortName: "Royal Foreign City",
    sector: "Imported Confectionery & Luxury Goods",
    location: "Main Street, Eravur",
    logoSrc: "/images/clients/royal-foreign-city.jpg",
    tagline: "Touch POS terminal, barcode catalog & itemized discounts",
    photoCount: 3,
  },
  {
    id: "apple-fix",
    name: "Apple Fix Solutions",
    shortName: "Apple Fix",
    sector: "Phone Repair, Service & Training",
    location: "Main Street, Eravur",
    logoSrc: "/images/clients/apple-fix.jpg",
    tagline: "Job tickets, parts inventory & thermal repair receipts",
    photoCount: 3,
  },
  {
    id: "rainbow-super",
    name: "Rainbow Super",
    shortName: "Rainbow Super",
    sector: "Supermarket & Grocery Retail",
    location: "Mavady Road, Eravur",
    logoSrc: "/images/clients/rainbow-super.jpg",
    tagline: "Fast cashier walk-in billing & instant inventory deduction",
    photoCount: 2,
  },
  {
    id: "suthais-mart",
    name: "Suthais Foreign Mart",
    shortName: "Foreign Mart",
    sector: "Global Goods & Premium Mart",
    location: "MPCS Road, Meeravodai",
    logoSrc: "/images/clients/suthais-mart.jpg",
    tagline: "Laser barcode scanning, customer credit ledger & cash drawer",
    photoCount: 4,
  },
  {
    id: "sofa-city",
    name: "Sofa City",
    shortName: "Sofa City",
    sector: "Furniture, Upholstery & Retail",
    location: "Eravur",
    logoSrc: "/images/clients/sofa-city.jpg",
    tagline: "Custom orders, supplier fabric ledgers & customer deposit receipts",
    photoCount: 1,
  },
];

export const LAPCIRCUIT_ACHIEVEMENTS: ProjectAchievement[] = [
  // 1. UJ Stores
  {
    id: "uj-counter",
    src: "/images/projects/uj-stores-1.jpg",
    logoSrc: "/images/clients/uj-traders.png",
    client: "UJ Stores",
    clientId: "uj-stores",
    location: "Eravur",
    sector: "Wholesale & Grocery",
    tag: "LIVE COUNTER",
    title: "Counter Billing & Stock",
    highlight: "Product management screen in live use behind the shop counter with full inventory shelves.",
    handles: ["Counter Sales", "Stock Tracking", "Barcode Lookup"],
  },
  {
    id: "uj-dashboard",
    src: "/images/projects/uj-stores-2.jpg",
    logoSrc: "/images/clients/uj-traders.png",
    client: "UJ Stores",
    clientId: "uj-stores",
    location: "Eravur",
    sector: "Wholesale & Grocery",
    tag: "BACK-OFFICE",
    title: "Live Operations Dashboard",
    highlight: "Daily sales totals, outstanding balances, cheque tracking, and low stock warnings.",
    handles: ["Cheque Register", "Supplier Debits", "Profit Metrics"],
  },
  {
    id: "uj-handover",
    src: "/images/projects/uj-stores-3.jpg",
    logoSrc: "/images/clients/uj-traders.png",
    client: "UJ Stores",
    clientId: "uj-stores",
    location: "Eravur",
    sector: "Wholesale & Grocery",
    tag: "HANDOVER VERIFIED",
    title: "System Handover & Deployment",
    highlight: "LapCircuit founder handing over completed offline software running on the shop laptop.",
    handles: ["Offline Database", "Owner Training", "Lifetime Warranty"],
  },

  // 2. MBRK Rice
  {
    id: "mbrk-owner",
    src: "/images/projects/mbrk-1.jpg",
    logoSrc: "/images/clients/mbrk-rice.jpg",
    client: "MBRK Rice Distribution",
    clientId: "mbrk-rice",
    location: "Eravur",
    sector: "Wholesale Rice Distribution",
    tag: "ON-SITE TRAINING",
    title: "Distribution Flow Review",
    highlight: "Working directly with the business owner through the custom multi-warehouse distribution system.",
    handles: ["Lorry Dispatches", "Customer Accounts", "Ledger Audit"],
  },
  {
    id: "mbrk-system",
    src: "/images/projects/mbrk-2.jpg",
    logoSrc: "/images/clients/mbrk-rice.jpg",
    client: "MBRK Rice Distribution",
    clientId: "mbrk-rice",
    location: "Eravur",
    sector: "Wholesale Rice Distribution",
    tag: "CUSTOM WORKFLOW",
    title: "Cheque & Wholesale Suite",
    highlight: "Cheque handling matters as much as sales — custom built for bulk commodities trade.",
    handles: ["Cheque Due Dates", "Net Margins", "Credit Limits"],
  },

  // 3. Red Zone
  {
    id: "redzone-counter",
    src: "/images/projects/redzone-1.jpg",
    logoSrc: "/images/clients/red-zone.jpg",
    client: "Red Zone POS",
    clientId: "red-zone",
    location: "Main Street, Eravur",
    sector: "Mobile & Accessories",
    tag: "RETAIL POS",
    title: "Retail Mobile Counter Setup",
    highlight: "Fast phone accessories billing with integrated laser barcode scanner and thermal receipt printer.",
    handles: ["Quick Bill", "Barcode Scan", "Serial Number Track"],
  },
  {
    id: "redzone-sync",
    src: "/images/projects/redzone-2.jpg",
    logoSrc: "/images/clients/red-zone.jpg",
    client: "Red Zone POS",
    clientId: "red-zone",
    location: "Main Street, Eravur",
    sector: "Mobile & Accessories",
    tag: "MOBILE APP SYNC",
    title: "Laptop POS & Mobile App Sync",
    highlight: "Dell counter laptop running desktop till software with live real-time sync to owner's smartphone app.",
    handles: ["Mobile Companion", "Real-Time Sync", "Daily Revenue View"],
  },
  {
    id: "redzone-receipt",
    src: "/images/projects/redzone-3.jpg",
    logoSrc: "/images/clients/red-zone.jpg",
    client: "Red Zone POS",
    clientId: "red-zone",
    location: "Main Street, Eravur",
    sector: "Mobile & Accessories",
    tag: "PRINTING ENGINE",
    title: "Branded Thermal Receipts",
    highlight: "Customized 80mm customer receipt printed with store branding, contact details, and warranty terms.",
    handles: ["Thermal Bill", "Shop Branding", "Return Policy"],
  },

  // 4. Royal Foreign City (RFC)
  {
    id: "rfc-storefront",
    src: "/images/projects/rfc-2.jpg",
    logoSrc: "/images/clients/royal-foreign-city.jpg",
    client: "Royal Foreign City",
    clientId: "royal-foreign-city",
    location: "Main Street, Eravur",
    sector: "Imported Confectionery & Cosmetics",
    tag: "STOREFRONT PROOF",
    title: "Main Street Storefront",
    highlight: "Prominent retail outlet on Main Street, Eravur, carrying thousands of imported chocolates and luxury goods.",
    handles: ["Retail Storefront", "High Footfall", "Active Deployment"],
  },
  {
    id: "rfc-screen",
    src: "/images/projects/rfc-3.jpg",
    logoSrc: "/images/clients/royal-foreign-city.jpg",
    client: "Royal Foreign City",
    clientId: "royal-foreign-city",
    location: "Main Street, Eravur",
    sector: "Imported Confectionery & Cosmetics",
    tag: "COUNTER TERMINAL",
    title: "Lenovo Counter POS Station",
    highlight: "Lenovo ThinkVision counter terminal running LapCircuit POS with fast product grid and instant discounts.",
    handles: ["Touch Terminal", "Speed Checkout", "Instant Discounts"],
  },
  {
    id: "rfc-receipt",
    src: "/images/projects/rfc-1.jpg",
    logoSrc: "/images/clients/royal-foreign-city.jpg",
    client: "Royal Foreign City",
    clientId: "royal-foreign-city",
    location: "Main Street, Eravur",
    sector: "Imported Confectionery & Cosmetics",
    tag: "VERIFIED RECEIPT",
    title: "Itemized Discount Receipts",
    highlight: "Printed receipt showing RFC crest, itemized discount breakdown, and 'You saved Rs. 100!' customer footer.",
    handles: ["Custom Logo Header", "Itemized Discounts", "Savings Banner"],
  },

  // 5. Apple Fix Solutions
  {
    id: "applefix-training",
    src: "/images/projects/applefix-1.jpg",
    logoSrc: "/images/clients/apple-fix.jpg",
    client: "Apple Fix Solutions",
    clientId: "apple-fix",
    location: "Main Street, Eravur",
    sector: "Phone Repair & Training",
    tag: "WORKFLOW PLANNING",
    title: "Service Desk Workflow Design",
    highlight: "On-site planning session with technician owner to tailor job tickets, repair statuses, and parts stock.",
    handles: ["Service Job Cards", "Technician Log", "Parts Reorder"],
  },
  {
    id: "applefix-counter",
    src: "/images/projects/applefix-2.jpg",
    logoSrc: "/images/clients/apple-fix.jpg",
    client: "Apple Fix Solutions",
    clientId: "apple-fix",
    location: "Main Street, Eravur",
    sector: "Phone Repair & Training",
    tag: "LIVE WORKSTATION",
    title: "AppleFix POS Station & Printer",
    highlight: "Technician operating Dell terminal running AppleFix POS with thermal printer and real-time repair dashboard.",
    handles: ["Dell Workstation", "Thermal Printer", "Revenue Summary"],
  },
  {
    id: "applefix-storefront",
    src: "/images/projects/applefix-3.jpg",
    logoSrc: "/images/clients/apple-fix.jpg",
    client: "Apple Fix Solutions",
    clientId: "apple-fix",
    location: "Main Street, Eravur",
    sector: "Phone Repair & Training",
    tag: "VERIFIED CLIENT",
    title: "Main Street Service Center",
    highlight: "Established mobile phone repair and training center running LapCircuit software for all counter transactions.",
    handles: ["Main Street Location", "Multi-Service Center", "Chip Level Billing"],
  },

  // 6. Rainbow Super
  {
    id: "rainbow-storefront",
    src: "/images/projects/rainbow-1.jpg",
    logoSrc: "/images/clients/rainbow-super.jpg",
    client: "Rainbow Super",
    clientId: "rainbow-super",
    location: "Mavady Road, Eravur",
    sector: "Supermarket & Groceries",
    tag: "SUPERMARKET",
    title: "Supermarket Premises",
    highlight: "Busy neighborhood supermarket with extensive grocery inventory managed through LapCircuit retail POS.",
    handles: ["Supermarket Mart", "Grocery Catalog", "Local Community"],
  },
  {
    id: "rainbow-cashier",
    src: "/images/projects/rainbow-2.jpg",
    logoSrc: "/images/clients/rainbow-super.jpg",
    client: "Rainbow Super",
    clientId: "rainbow-super",
    location: "Mavady Road, Eravur",
    sector: "Supermarket & Groceries",
    tag: "ACTIVE BILLING",
    title: "Live Cashier Billing Operations",
    highlight: "Owner actively billing customers at the counter on shop laptop, processing high-frequency grocery carts smoothly.",
    handles: ["Fast Walk-In Billing", "Daily Cash Drawer", "Price Lookup"],
  },

  // 7. Suthais Foreign Mart
  {
    id: "suthais-counter-action",
    src: "/images/projects/suthais-2.jpg",
    logoSrc: "/images/clients/suthais-mart.jpg",
    client: "Suthais Foreign Mart",
    clientId: "suthais-mart",
    location: "MPCS Road, Meeravodai",
    sector: "Global Goods & Mart",
    tag: "BARCODE ENGINE",
    title: "Laser Barcode Checkout",
    highlight: "Cashier scanning imported confectionery items with optical laser scanner; instant cart response in under 0.8s.",
    handles: ["Laser Barcode Scanner", "Foreign FMCG", "Instant Cart"],
  },
  {
    id: "suthais-cashier-drawer",
    src: "/images/projects/suthais-4.jpg",
    logoSrc: "/images/clients/suthais-mart.jpg",
    client: "Suthais Foreign Mart",
    clientId: "suthais-mart",
    location: "MPCS Road, Meeravodai",
    sector: "Global Goods & Mart",
    tag: "CASH RECONCILIATION",
    title: "Cash Drawer Reconciliation",
    highlight: "Counter manager ringing up purchases with automatic heavy-duty steel cash drawer pop and live sales summary on Samsung monitor.",
    handles: ["Auto Cash Drawer", "Till Balancing", "Stock Shelves"],
  },
  {
    id: "suthais-receipt",
    src: "/images/projects/suthais-1.jpg",
    logoSrc: "/images/clients/suthais-mart.jpg",
    client: "Suthais Foreign Mart",
    clientId: "suthais-mart",
    location: "MPCS Road, Meeravodai",
    sector: "Global Goods & Mart",
    tag: "RECEIVABLES LEDGER",
    title: "Customer Credit & Receivables",
    highlight: "Real customer invoice showing printed store crest, itemized products, and customer outstanding balance ledger.",
    handles: ["Customer Ledger", "Receivables Track", "Crest Logo Print"],
  },
  {
    id: "suthais-storefront",
    src: "/images/projects/suthais-3.jpg",
    logoSrc: "/images/clients/suthais-mart.jpg",
    client: "Suthais Foreign Mart",
    clientId: "suthais-mart",
    location: "MPCS Road, Meeravodai",
    sector: "Global Goods & Mart",
    tag: "PREMISES & STOCK",
    title: "Foreign Mart Retail Storefront",
    highlight: "Fully stocked imported confectionery, luxury personal care, perfumes and FMCG organized with barcode tags.",
    handles: ["Retail Shelves", "Stock Audits", "FMCG Organization"],
  },

  // 8. Sofa City
  {
    id: "sofa-city",
    src: "/images/clients/sofa-city.jpg",
    logoSrc: "/images/clients/sofa-city.jpg",
    client: "Sofa City",
    clientId: "sofa-city",
    location: "Eravur",
    sector: "Furniture & Retail",
    tag: "VERIFIED BRAND",
    title: "Furniture & Custom Upholstery Billing",
    highlight: "Customized orders, supplier fabric ledgers, and advance customer deposit tracking built for furniture retail.",
    handles: ["Custom Orders", "Supplier Ledger", "Deposit Receipts"],
  },
];

const MAX_SCROLL = 2400; // Virtual scroll range

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

interface FlipCardProps {
  item: ProjectAchievement;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  onSelect: (item: ProjectAchievement) => void;
  cardWidth: number;
  cardHeight: number;
}

function FlipCard({
  item,
  index,
  total,
  phase,
  target,
  onSelect,
  cardWidth,
  cardHeight,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 45,
        damping: 16,
      }}
      style={{
        position: "absolute",
        width: cardWidth,
        height: cardHeight,
        transformStyle: "preserve-3d",
        perspective: "1200px",
        zIndex: isFlipped ? 50 : 10,
      }}
      className="cursor-pointer select-none group"
      onClick={() => onSelect(item)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.client} project photo: ${item.title}`}
    >
      <motion.div
        className="relative h-full w-full rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 220, damping: 20 }}
      >
        {/* --- FRONT FACE --- */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-[#2E90FF]/35 bg-[#071326] shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_20px_rgba(46,144,255,0.18)] transition-all duration-300 group-hover:border-[#2E90FF] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(46,144,255,0.4)]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Ambient Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-black/50" />

          {/* Status Tag Pill (Top Left) */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#050C1A]/90 border border-[#2E90FF]/40 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#2E90FF] animate-pulse" />
            <span className="text-[8px] font-mono font-bold tracking-wider text-[#93C5FD] uppercase">
              {item.tag}
            </span>
          </div>

          {/* Client Logo Avatar (Top Right) */}
          <div className="absolute top-2 right-2 z-10 size-6 sm:size-7 rounded-full bg-black/80 border border-[#2E90FF]/50 p-0.5 shadow-md flex items-center justify-center overflow-hidden backdrop-blur-sm group-hover:border-white transition-all">
            <img
              src={item.logoSrc}
              alt={`${item.client} Logo`}
              className="size-full rounded-full object-contain bg-white/5"
            />
          </div>

          {/* Bottom Title Bar with Client Details */}
          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent">
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#93C5FD] truncate uppercase tracking-wider font-semibold">
              <span className="truncate">{item.client}</span>
            </div>
            <p className="text-[11px] font-semibold text-white truncate leading-tight mt-0.5">
              {item.title}
            </p>
          </div>
        </div>

        {/* --- BACK FACE (FLIPPED 180 DEG) --- */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-[#2E90FF]/70 bg-gradient-to-b from-[#091A36] via-[#061224] to-[#030914] p-3 flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_35px_rgba(46,144,255,0.45)]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            {/* Header: Client Logo & Location */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#2E90FF]/25 gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="size-5 rounded-full bg-black/60 border border-[#2E90FF]/40 p-0.5 shrink-0 overflow-hidden">
                  <img
                    src={item.logoSrc}
                    alt={item.client}
                    className="size-full rounded-full object-contain"
                  />
                </div>
                <span className="text-[8px] font-mono text-[#60A5FA] uppercase tracking-wider truncate">
                  {item.location}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[7px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                VERIFIED
              </span>
            </div>

            <h4 className="mt-2 text-xs font-bold text-white uppercase tracking-tight line-clamp-1">
              {item.client}
            </h4>
            <p className="text-[8px] font-mono text-slate-300 line-clamp-1 mt-0.5">
              {item.sector}
            </p>

            <p className="mt-2 text-[9px] text-slate-300 leading-snug line-clamp-3">
              {item.highlight}
            </p>
          </div>

          <div className="pt-2 border-t border-[#2E90FF]/20">
            <div className="flex flex-wrap gap-1 mb-2">
              {item.handles.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-[#93C5FD] border border-[#2E90FF]/25 truncate max-w-full"
                >
                  ✓ {h}
                </span>
              ))}
            </div>

            <div className="w-full py-1 rounded-lg bg-[#2E90FF] hover:bg-[#1B7FE8] text-white text-[9px] font-mono font-semibold flex items-center justify-center gap-1 transition-colors">
              <Maximize2 className="size-2.5" />
              <span>Click to Zoom</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ScrollMorphProjectsProps {
  initialFilter?: string;
  onFilterChange?: (clientId: string) => void;
  onSwitchToDeck?: () => void;
}

// --- Main Interactive Scroll Morph Showcase ---
export default function ScrollMorphProjects({
  initialFilter = "all",
  onFilterChange,
  onSwitchToDeck,
}: ScrollMorphProjectsProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(initialFilter);
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectAchievement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external filter if supplied
  useEffect(() => {
    if (initialFilter) {
      setSelectedClientId(initialFilter);
    }
  }, [initialFilter]);

  // Filter items based on selected client
  const displayedAchievements = useMemo(() => {
    if (selectedClientId === "all") {
      return LAPCIRCUIT_ACHIEVEMENTS;
    }
    return LAPCIRCUIT_ACHIEVEMENTS.filter((item) => item.clientId === selectedClientId);
  }, [selectedClientId]);

  const totalImages = displayedAchievements.length;

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive card sizing
  const isMobile = containerSize.width > 0 && containerSize.width < 768;
  const cardWidth = isMobile ? 88 : 124;
  const cardHeight = isMobile ? 124 : 176;

  // Virtual Scroll State (0 to MAX_SCROLL)
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  // Interactive Dragging on the canvas
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Wheel handling: allow smooth scrubbing
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const current = scrollRef.current;
      const delta = e.deltaY;
      const targetScroll = Math.min(Math.max(current + delta * 1.2, 0), MAX_SCROLL);

      if ((delta > 0 && current < MAX_SCROLL) || (delta < 0 && current > 0)) {
        e.preventDefault();
        scrollRef.current = targetScroll;
        virtualScroll.set(targetScroll);
      }
    },
    [virtualScroll]
  );

  // Touch and pointer drag handling for smooth scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = dragStartX.current - e.clientX;
    const scrollDelta = deltaX * 2.5;
    const newScroll = Math.min(
      Math.max(dragStartScroll.current + scrollDelta, 0),
      MAX_SCROLL
    );
    scrollRef.current = newScroll;
    virtualScroll.set(newScroll);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Smooth Springs for transitions
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 45, damping: 22 });

  const scrollRotate = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 80);
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // Intro Sequence Timers: Scatter -> Line -> Circle
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 300);
    const t2 = setTimeout(() => {
      setIntroPhase("circle");
      virtualScroll.set(450);
      scrollRef.current = 450;
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [virtualScroll]);

  // Scatter Positions for intro
  const scatterPositions = useMemo(() => {
    return displayedAchievements.map(() => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 160,
      scale: 0.65,
      opacity: 0,
    }));
  }, [displayedAchievements]);

  // Dynamic values
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const un1 = smoothMorph.on("change", setMorphValue);
    const un2 = smoothScrollRotate.on("change", setRotateValue);
    const un3 = smoothMouseX.on("change", setParallaxValue);
    return () => {
      un1();
      un2();
      un3();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // Scrubber Helpers
  const setStage = (stageScroll: number) => {
    scrollRef.current = stageScroll;
    virtualScroll.set(stageScroll);
    if (introPhase !== "circle") {
      setIntroPhase("circle");
    }
  };

  const rotateStep = (direction: "prev" | "next") => {
    const step = 280;
    const current = scrollRef.current;
    const target =
      direction === "next"
        ? Math.min(current + step, MAX_SCROLL)
        : Math.max(current - step, 600);
    scrollRef.current = target;
    virtualScroll.set(target);
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (onFilterChange) {
      onFilterChange(clientId);
    }
    // Reset scroll slightly to center arc
    setStage(400);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[780px] md:h-[860px] bg-[#03060E] rounded-3xl border border-[#2E90FF]/30 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9),inset_0_0_100px_rgba(46,144,255,0.06)]"
    >
      {/* Background Cyber Glow & Radial Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-[#2E90FF]/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-30 right-10 size-[500px] rounded-full bg-[#1d4ed8]/12 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #2E90FF 1px, transparent 1px), linear-gradient(to bottom, #2E90FF 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Header & Interactive Guidance */}
      <div className="absolute top-5 inset-x-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081730]/90 border border-[#2E90FF]/40 text-xs font-mono text-[#93C5FD] backdrop-blur-md shadow-[0_0_20px_rgba(46,144,255,0.25)]">
          <Sparkles className="size-3.5 text-[#2E90FF] animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">
            Verified Client Deployments • Real Business Photos
          </span>
        </div>

        <h3 className="mt-2.5 font-['Clash_Display',sans-serif] text-2xl md:text-4xl font-bold text-white tracking-tight uppercase">
          Photos From <span className="text-[#2E90FF]">Real Counters</span> & Stores
        </h3>
        <p className="mt-1 text-xs md:text-sm text-slate-300 max-w-xl">
          Hover cards to flip & inspect live modules • Drag horizontally or scroll to rotate the 3D arc • Click any photo to zoom
        </p>

        {/* Quick Filter Pill Bar */}
        <div className="mt-3 pointer-events-auto flex items-center justify-center gap-1.5 flex-wrap max-w-3xl px-2">
          <button
            type="button"
            onClick={() => handleSelectClient("all")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1.5 ${
              selectedClientId === "all"
                ? "bg-[#2E90FF] text-white shadow-[0_0_12px_rgba(46,144,255,0.4)] border border-[#2E90FF]"
                : "bg-[#061226]/80 text-slate-300 hover:text-white border border-white/10 hover:border-[#2E90FF]/40"
            }`}
          >
            <span>All Deployments</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/40 text-white">
              {LAPCIRCUIT_ACHIEVEMENTS.length}
            </span>
          </button>

          {VERIFIED_CLIENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectClient(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                selectedClientId === c.id
                  ? "bg-[#2E90FF] text-white shadow-[0_0_12px_rgba(46,144,255,0.4)] border border-[#2E90FF]"
                  : "bg-[#061226]/80 text-slate-300 hover:text-white border border-white/10 hover:border-[#2E90FF]/40"
              }`}
            >
              <img
                src={c.logoSrc}
                alt={c.shortName}
                className="size-3.5 rounded-full object-contain bg-white/10"
              />
              <span>{c.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Stage Container */}
      <div className="relative flex items-center justify-center w-full h-full perspective-1000 mt-10 md:mt-12">
        {displayedAchievements.map((item, i) => {
          let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

          if (introPhase === "scatter") {
            target = scatterPositions[i] || { x: 0, y: 0, rotation: 0, scale: 0.5, opacity: 0 };
          } else if (introPhase === "line") {
            const spacing = cardWidth * 0.95;
            const totalWidth = totalImages * spacing;
            const lineX = i * spacing - totalWidth / 2;
            target = { x: lineX, y: 30, rotation: 0, scale: 0.9, opacity: 1 };
          } else {
            // Circle Phase & Morphing to Rainbow Arch
            const minDimension = Math.min(
              containerSize.width || 1000,
              containerSize.height || 800
            );

            // 1. Circle Position
            const circleRadius = Math.min(minDimension * 0.36, 380);
            const circleAngle = (i / totalImages) * 360;
            const circleRad = (circleAngle * Math.PI) / 180;
            const circlePos = {
              x: Math.cos(circleRad) * circleRadius,
              y: Math.sin(circleRad) * circleRadius + 40,
              rotation: circleAngle + 90,
            };

            // 2. Rainbow Arch Position
            const baseRadius = Math.min(
              containerSize.width || 1200,
              (containerSize.height || 800) * 1.4
            );
            const arcRadius = baseRadius * (isMobile ? 1.3 : 1.15);
            const arcApexY = (containerSize.height || 800) * (isMobile ? 0.38 : 0.32);
            const arcCenterY = arcApexY + arcRadius;

            const spreadAngle = isMobile ? 120 : 155;
            const startAngle = -90 - spreadAngle / 2;
            const step = totalImages > 1 ? spreadAngle / (totalImages - 1) : 0;

            // Bounded scroll rotation progress
            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
            const maxRotation = spreadAngle * 0.85;
            const boundedRotation = -scrollProgress * maxRotation;

            const currentArcAngle = startAngle + i * step + boundedRotation;
            const arcRad = (currentArcAngle * Math.PI) / 180;

            const arcPos = {
              x: Math.cos(arcRad) * arcRadius + parallaxValue,
              y: Math.sin(arcRad) * arcRadius + arcCenterY,
              rotation: currentArcAngle + 90,
              scale: isMobile ? 1.25 : 1.55,
            };

            // Interpolate Morph
            target = {
              x: lerp(circlePos.x, arcPos.x, morphValue),
              y: lerp(circlePos.y, arcPos.y, morphValue),
              rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
              scale: lerp(1, arcPos.scale, morphValue),
              opacity: 1,
            };
          }

          return (
            <FlipCard
              key={item.id}
              item={item}
              index={i}
              total={totalImages}
              phase={introPhase}
              target={target}
              onSelect={(it) => setSelectedPhoto(it)}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          );
        })}
      </div>

      {/* Bottom Floating Control Scrubber & Arc Navigation */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 gap-3 pointer-events-auto">
        {/* Stage Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#061226]/90 border border-[#2E90FF]/35 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setStage(0)}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
              scrollRef.current <= 150
                ? "bg-[#2E90FF] text-white shadow-[0_0_15px_rgba(46,144,255,0.4)]"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            3D Circle
          </button>
          <button
            type="button"
            onClick={() => setStage(600)}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
              scrollRef.current > 150 && scrollRef.current <= 1400
                ? "bg-[#2E90FF] text-white shadow-[0_0_15px_rgba(46,144,255,0.4)]"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Rainbow Arc
          </button>
          <button
            type="button"
            onClick={() => setStage(MAX_SCROLL)}
            className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
              scrollRef.current > 1400
                ? "bg-[#2E90FF] text-white shadow-[0_0_15px_rgba(46,144,255,0.4)]"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            All Milestones
          </button>
        </div>

        {/* Client Count Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span>8 Regional Partners • 100% Verified Offline Systems</span>
        </div>

        {/* Rotation Arrows & View Mode Switch */}
        <div className="flex items-center gap-2">
          {onSwitchToDeck && (
            <button
              type="button"
              onClick={onSwitchToDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061226]/90 hover:bg-[#2E90FF]/20 border border-[#2E90FF]/35 text-[#93C5FD] font-mono text-xs transition-colors backdrop-blur-md"
              title="Switch to Mobile Touch Deck"
            >
              <span>📱 Touch Deck</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => rotateStep("prev")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061226]/90 hover:bg-[#2E90FF]/20 border border-[#2E90FF]/35 text-white font-mono text-xs transition-colors backdrop-blur-md"
            aria-label="Previous photos"
          >
            <ChevronLeft className="size-4 text-[#2E90FF]" />
            <span className="hidden sm:inline">Rotate Left</span>
          </button>
          <button
            type="button"
            onClick={() => rotateStep("next")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061226]/90 hover:bg-[#2E90FF]/20 border border-[#2E90FF]/35 text-white font-mono text-xs transition-colors backdrop-blur-md"
            aria-label="Next photos"
          >
            <span className="hidden sm:inline">Rotate Right</span>
            <ChevronRight className="size-4 text-[#2E90FF]" />
          </button>
        </div>
      </div>

      {/* --- HIGH-RES LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#061021] border border-[#2E90FF]/50 rounded-3xl overflow-hidden shadow-[0_24px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(46,144,255,0.3)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo view"
                className="absolute top-4 right-4 z-20 size-9 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="size-5" />
              </button>

              {/* Photo Side */}
              <div className="md:w-3/5 bg-black/70 flex items-center justify-center p-4 relative">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[55vh] md:max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                />
              </div>

              {/* Info Side */}
              <div className="md:w-2/5 p-5 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#2E90FF]/25 bg-gradient-to-b from-[#081733] to-[#040D1D] overflow-y-auto max-h-[85vh]">
                <div>
                  {/* Client Brand Card in Modal */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#030914]/80 border border-[#2E90FF]/30 mb-4">
                    <div className="size-12 rounded-xl bg-black border border-[#2E90FF]/50 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                      <img
                        src={selectedPhoto.logoSrc}
                        alt={`${selectedPhoto.client} Logo`}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-['Clash_Display',sans-serif] text-base font-bold text-white uppercase tracking-tight truncate">
                          {selectedPhoto.client}
                        </h4>
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[10px] font-mono text-slate-300 truncate">
                        {selectedPhoto.sector}
                      </p>
                    </div>
                  </div>

                  {/* Tag & Location */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E90FF]/15 border border-[#2E90FF]/35 text-[10px] font-mono text-[#93C5FD] font-semibold uppercase">
                      <span className="size-1.5 rounded-full bg-[#2E90FF] animate-pulse" />
                      {selectedPhoto.tag}
                    </div>
                    <span className="font-mono text-xs text-[#60A5FA] flex items-center gap-1">
                      <MapPin className="size-3 text-[#2E90FF]" />
                      {selectedPhoto.location}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base md:text-lg font-bold text-white uppercase tracking-tight">
                    {selectedPhoto.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
                    {selectedPhoto.highlight}
                  </p>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2.5">
                      Verified System Capabilities
                    </p>
                    <ul className="space-y-1.5">
                      {selectedPhoto.handles.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs font-mono text-slate-200"
                        >
                          <CheckCircle2 className="size-3.5 text-[#2E90FF] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    <span>Real shop proof</span>
                  </div>
                  <a
                    href={`https://wa.me/94711249740?text=Hello%20LapCircuit%2C%20I%20saw%20your%20verified%20deployment%20at%20${encodeURIComponent(selectedPhoto.client)}%20and%20want%20to%20request%20a%20demo.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2E90FF] hover:bg-[#1B7FE8] text-white font-mono text-xs font-semibold transition-all shadow-[0_0_20px_rgba(46,144,255,0.4)] shrink-0"
                  >
                    <span>Request Setup</span>
                    <span>→</span>
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
