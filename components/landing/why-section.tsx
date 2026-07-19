"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Landmark, Siren, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const reasons = [
  {
    icon: BrainCircuit,
    title: "Built on real fraud patterns",
    desc: "Trained on scam scripts, phishing infrastructure, and reported cases across UPI, KYC, and digital arrest fraud circulating in India today.",
  },
  {
    icon: Siren,
    title: "Seconds, not hours, to verdict",
    desc: "A suspicious message, link, or currency note is scored and explained in under three seconds — before a citizen acts on it.",
  },
  {
    icon: Landmark,
    title: "Built for institutions too",
    desc: "The same intelligence layer powers citizen protection, bank fraud desks, and cybercrime investigation teams from one platform.",
  },
  {
    icon: Users,
    title: "Designed for every citizen",
    desc: "No cybersecurity background required — plain-language explanations, regional language support, and a guided safety assistant.",
  },
];

export function WhySection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            Why RakshAI
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Digital fraud moves fast. RakshAI moves faster.
          </h2>
          <p className="mt-4 text-white/55">
            Cyber fraud in India costs citizens thousands of crores every
            year. RakshAI puts a trained AI analyst between every citizen and
            the next scam attempt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-signal/10 text-signal-soft transition-colors group-hover:bg-signal/20">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {r.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
