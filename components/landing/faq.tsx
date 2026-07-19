"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    q: "Is RakshAI free for citizens to use?",
    a: "Yes. Core protection tools — the message analyzer, website checker, and safety assistant — are free for every citizen. Bank and law-enforcement modules are provisioned separately for institutions.",
  },
  {
    q: "How accurate is the AI threat scoring?",
    a: "RakshAI's models are benchmarked at 99.3% accuracy against a labeled dataset of verified scam and legitimate messages, and are continuously retrained as new scam patterns emerge.",
  },
  {
    q: "Does RakshAI store the messages I analyze?",
    a: "Analyzed content is processed to generate your report and is retained only in your scan history for your own reference. You can delete any scan from your dashboard at any time.",
  },
  {
    q: "Can I report a scam directly through the platform?",
    a: "Yes. Every analysis includes a Report Scam action that packages the evidence and routes it toward the appropriate cybercrime reporting channel.",
  },
  {
    q: "Is this an official Government of India platform?",
    a: "RakshAI is built as a public safety intelligence layer designed to align with CERT-In and cybercrime reporting workflows, for demonstration as an AI-driven citizen protection system.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <Card key={item.q} className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-display text-sm font-semibold text-white sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-signal-soft transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-white/55">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
