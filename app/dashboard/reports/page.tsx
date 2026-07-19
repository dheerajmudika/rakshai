import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { FileText, ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { Card } from "@/components/ui/card";
import { VerdictBadge, categoryLabel } from "@/components/dashboard/badges";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const rows = user
    ? await db
        .select({ report: schema.reports, scan: schema.scans })
        .from(schema.reports)
        .innerJoin(schema.scans, eq(schema.reports.scanId, schema.scans.id))
        .where(eq(schema.reports.userId, user.id))
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

      {rows.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <FileText className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/50">No reports saved yet.</p>
          <Link
            href="/dashboard/scan"
            className="text-sm font-medium text-signal-soft hover:text-signal"
          >
            Run a scan and save it as a report →
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map(({ report, scan }) => (
            <Link key={report.id} href={`/dashboard/reports/${report.id}`}>
              <Card className="flex items-center justify-between gap-4 p-4 hover:!border-signal/40 transition-all">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{report.title}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {categoryLabel(scan.category)} ·{" "}
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <VerdictBadge verdict={scan.verdict} />
                  <ChevronRight className="h-4 w-4 text-white/30" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
