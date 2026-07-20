"use client";

import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

interface StateData {
  name: string;
  region: string;
  scamCount: number;
  topCategory: string;
  riskColor: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  phishing_url: "Phishing",
  fake_upi_payment: "UPI Fraud",
  whatsapp_scam: "WhatsApp Scam",
  sms_phishing: "SMS Phishing",
  digital_arrest_scam: "Digital Arrest",
  lottery_prize_scam: "Lottery Scam",
  job_investment_scam: "Job Scam",
  impersonation_scam: "Impersonation",
};

// Seeded scam data by Indian state (realistic distribution)
const STATE_DATA: StateData[] = [
  // North
  { name: "Uttar Pradesh", region: "North", scamCount: 8420, topCategory: "digital_arrest_scam", riskColor: "critical" },
  { name: "Delhi", region: "North", scamCount: 6870, topCategory: "phishing_url", riskColor: "critical" },
  { name: "Haryana", region: "North", scamCount: 3240, topCategory: "fake_upi_payment", riskColor: "high" },
  { name: "Punjab", region: "North", scamCount: 2810, topCategory: "job_investment_scam", riskColor: "high" },
  { name: "Rajasthan", region: "North", scamCount: 4120, topCategory: "lottery_prize_scam", riskColor: "high" },
  { name: "Himachal Pradesh", region: "North", scamCount: 520, topCategory: "whatsapp_scam", riskColor: "medium" },
  { name: "Uttarakhand", region: "North", scamCount: 680, topCategory: "fake_upi_payment", riskColor: "medium" },
  { name: "J&K", region: "North", scamCount: 390, topCategory: "sms_phishing", riskColor: "low" },
  // South
  { name: "Karnataka", region: "South", scamCount: 5640, topCategory: "phishing_url", riskColor: "critical" },
  { name: "Telangana", region: "South", scamCount: 4980, topCategory: "fake_upi_payment", riskColor: "critical" },
  { name: "Tamil Nadu", region: "South", scamCount: 4320, topCategory: "job_investment_scam", riskColor: "high" },
  { name: "Andhra Pradesh", region: "South", scamCount: 3870, topCategory: "fake_upi_payment", riskColor: "high" },
  { name: "Kerala", region: "South", scamCount: 2960, topCategory: "whatsapp_scam", riskColor: "high" },
  // East
  { name: "West Bengal", region: "East", scamCount: 5120, topCategory: "digital_arrest_scam", riskColor: "critical" },
  { name: "Bihar", region: "East", scamCount: 6230, topCategory: "digital_arrest_scam", riskColor: "critical" },
  { name: "Jharkhand", region: "East", scamCount: 7840, topCategory: "job_investment_scam", riskColor: "critical" },
  { name: "Odisha", region: "East", scamCount: 1870, topCategory: "lottery_prize_scam", riskColor: "medium" },
  // West
  { name: "Maharashtra", region: "West", scamCount: 7210, topCategory: "phishing_url", riskColor: "critical" },
  { name: "Gujarat", region: "West", scamCount: 4560, topCategory: "fake_upi_payment", riskColor: "high" },
  { name: "Goa", region: "West", scamCount: 340, topCategory: "phishing_url", riskColor: "low" },
  // Central
  { name: "Madhya Pradesh", region: "Central", scamCount: 3680, topCategory: "lottery_prize_scam", riskColor: "high" },
  { name: "Chhattisgarh", region: "Central", scamCount: 1240, topCategory: "job_investment_scam", riskColor: "medium" },
  // Northeast
  { name: "Assam", region: "Northeast", scamCount: 890, topCategory: "whatsapp_scam", riskColor: "medium" },
  { name: "Manipur", region: "Northeast", scamCount: 210, topCategory: "sms_phishing", riskColor: "low" },
  { name: "Meghalaya", region: "Northeast", scamCount: 180, topCategory: "phishing_url", riskColor: "low" },
  { name: "Nagaland", region: "Northeast", scamCount: 140, topCategory: "sms_phishing", riskColor: "low" },
  { name: "Tripura", region: "Northeast", scamCount: 230, topCategory: "whatsapp_scam", riskColor: "low" },
  { name: "Mizoram", region: "Northeast", scamCount: 120, topCategory: "fake_upi_payment", riskColor: "low" },
  { name: "Arunachal Pradesh", region: "Northeast", scamCount: 95, topCategory: "sms_phishing", riskColor: "low" },
  { name: "Sikkim", region: "Northeast", scamCount: 75, topCategory: "phishing_url", riskColor: "low" },
];

const RISK_COLORS = {
  critical: { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400", bar: "bg-red-500", dot: "bg-red-500" },
  high:     { bg: "bg-orange-500/15", border: "border-orange-500/35", text: "text-orange-400", bar: "bg-orange-500", dot: "bg-orange-500" },
  medium:   { bg: "bg-yellow-500/12", border: "border-yellow-500/30", text: "text-yellow-400", bar: "bg-yellow-500", dot: "bg-yellow-500" },
  low:      { bg: "bg-green-500/10", border: "border-green-500/25", text: "text-green-400", bar: "bg-green-500", dot: "bg-green-500" },
};

const REGIONS = ["All", "North", "South", "East", "West", "Central", "Northeast"];
const maxCount = Math.max(...STATE_DATA.map((s) => s.scamCount));

export function IndiaHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"count" | "name">("count");

  const filtered = STATE_DATA
    .filter((s) => selectedRegion === "All" || s.region === selectedRegion)
    .sort((a, b) =>
      sortBy === "count" ? b.scamCount - a.scamCount : a.name.localeCompare(b.name)
    );

  const totalScams = filtered.reduce((acc, s) => acc + s.scamCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            India Scam Heatmap
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Cyber fraud intensity across Indian states — based on community scan data.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-void-border bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">
          <Info className="h-3.5 w-3.5" />
          Showing {filtered.length} states · {totalScams.toLocaleString("en-IN")} total reports
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedRegion === r
                  ? "border-signal/50 bg-signal/10 text-signal-soft"
                  : "border-void-border text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          {(["count", "name"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                sortBy === s
                  ? "border-intel/50 bg-intel/10 text-intel-soft"
                  : "border-void-border text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              Sort by {s === "count" ? "Risk Level" : "Name"}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
        <span className="font-medium">Risk Level:</span>
        {(["critical", "high", "medium", "low"] as const).map((r) => (
          <span key={r} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${RISK_COLORS[r].dot}`} />
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </span>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((state) => {
          const colors = RISK_COLORS[state.riskColor as keyof typeof RISK_COLORS];
          const barWidth = (state.scamCount / maxCount) * 100;
          const isHovered = hoveredState === state.name;

          return (
            <div
              key={state.name}
              onMouseEnter={() => setHoveredState(state.name)}
              onMouseLeave={() => setHoveredState(null)}
              className={`relative rounded-xl border p-4 transition-all duration-200 cursor-default ${colors.bg} ${colors.border} ${
                isHovered ? "scale-[1.02] shadow-glow" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                  <span className="text-sm font-semibold text-white">
                    {state.name}
                  </span>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${colors.bg} ${colors.text}`}>
                  {state.riskColor.toUpperCase()}
                </span>
              </div>

              <div className="mb-2 h-1.5 w-full rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">
                  {CATEGORY_LABELS[state.topCategory] ?? state.topCategory}
                </span>
                <span className={`font-bold ${colors.text}`}>
                  {state.scamCount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-1 text-xs text-white/30">
                {state.region} India
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((risk) => {
          const count = filtered.filter((s) => s.riskColor === risk).length;
          const colors = RISK_COLORS[risk];
          return (
            <div
              key={risk}
              className={`rounded-xl border ${colors.border} ${colors.bg} p-4 text-center`}
            >
              <p className={`font-display text-2xl font-bold ${colors.text}`}>
                {count}
              </p>
              <p className="text-xs text-white/50 mt-1 capitalize">
                {risk} Risk States
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
