"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  BadgeIndianRupee,
  ShieldAlert,
  Gift,
  Briefcase,
  UserX,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

const TIPS = [
  {
    icon: ShieldAlert,
    color: "from-red-500/20 to-orange-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    title: "Digital Arrest Scam",
    body: 'Fraudsters impersonate CBI, ED, or police and claim you are under "digital arrest". They demand money to close a fake case.',
    action: "🚫 No government agency can arrest you digitally. Hang up immediately and call 1930.",
  },
  {
    icon: BadgeIndianRupee,
    color: "from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/30",
    iconColor: "text-yellow-400",
    title: "Fake UPI Payment",
    body: 'Scammers send "payment received" screenshots or ask you to scan a QR code — which actually deducts money from your account.',
    action: "🚫 Always verify payments in your bank app directly. Scanning a QR code to receive money is impossible.",
  },
  {
    icon: Smartphone,
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    title: "OTP / SIM Swap Scam",
    body: "A caller pretends to be a bank or TRAI representative and tricks you into sharing your OTP, leading to account takeover.",
    action: "🚫 Never share your OTP, UPI PIN, or CVV with anyone — not even bank employees.",
  },
  {
    icon: Gift,
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/30",
    iconColor: "text-green-400",
    title: "Lottery & Prize Scam",
    body: 'You receive a message saying you won a KBC prize, iPhone, or cash. They ask for "processing fees" to release the prize.',
    action: "🚫 You cannot win a lottery you never entered. Block and report immediately.",
  },
  {
    icon: Briefcase,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    title: "Part-Time Job / Investment Scam",
    body: 'Fake jobs offering ₹5,000–₹50,000/day for "liking YouTube videos" or "investing" in crypto/trading platforms with guaranteed returns.',
    action: "🚫 Legitimate jobs never ask you to invest money first. Walk away from guaranteed-return schemes.",
  },
  {
    icon: UserX,
    color: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
    title: "Impersonation Scam",
    body: "Fraudsters pose as your bank, Amazon, Flipkart, or a government department to steal your credentials or money.",
    action: "🚫 Always contact companies via their official website or number — not the number in an SMS or email.",
  },
];

export function AwarenessTips() {
  const [idx, setIdx] = useState(0);
  const tip = TIPS[idx];
  const Icon = tip.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          Scam Awareness Tips
        </h2>
        <span className="text-xs text-white/30">
          {idx + 1} / {TIPS.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${tip.color} ${tip.border} p-5`}
        >
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${tip.iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-sm font-semibold text-white">{tip.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/70">{tip.body}</p>
              <p className="mt-2 text-xs font-medium text-white/90">{tip.action}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => (i - 1 + TIPS.length) % TIPS.length)}
          className="flex items-center gap-1 rounded-lg border border-void-border px-3 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </button>
        <div className="flex gap-1.5">
          {TIPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-5 bg-signal" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx((i) => (i + 1) % TIPS.length)}
          className="flex items-center gap-1 rounded-lg border border-void-border px-3 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/20 transition-all"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
