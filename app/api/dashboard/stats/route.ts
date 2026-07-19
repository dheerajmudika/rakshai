import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { jsonOk, requireUser, isError } from "@/lib/api-utils";

export async function GET() {
  const guard = await requireUser();
  if (isError(guard)) return guard.error;
  const { user } = guard;

  const allScans = await db
    .select()
    .from(schema.scans)
    .where(eq(schema.scans.userId, user.id))
    .orderBy(desc(schema.scans.createdAt));

  const totalScans = allScans.length;
  const scamsDetected = allScans.filter((s) => s.verdict === "scam").length;
  const safeScans = totalScans - scamsDetected;

  const categoryCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  for (const s of allScans) {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
    riskCounts[s.riskLevel] = (riskCounts[s.riskLevel] ?? 0) + 1;
  }

  // Last 14 days trend (scans + scams per day)
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

  const recentActivity = allScans.slice(0, 8);

  return jsonOk({
    totalScans,
    scamsDetected,
    safeScans,
    detectionRate: totalScans > 0 ? Math.round((scamsDetected / totalScans) * 100) : 0,
    categoryCounts,
    riskCounts,
    trend: Array.from(trendMap.values()),
    recentActivity,
  });
}
