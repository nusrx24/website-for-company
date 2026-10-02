"use client";

import * as React from "react";
import { Share2, X } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaDribbble,
  FaXTwitter,
  FaGlobe,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa6";

type Platform =
  | "linkedin"
  | "facebook"
  | "mail"
  | "whatsapp"
  | "instagram"
  | "github"
  | "x"
  | "dribbble"
  | "website";

export interface SocialLink {
  platform: Platform;
  href: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  showOnMobile?: boolean;
  /**
   * Custom Tailwind color class or raw CSS color
   * Example: "bg-slate-700" | "#00ff00" | "rgb(0,255,0)"
   */
  floatingButtonColor?: string;
}

interface PlatformStyle {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  hoverGradient: string;
}

const PLATFORM_STYLES: Record<Platform, PlatformStyle> = {
  facebook: {
    label: "Facebook",
    icon: FaFacebook,
    gradient: "from-blue-700 to-blue-500",
    hoverGradient: "from-blue-600 to-blue-400",
  },
  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedin,
    gradient: "from-blue-600 to-blue-400",
    hoverGradient: "from-blue-500 to-blue-300",
  },
  mail: {
    label: "Email",
    icon: FaEnvelope,
    gradient: "from-cyan-600 to-blue-500",
    hoverGradient: "from-cyan-500 to-blue-400",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: FaWhatsapp,
    gradient: "from-emerald-600 to-teal-500",
    hoverGradient: "from-emerald-500 to-teal-400",
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    gradient: "from-pink-600 via-purple-600 to-orange-500",
    hoverGradient: "from-pink-500 via-purple-500 to-orange-400",
  },
  github: {
    label: "GitHub",
    icon: FaGithub,
    gradient: "from-zinc-800 to-zinc-600",
    hoverGradient: "from-zinc-700 to-zinc-500",
  },
  x: {
    label: "X",
    icon: FaXTwitter,
    gradient: "from-zinc-900 to-zinc-700",
    hoverGradient: "from-zinc-800 to-zinc-600",
  },
  dribbble: {
    label: "Dribbble",
    icon: FaDribbble,
    gradient: "from-pink-600 to-pink-400",
    hoverGradient: "from-pink-500 to-pink-300",
  },
  website: {
    label: "Website",
    icon: FaGlobe,
    gradient: "from-emerald-600 to-teal-500",
    hoverGradient: "from-emerald-500 to-teal-400",
  },
};

export const DEFAULT_LAPCIRCUIT_LINKS: SocialLink[] = [
  { platform: "facebook", href: "https://www.facebook.com/lapcircuit" },
  { platform: "linkedin", href: "https://www.linkedin.com/in/lapcircuit-off-b171b3440/" },
  { platform: "mail", href: "mailto:lapcircuitoff@gmail.com" },
  { platform: "whatsapp", href: "https://wa.me/94711249740?text=Hello%20LapCircuit%2C%20I%20would%20like%20to%20request%20a%20demo%20for%20my%20business." },
];

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links = DEFAULT_LAPCIRCUIT_LINKS,
  showOnMobile = true,
  floatingButtonColor = "border-white/20 bg-[#070B12]/75 backdrop-blur-2xl text-white hover:border-primary/60",
}) => {
  const activeLinks = links && links.length > 0 ? links : DEFAULT_LAPCIRCUIT_LINKS;
  const [hoveredPlatform, setHoveredPlatform] = React.useState<Platform | null>(null);
  const [mobileDockOpen, setMobileDockOpen] = React.useState(false);

  return (
    <>
      {/* ===== Desktop View ===== */}
      <div
        className={`${
          showOnMobile ? "hidden lg:flex" : "hidden md:flex"
        } flex-col fixed top-[35%] left-0 z-40 select-none`}
      >
        <ul className="space-y-3">
          {activeLinks.map(({ platform, href }) => {
            const style = PLATFORM_STYLES[platform];
            if (!style) return null;
            const Icon = style.icon;

            return (
              <li
                key={platform}
                onMouseEnter={() => setHoveredPlatform(platform)}
                onMouseLeave={() => setHoveredPlatform(null)}
                className="group"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between w-48 h-14 px-4 ml-[-132px]
                             group-hover:ml-0 transition-all duration-300 ease-out
                             rounded-r-xl relative overflow-hidden border border-white/15 hover:border-sky-400/60
                             bg-[#070B12]/50 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-2xl"
                >
                  {/* Subtle Colored Glass / Gradient Overlay: transparent in resting state, brightens on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      hoveredPlatform === platform
                        ? style.hoverGradient
                        : style.gradient
                    } ${hoveredPlatform === platform ? "opacity-85" : "opacity-20"} transition-opacity duration-300`}
                  />

                  {/* Label */}
                  <span className="relative z-10 text-white font-semibold tracking-wide text-sm group-hover:tracking-widest transition-all duration-300 drop-shadow-sm">
                    {style.label}
                  </span>

                  {/* Icon */}
                  <Icon
                    size={22}
                    className="relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:scale-125 transition-transform duration-500"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ===== Mobile Floating Dock ===== */}
      {showOnMobile && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50 select-none">
          {mobileDockOpen && (
            <div
              className="fixed inset-0 bg-dark/70 backdrop-blur-sm"
              onClick={() => setMobileDockOpen(false)}
            />
          )}

          <div className="relative">
            {/* Floating Icons */}
            <div
              className={`absolute bottom-20 right-0 flex flex-col-reverse gap-3 transition-all duration-500 ${
                mobileDockOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}
            >
              {activeLinks.map(({ platform, href }, index) => {
                const style = PLATFORM_STYLES[platform];
                if (!style) return null;
                const Icon = style.icon;
                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative ml-auto"
                    style={{
                      transitionDelay: mobileDockOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    <div
                      className="w-13 h-13 rounded-full bg-[#070B12]/75 backdrop-blur-2xl
                                 flex items-center justify-center shadow-lg hover:scale-110
                                 transition-transform duration-300 border border-white/20 relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-25 group-hover:opacity-85 transition-opacity`} />
                      <Icon size={20} className="text-white relative z-10 drop-shadow-sm" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-16
                                    bg-[#070B12]/95 backdrop-blur-xl border border-white/15 text-white
                                    text-xs font-medium px-3 py-1.5 rounded-md shadow-xl
                                    opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {style.label}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-[#070B12] border-r border-t border-white/15 rotate-45" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Floating Button */}
            <button
              type="button"
              id="mobile-social-dock-btn"
              onClick={() => setMobileDockOpen((prev) => !prev)}
              className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] active:scale-95
                         transition-all duration-300 border overflow-hidden cursor-pointer touch-manipulation z-10 ${floatingButtonColor}`}
              aria-label="Toggle social links"
            >
              <div className="relative z-10 pointer-events-none">
                {mobileDockOpen ? (
                  <X size={22} className="text-white" />
                ) : (
                  <Share2 size={22} className="text-sky-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-primary/20 opacity-30 pointer-events-none" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialLinks;
