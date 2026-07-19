"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const nodes = [
  { label: "Digital Arrest", angle: 20, radius: 42, tone: "#EF4444", delay: 0 },
  { label: "UPI Fraud", angle: 110, radius: 36, tone: "#F97316", delay: 0.4 },
  { label: "Fake Currency", angle: 200, radius: 44, tone: "#EAB308", delay: 0.8 },
  { label: "QR Scam", angle: 280, radius: 33, tone: "#22D3EE", delay: 1.2 },
  { label: "Phishing", angle: 340, radius: 40, tone: "#7C5CFF", delay: 1.6 },
];

function polar(angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(rad);
  const y = 50 + radiusPct * Math.sin(rad);
  return { x, y };
}

export function ThreatRadar() {
  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-0 rounded-full bg-signal/10 blur-3xl" />

      <div className="glass-panel-strong relative aspect-square w-full rounded-full p-2">
        <div className="relative h-full w-full overflow-hidden rounded-full border border-signal/20 bg-void-panel">
          {/* concentric rings */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-signal/15"
              style={{
                inset: `${i * 11}%`,
              }}
            />
          ))}

          {/* rotating radar sweep */}
          <div className="absolute inset-0 animate-radar-sweep">
            <div
              className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-top"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(34,211,238,0.9), transparent)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(34,211,238,0.22), transparent 28%)",
              }}
            />
          </div>

          {/* crosshair lines */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-signal/10" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-signal/10" />

          {/* center core */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="absolute h-20 w-20 animate-pulse-ring rounded-full border border-signal" />
            <div className="absolute h-20 w-20 animate-pulse-ring rounded-full border border-signal [animation-delay:1.2s]" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-signal to-intel shadow-glow">
              <ShieldCheck className="h-8 w-8 text-white" strokeWidth={2.2} />
            </div>
          </div>

          {/* threat nodes */}
          {nodes.map((node) => {
            const { x, y } = polar(node.angle, node.radius);
            return (
              <motion.div
                key={node.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: node.delay + 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: node.delay,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 animate-ping rounded-full opacity-40"
                      style={{ backgroundColor: node.tone }}
                    />
                    <div
                      className="relative h-3 w-3 rounded-full ring-2 ring-void-panel"
                      style={{ backgroundColor: node.tone }}
                    />
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-void-panel/90 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur">
                    {node.label}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
