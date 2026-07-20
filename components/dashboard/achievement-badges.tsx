"use client";

import { motion } from "framer-motion";

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface AchievementBadgesProps {
  totalScans: number;
  scamsDetected: number;
  reportCount: number;
  urlScans: number;
}

export function AchievementBadges({
  totalScans,
  scamsDetected,
  reportCount,
  urlScans,
}: AchievementBadgesProps) {
  const badges: Badge[] = [
    {
      id: "first_scan",
      icon: "🛡️",
      name: "First Scan",
      description: "Completed your first scan",
      unlocked: totalScans >= 1,
    },
    {
      id: "vigilant",
      icon: "🔍",
      name: "Vigilant",
      description: "Completed 10+ scans",
      unlocked: totalScans >= 10,
    },
    {
      id: "scam_spotter",
      icon: "🚨",
      name: "Scam Spotter",
      description: "Caught 3+ scams",
      unlocked: scamsDetected >= 3,
    },
    {
      id: "reporter",
      icon: "📋",
      name: "Reporter",
      description: "Saved your first report",
      unlocked: reportCount >= 1,
    },
    {
      id: "link_checker",
      icon: "🔗",
      name: "Link Checker",
      description: "Scanned a URL for phishing",
      unlocked: urlScans >= 1,
    },
    {
      id: "champion",
      icon: "🌟",
      name: "Champion",
      description: "25+ scans and 5+ reports",
      unlocked: totalScans >= 25 && reportCount >= 5,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="rounded-2xl border border-void-border bg-void-card/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-white">
            Achievements
          </h2>
          <p className="text-xs text-white/40">
            {unlockedCount}/{badges.length} unlocked
          </p>
        </div>
        <div className="flex h-8 items-center rounded-full border border-signal/30 bg-signal/10 px-3">
          <span className="text-xs font-semibold text-signal-soft">
            {unlockedCount} / {badges.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-signal to-intel"
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="group relative"
          >
            <div
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                badge.unlocked
                  ? "border-signal/30 bg-signal/10 shadow-glow"
                  : "border-void-border bg-white/[0.02] opacity-40 grayscale"
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-xs font-semibold text-white leading-tight">
                {badge.name}
              </p>
            </div>

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 w-36 rounded-lg border border-void-border bg-void-panel px-2.5 py-2 text-center opacity-0 transition-all group-hover:opacity-100">
              <p className="text-xs font-medium text-white">{badge.name}</p>
              <p className="mt-0.5 text-xs text-white/50">{badge.description}</p>
              {badge.unlocked ? (
                <p className="mt-1 text-xs font-semibold text-signal-soft">✓ Unlocked</p>
              ) : (
                <p className="mt-1 text-xs text-white/30">Locked</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
