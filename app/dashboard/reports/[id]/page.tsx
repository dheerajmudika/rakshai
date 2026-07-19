import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db/client";
import { ResultCard } from "@/components/scan/result-card";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const rows = await db
    .select({ report: schema.reports, scan: schema.scans })
    .from(schema.reports)
    .innerJoin(schema.scans, eq(schema.reports.scanId, schema.scans.id))
    .where(and(eq(schema.reports.id, id), eq(schema.reports.userId, user.id)))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();
  const { report, scan } = row;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/reports"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold text-white">{report.title}</h1>
        <p className="mt-1 text-sm text-white/50">
          Saved on{" "}
          {new Date(report.createdAt).toLocaleString("en-IN", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      </div>

      <Card className="p-5">
        <p className="mb-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
          Original Input
        </p>
        <p className="whitespace-pre-wrap text-sm text-white/70">{scan.inputText}</p>
      </Card>

      <ResultCard
        result={{
          verdict: scan.verdict,
          confidence: scan.confidence,
          riskLevel: scan.riskLevel,
          category: scan.category,
          explanation: scan.explanation,
          recommendedAction: scan.action,
          source: scan.source as "gemini" | "heuristic-fallback",
          matchedSignals: [],
          urlsFound: [],
        }}
        extractedText={scan.extractedText ?? undefined}
      />
    </div>
  );
}
