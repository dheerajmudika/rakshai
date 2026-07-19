"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ScanLine, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const alerts = [
  {
    icon: AlertTriangle,
    title: "Digital Arrest Scams",
    desc: "Fraudsters posing as CBI, police, or customs officials on video calls, claiming a parcel or legal case requires an urgent transfer to 'verify' your identity. No real agency arrests over video call or demands money to avoid arrest.",
  },
  {
    icon: ScanLine,
    title: "QR Code Payment Traps",
    desc: "Scanning a QR code to receive money is impossible — QR codes are only for paying, never receiving. Any 'scan to receive ₹X' request is a scam.",
  },
  {
    icon: KeyRound,
    title: "Fake KYC Update Calls",
    desc: "Banks never ask for your PIN, OTP, or CVV over a call or SMS link to 'update KYC'. Always update KYC only through your bank's official branch or verified app.",
  },
];

export function Awareness() {
  return (
    <section id="awareness" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-soft">
            Awareness
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Know the scam before it reaches you
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {alerts.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-threat-critical/10 text-threat-critical">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {a.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/signup">
            <Button variant="outline" size="lg">
              Explore the full Threat Knowledge Base
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
