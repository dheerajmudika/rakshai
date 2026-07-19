"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Fingerprint, Radar, Lock } from "lucide-react";
import * as React from "react";

const floatIcons = [
  { Icon: ShieldCheck, top: "12%", left: "8%", delay: 0 },
  { Icon: Fingerprint, top: "70%", left: "12%", delay: 0.6 },
  { Icon: Radar, top: "20%", left: "88%", delay: 1.1 },
  { Icon: Lock, top: "76%", left: "86%", delay: 1.6 },
];

export function AuthShell({
  children,
  panelLabel,
}: {
  children: React.ReactNode;
  panelLabel: string;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-void flex items-center justify-center px-4 py-16">
      {/* animated cyber grid + glow backdrop */}
      <div className="absolute inset-0 bg-grid-glow" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,123,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,123,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="noise-overlay absolute inset-0 pointer-events-none" />

      {floatIcons.map(({ Icon, top, left, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block text-signal/20"
          style={{ top, left }}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon size={40} strokeWidth={1.2} />
        </motion.div>
      ))}

      {/* radial pulse ring */}
      <div className="absolute left-1/2 top-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-intel shadow-glow">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            Raksh<span className="text-gradient">AI</span>
          </span>
        </Link>

        <div className="gradient-border rounded-2xl glass-panel-strong p-8 shadow-2xl shadow-black/40">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-signal-soft">
              {panelLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-threat-safe">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-threat-safe opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-threat-safe" />
              </span>
              Secure Channel
            </span>
          </div>
          {children}
        </div>

        <p className="mt-6 text-center text-xs text-white/30 font-mono">
          256-bit encrypted · Government of India digital safety initiative
        </p>
      </motion.div>
    </div>
  );
}
