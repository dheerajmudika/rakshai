import Link from "next/link";
import { VerdictBadge, categoryLabel } from "@/components/dashboard/badges";
import type { Scan } from "@/lib/db/schema";

export function RecentActivity({ scans }: { scans: Scan[] }) {
  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <p className="text-sm text-white/50">No scans yet.</p>
        <Link
          href="/dashboard/scan"
          className="text-sm font-medium text-signal-soft hover:text-signal"
        >
          Run your first scan →
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-void-border">
      {scans.map((scan) => (
        <div
          key={scan.id}
          className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/80">
              {(scan.extractedText || scan.inputText).slice(0, 80)}
            </p>
            <p className="mt-0.5 text-xs text-white/35">
              {categoryLabel(scan.category)} ·{" "}
              {new Date(scan.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <VerdictBadge verdict={scan.verdict} />
        </div>
      ))}
    </div>
  );
}
