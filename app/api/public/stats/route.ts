import { db, schema } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [totalScans] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.scans);
    const [scamsDetected] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.scans)
      .where(sql`verdict = 'scam'`);
    const [totalReports] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.reports);
    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.users);

    const categoryRows = await db
      .select({
        category: schema.scans.category,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.scans)
      .where(sql`verdict = 'scam'`)
      .groupBy(schema.scans.category)
      .orderBy(sql`count(*) desc`)
      .limit(6);

    return Response.json({
      totalScans: totalScans?.count ?? 0,
      scamsDetected: scamsDetected?.count ?? 0,
      totalReports: totalReports?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
      topCategories: categoryRows,
    });
  } catch {
    return Response.json({
      totalScans: 0,
      scamsDetected: 0,
      totalReports: 0,
      totalUsers: 0,
      topCategories: [],
    });
  }
}
