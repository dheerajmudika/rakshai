import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { ReportsList } from "@/components/dashboard/reports-list";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const isStaff = user?.role === "police" || user?.role === "bank";

  const rows = user
    ? await db
        .select({ report: schema.reports, scan: schema.scans })
        .from(schema.reports)
        .innerJoin(schema.scans, eq(schema.reports.scanId, schema.scans.id))
        .where(isStaff ? undefined : eq(schema.reports.userId, user.id))
        .orderBy(desc(schema.reports.createdAt))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          Saved Reports
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Scan results you&apos;ve saved for your records or to file a complaint.
        </p>
      </div>

      <ReportsList rows={rows} />
    </div>
  );
}
