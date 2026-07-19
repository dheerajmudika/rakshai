import { desc, eq } from "drizzle-orm";
import { ShieldAlert, ShieldCheck, ScanLine, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RiskTrendChart } from "@/components/dashboard/risk-trend-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  const allScans = user
    ? await db
        .select()
        .from(schema.scans)
        .where(eq(schema.scans.userId, user.id))
        .orderBy(desc(schema.scans.createdAt))
    : [];

  const totalScans = allScans.length;
  const scamsDetected = allScans.filter((s) => s.verdict === "scam").length;
  const safeScans = totalScans - scamsDetected;
  const detectionRate = totalScans > 0 ? Math.round((scamsDetected / totalScans) * 100) : 0;

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
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          Welcome back, {user?.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Here&apos;s your digital safety overview.
        </p>
      </div>

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

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-white">
            Recent Activity
          </h2>
        </div>
        <RecentActivity scans={allScans.slice(0, 8)} />
      </Card>
    </div>
  );
}
