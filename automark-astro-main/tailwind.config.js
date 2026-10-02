/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        shine: "shine var(--duration, 14s) infinite linear",
        highlight: "highlight 0.6s ease forwards",
        flash: "flash 0.6s ease forwards",
      },
      keyframes: {
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        highlight: {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "var(--highlight)" },
        },
        flash: {
          "0%": { backgroundColor: "hsl(var(--card, 222 47% 11%))" },
          "50%": { backgroundColor: "var(--highlight)" },
          "100%": { backgroundColor: "hsl(var(--card, 222 47% 11%))" },
        },
      },
    },
  },
  plugins: [],
};
