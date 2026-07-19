import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#07050F",
          panel: "#0D0A1E",
          card: "#110D24",
          border: "#1E1840",
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
          "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120,60,255,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 5%, rgba(59,123,255,0.18), transparent 50%), radial-gradient(ellipse 60% 60% at 50% 100%, rgba(34,211,238,0.1), transparent 55%)",
        "orb-purple": "radial-gradient(circle, rgba(120,60,255,0.35) 0%, transparent 70%)",
        "orb-blue": "radial-gradient(circle, rgba(59,123,255,0.3) 0%, transparent 70%)",
        "orb-cyan": "radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)",
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
        "orb-drift-1": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        "orb-drift-2": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-50px, 30px) scale(1.06)" },
          "66%": { transform: "translate(30px, -25px) scale(0.97)" },
        },
        "orb-drift-3": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(25px, 35px) scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "radar-sweep": "radar-sweep 4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
        "border-flow": "border-flow 3s linear infinite",
        "orb-drift-1": "orb-drift-1 18s ease-in-out infinite",
        "orb-drift-2": "orb-drift-2 22s ease-in-out infinite",
        "orb-drift-3": "orb-drift-3 15s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
