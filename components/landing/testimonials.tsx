"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "A relative almost transferred ₹40,000 to a fake 'digital arrest' caller. RakshAI flagged the call script the moment we pasted the transcript.",
    name: "Anita Deshmukh",
    role: "Citizen, Pune",
  },
  {
    quote:
      "Our fraud desk uses the website analyzer to verify reported phishing domains before escalating to CERT-In. It's cut our triage time significantly.",
    name: "Rohit Malhotra",
    role: "Fraud Risk Analyst, Private Sector Bank",
  },
  {
    quote:
      "The network intelligence graph helped us trace a UPI fraud ring across six linked accounts in one sitting instead of days of manual cross-referencing.",
    name: "Inspector S. Kumar",
    role: "Cyber Crime Cell",
  },
];

export function Testimonials() {
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
            Trusted On The Ground
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Citizens and officers, protected together
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="flex h-full flex-col p-7">
                <Quote className="h-6 w-6 text-signal/50" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-void-border pt-4">
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
