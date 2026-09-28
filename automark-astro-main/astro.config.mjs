import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    // Extract weights from wght@400;500;600 format
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

// Families that are NOT on Google Fonts and ship with the repo instead.
// Clash Display comes from Fontshare (ITF Free Font License); the woff2 files
// live in src/fonts/ so the site makes no third-party font request at runtime.
const LOCAL_FONTS = {
  "Clash Display": [
    { weight: 600, style: "normal", src: ["./src/fonts/ClashDisplay-Semibold.woff2"] },
    { weight: 700, style: "normal", src: ["./src/fonts/ClashDisplay-Bold.woff2"] },
  ],
};

// Build fonts configuration from theme.json
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type")) // Filter out type entries
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    const typeKey = `${key}_type`;
    const fallback = theme.fonts.font_family[typeKey] || "sans-serif";

    const base = {
      name,
      cssVariable: `--font-${key}`,
      display: "swap",
      fallbacks: [fallback],
    };

    // Self-hosted family: weights come from the declared variants, not a query.
    if (LOCAL_FONTS[name]) {
      return {
        ...base,
        provider: fontProviders.local(),
        options: { variants: LOCAL_FONTS[name] },
      };
    }

    return { ...base, provider: fontProviders.google(), weights };
  });

// The production domain is not registered yet. `src/config/config.json` is the
// single place to change it — nothing else hardcodes the origin.
if (config.site.base_url.includes(".example")) {
  console.warn(
    "\x1b[33m⚠  Placeholder domain in use (%s).\x1b[0m Set site.base_url in src/config/config.json before going live.",
    config.site.base_url,
  );
}

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp(), dangerouslyProcessSVG: true },
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        // "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    processor: unified(),
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
