"use client";

import { motion } from "framer-motion";
import { ScanSearch, BrainCog, FileWarning, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ScanSearch,
    title: "Submit for analysis",
    desc: "Paste a message, link, or QR code — or upload a currency note photo — through the AI Scan Center.",
  },
  {
    icon: BrainCog,
    title: "AI cross-references threat patterns",
    desc: "RakshAI compares it against known scam scripts, domain reputation signals, and fraud indicators in real time.",
  },
  {
    icon: FileWarning,
    title: "Get a threat score and explanation",
    desc: "A 0–100 threat score, risk level, scam category, and a plain-language breakdown of why it's flagged.",
  },
  {
    icon: ShieldCheck,
    title: "Act with confidence",
    desc: "Follow the recommended action, report the scam directly, or escalate to a cybercrime officer in one tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            From suspicious to verified in four steps
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-signal/30 to-transparent lg:block" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-start"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-void-card to-void-panel ring-1 ring-signal/25">
                <step.icon className="h-7 w-7 text-signal-soft" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-void-panel font-mono text-[11px] text-white/50 ring-1 ring-void-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
