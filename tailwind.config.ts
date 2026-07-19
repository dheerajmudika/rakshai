import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05070F",
          panel: "#0B1120",
          card: "#0E1526",
          border: "#1B2438",
        },
        signal: {
          DEFAULT: "#3B7BFF",
          soft: "#5A93FF",
          dim: "#1E3A7A",
        },
        intel: {
          DEFAULT: "#7C5CFF",
          soft: "#9B82FF",
        },
        pulse: {
          DEFAULT: "#22D3EE",
        },
        threat: {
          safe: "#22C55E",
          low: "#84CC16",
          medium: "#EAB308",
          high: "#F97316",
          critical: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(59,123,255,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(124,92,255,0.12), transparent 40%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.08), transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(59,123,255,0.4)",
        "glow-violet": "0 0 40px -10px rgba(124,92,255,0.4)",
        "glow-cyan": "0 0 40px -10px rgba(34,211,238,0.35)",
      },
      keyframes: {
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "radar-sweep": "radar-sweep 4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
        "border-flow": "border-flow 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
