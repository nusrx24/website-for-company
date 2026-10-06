import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

// Helper to parse font string format: "FontName:wght@400;500;600;700", or
// "FontName:wght@100..900" for a variable font, where one file carries every
// weight in that range.
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    const range = weightPart.match(/wght@?(\d+)\.\.(\d+)/);
    const list = weightPart.match(/wght@?([\d;]+)/);
    if (range) {
      weights = [`${range[1]} ${range[2]}`];
    } else if (list) {
      weights = list[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

// Families that are NOT on Google Fonts and ship with the repo instead. Only
// used when theme.json names one of them; the site's headings are currently
// set in Noto Sans, so nothing here is loaded.
// Clash Display comes from Fontshare (ITF Free Font License); the woff2 files
// live in src/fonts/ so the site makes no third-party font request at runtime.
const LOCAL_FONTS = {
  "Clash Display": [
    { weight: 600, style: "normal", src: ["./src/fonts/ClashDisplay-Semibold.woff2"] },
    { weight: 700, style: "normal", src: ["./src/fonts/ClashDisplay-Bold.woff2"] },
  ],
};

// Build the fonts configuration from theme.json
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

    // Upright only: nothing on the site is set in italic, so those files are
    // not fetched.
    return { ...base, provider: fontProviders.google(), weights, styles: ["normal"] };
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
  // Images are resized by Astro's built-in service (Sharp). Do not import
  // `sharp` in this file: the project's copy and the copy Astro brings are
  // different versions, and on Windows loading both into one process can
  // fail, after which the dev server answers every image with "Could not
  // find Sharp".
  image: { dangerouslyProcessSVG: true },
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  // The page is static HTML with no UI framework. Its scripts are plain
  // JavaScript: public/scripts/main.js, and the brick builder that lives in
  // src/layouts/partials/Process.astro.
  integrations: [sitemap()],
});
