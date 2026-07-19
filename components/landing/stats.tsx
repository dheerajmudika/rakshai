"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const stats = [
  { value: "4.2M+", label: "Messages Analyzed", tone: "text-signal-soft" },
  { value: "1.1M+", label: "Scams Blocked", tone: "text-threat-critical" },
  { value: "₹186 Cr", label: "Fraud Amount Prevented", tone: "text-threat-safe" },
  { value: "99.3%", label: "AI Detection Accuracy", tone: "text-pulse" },
];

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-7 text-center">
                <div
                  className={`font-display text-3xl font-bold sm:text-4xl ${s.tone}`}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wide text-white/45">
                  {s.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
