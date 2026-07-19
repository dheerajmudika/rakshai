import { desc, eq } from "drizzle-orm";
import {
  ShieldAlert,
  ShieldCheck,
  ScanLine,
  TrendingUp,
  Download,
  Star,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RiskTrendChart } from "@/components/dashboard/risk-trend-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AwarenessTips } from "@/components/dashboard/awareness-tips";

export const dynamic = "force-dynamic";

function computeSafetyScore(
  totalScans: number,
  scamsDetected: number,
  reportsSaved: number
): number {
  if (totalScans === 0) return 100;
  // Base: 60 for being active. Bonus for scanning often (up to +20).
  // Bonus for saving reports (up to +10). Penalty for undetected ratio.
  const scanBonus = Math.min(20, totalScans * 2);
  const reportBonus = Math.min(10, reportsSaved * 5);
  const detectionBonus = scamsDetected > 0 ? 10 : 0; // You caught scams!
  return Math.min(100, 60 + scanBonus + reportBonus + detectionBonus);
}

function safetyScoreLabel(score: number) {
  if (score >= 90) return { label: "Excellent", color: "text-threat-safe", glow: "shadow-[0_0_12px_rgba(34,197,94,0.4)]" };
  if (score >= 70) return { label: "Good", color: "text-signal-soft", glow: "shadow-[0_0_12px_rgba(139,92,246,0.4)]" };
  if (score >= 50) return { label: "Fair", color: "text-yellow-400", glow: "shadow-[0_0_12px_rgba(234,179,8,0.3)]" };
  return { label: "Needs Attention", color: "text-threat-critical", glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]" };
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  const isStaff = user?.role === "police" || user?.role === "bank";

  let scansQuery = db
    .select()
    .from(schema.scans);

  if (user && !isStaff) {
    scansQuery.where(eq(schema.scans.userId, user.id));
  }

  const allScans = user
    ? await scansQuery.orderBy(desc(schema.scans.createdAt))
    : [];

  let reportCountQuery = db
    .select({ id: schema.reports.id })
    .from(schema.reports);

  if (user && !isStaff) {
    reportCountQuery.where(eq(schema.reports.userId, user.id));
  }

  const reportCount = user
    ? (await reportCountQuery).length
    : 0;

  const totalScans = allScans.length;
  const scamsDetected = allScans.filter((s) => s.verdict === "scam").length;
  const safeScans = totalScans - scamsDetected;
  const detectionRate = totalScans > 0 ? Math.round((scamsDetected / totalScans) * 100) : 0;

  const safetyScore = computeSafetyScore(totalScans, scamsDetected, reportCount);
  const { label: scoreLabel, color: scoreColor, glow: scoreGlow } = safetyScoreLabel(safetyScore);

  const categoryCounts: Record<string, number> = {};
  for (const s of allScans) {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
  }

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);
  const trendMap = new Map<string, { date: string; scans: number; scams: number }>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(fourteenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    trendMap.set(key, { date: key, scans: 0, scams: 0 });
  }
  for (const s of allScans) {
    const key = new Date(s.createdAt).toISOString().slice(0, 10);
    const entry = trendMap.get(key);
    if (entry) {
      entry.scans += 1;
      if (s.verdict === "scam") entry.scams += 1;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Here&apos;s your digital safety overview.
          </p>
        </div>

        {/* Safety Score Badge */}
        <div
          className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 ${scoreGlow}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <Star className={`h-5 w-5 ${scoreColor}`} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Safety Score</p>
            <p className={`text-xl font-display font-bold ${scoreColor}`}>
              {safetyScore} <span className="text-sm font-normal text-white/40">/ 100</span>
            </p>
            <p className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Scans" value={totalScans} icon={ScanLine} tone="signal" />
        <StatCard label="Scams Detected" value={scamsDetected} icon={ShieldAlert} tone="critical" />
        <StatCard label="Safe Scans" value={safeScans} icon={ShieldCheck} tone="safe" />
        <StatCard
          label="Detection Rate"
          value={detectionRate}
          suffix="%"
          icon={TrendingUp}
          tone="intel"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-white">
            Scan &amp; Risk Trend (14 days)
          </h2>
          <RiskTrendChart data={Array.from(trendMap.values())} />
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-display text-base font-semibold text-white">
            Top Scam Categories
          </h2>
          <CategoryChart counts={categoryCounts} />
        </Card>
      </div>

      {/* Recent Activity + Awareness Tips side-by-side on large screens */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-white">
              Recent Activity
            </h2>
            {totalScans > 0 && (
              <a
                href="/api/scans/export"
                download
                className="flex items-center gap-1.5 rounded-lg border border-void-border px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </a>
            )}
          </div>
          <RecentActivity scans={allScans.slice(0, 8)} />
        </Card>

        <Card className="p-5">
          <AwarenessTips />
        </Card>
      </div>
    </div>
  );
}
