"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { ThreatRadar } from "@/components/landing/threat-radar";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-40 pb-24 sm:pt-48 sm:pb-32"
    >
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="noise-overlay absolute inset-0" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,123,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,123,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Badge tone="cyan" className="mb-6">
            <Radar className="h-3.5 w-3.5" />
            National Cyber Fraud Intelligence Grid
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            India&apos;s AI-Powered{" "}
            <span className="text-gradient">Digital Public Safety</span>{" "}
            Intelligence Platform
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            Protect citizens from phishing, fake websites, digital arrest
            scams, fake currency and cyber fraud using intelligent AI
            assistance — built for citizens, banks, and law enforcement alike.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="secondary">
                <PlayCircle className="h-4 w-4" />
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              ["4.2M+", "Threats Analyzed"],
              ["99.3%", "Detection Accuracy"],
              ["₹186 Cr", "Fraud Prevented"],
            ].map(([stat, label]) => (
              <div key={label}>
                <div className="font-display text-2xl font-semibold text-white">
                  {stat}
                </div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <ThreatRadar />
        </motion.div>
      </div>
    </section>
  );
}
