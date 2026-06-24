import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep, premium "engineer at a top product company" palette.
        ink: {
          DEFAULT: "#05060c",
          800: "#0a0c16",
          700: "#0e1120",
        },
        surface: {
          DEFAULT: "#0f1322",
          accent: "#141a2e",
        },
        brand: {
          bg: "#05060c",
          surface: "#0f1322",
          violet: "#7c6cff",
          accent: "#7c6cff",
          accent2: "#22d3ee",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#fb7185",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,108,255,0.15), 0 20px 60px -20px rgba(124,108,255,0.35)",
        "glow-cyan": "0 0 0 1px rgba(34,211,238,0.15), 0 20px 60px -20px rgba(34,211,238,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(60% 50% at 50% 0%, rgba(124,108,255,0.18), transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)", opacity: "0.5" },
          "33%": { transform: "translate(4%,-6%) scale(1.15)", opacity: "0.75" },
          "66%": { transform: "translate(-4%,4%) scale(0.95)", opacity: "0.6" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-14" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-rev": "marquee-rev 38s linear infinite",
        shimmer: "shimmer 2.6s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "pulse-ring": "pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite",
        "dash-flow": "dash-flow 0.9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
