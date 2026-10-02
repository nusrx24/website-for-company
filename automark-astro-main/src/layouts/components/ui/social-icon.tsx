"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export interface SocialIconLinks {
  google?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
}

export interface ButtonSocialIconDemoProps {
  links?: SocialIconLinks;
  className?: string;
}

const DEFAULT_LINKS: SocialIconLinks = {
  google: "mailto:lapcircuitoff@gmail.com",
  github: "https://wa.me/94711249740?text=Hello%20LapCircuit%2C%20I%20would%20like%20to%20request%20a%20demo%20for%20my%20business.",
  linkedin: "https://www.linkedin.com/in/lapcircuit-off-b171b3440/",
  facebook: "https://www.facebook.com/lapcircuit",
};

export const ButtonSocialIconDemo: React.FC<ButtonSocialIconDemoProps> = ({
  links = DEFAULT_LINKS,
  className = "",
}) => {
  const mergedLinks = { ...DEFAULT_LINKS, ...links };

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 flex-row flex-nowrap ${className}`}>
      {/* google */}
      <a
        href={mergedLinks.google}
        target="_blank"
        rel="noreferrer"
        aria-label="Email LapCircuit"
        className="shrink-0 inline-flex"
      >
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-xl !w-11 !h-11 !p-0 shrink-0 hover:scale-115 transition-all duration-300 cursor-pointer border-white/15 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md hover:border-sky-400/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
        >
          <img
            src="https://cdn.21st.dev/assets/mirror/de/de69ec0d4c74e6af4a9a7b84e8aff231c9759001a28b9dd00eef6a1d7bdca993.svg"
            alt="google icon"
            className="h-4 w-4"
          />
        </Button>
      </a>

      {/* github / whatsapp */}
      <a
        href={mergedLinks.github}
        target="_blank"
        rel="noreferrer"
        aria-label="LapCircuit WhatsApp / GitHub"
        className="shrink-0 inline-flex"
      >
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-xl !w-11 !h-11 !p-0 shrink-0 hover:scale-115 transition-all duration-300 cursor-pointer border-white/15 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]"
        >
          <img
            src="https://cdn.21st.dev/assets/mirror/3f/3ff801c6ab2623d0c2b6ced19550e9fbe77e027c0d02b7c3e9f05bac1f2bcee9.svg"
            alt="github icon"
            className="dark:hidden h-4 w-4"
          />
          <img
            src="https://cdn.21st.dev/assets/mirror/b6/b6c8d3766029cc4a9ecde9f79cb313d216266bc20ebb99d17a0432e7bfbfd753.svg"
            alt="github icon"
            className="hidden dark:block h-4 w-4"
          />
        </Button>
      </a>

      {/* linkedin */}
      <a
        href={mergedLinks.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LapCircuit LinkedIn"
        className="shrink-0 inline-flex"
      >
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-xl !w-11 !h-11 !p-0 shrink-0 hover:scale-115 transition-all duration-300 cursor-pointer border-white/15 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(46,144,255,0.3)]"
        >
          <img
            src="https://cdn.21st.dev/assets/mirror/43/435dc94599c98969b743b837a76693ac05641176049e6f83605a67a5fbaacf3a.svg"
            alt="linkedin icon"
            className="h-4 w-4"
          />
        </Button>
      </a>

      {/* facebook */}
      <a
        href={mergedLinks.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="LapCircuit Facebook"
        className="shrink-0 inline-flex"
      >
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="rounded-xl !w-11 !h-11 !p-0 shrink-0 hover:scale-115 transition-all duration-300 cursor-pointer border-white/15 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(24,119,242,0.3)]"
        >
          <img
            src="https://cdn.21st.dev/assets/mirror/1c/1cf27eca40b56f5b3248b5b044099ead054ed39a6a2d579997e6e82fc18f77fe.svg"
            alt="facebook icon"
            className="h-4 w-4"
          />
        </Button>
      </a>
    </div>
  );
};

export { ButtonSocialIconDemo as SocialIcon };
export default ButtonSocialIconDemo;
