"use client";

import { motion } from "framer-motion";
import {
  MessageSquareWarning,
  Globe2,
  Banknote,
  Bot,
  QrCode,
  Network,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquareWarning,
    title: "Scam Message Analyzer",
    desc: "Detects digital arrest scripts, KYC fraud, lottery scams, and UPI fraud in WhatsApp, SMS, and email text.",
  },
  {
    icon: Globe2,
    title: "Website & QR Analyzer",
    desc: "Checks domain reputation, SSL status, and brand impersonation before you enter your banking details.",
  },
  {
    icon: Banknote,
    title: "Fake Currency Detector",
    desc: "Verifies security thread, watermark, and microprinting on ₹100–₹2000 notes from a single photo.",
  },
  {
    icon: Bot,
    title: "Citizen Safety Assistant",
    desc: "A conversational AI guide that explains scams, answers questions, and walks you through reporting fraud.",
  },
  {
    icon: QrCode,
    title: "Instant QR Verification",
    desc: "Scan any payment QR before paying to confirm the receiving merchant and detect quishing attempts.",
  },
  {
    icon: Network,
    title: "Fraud Network Intelligence",
    desc: "Investigators can trace linked phone numbers, UPI IDs, and accounts behind an organized scam ring.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            Key Features
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            One platform, every layer of protection
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-violet">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-intel/10 blur-2xl transition-all duration-300 group-hover:bg-intel/20" />
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-signal/20 to-intel/20 text-signal-soft">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="relative font-display text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/50">
                  {f.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
