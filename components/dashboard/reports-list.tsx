"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VerdictBadge, categoryLabel } from "@/components/dashboard/badges";

interface ReportRow {
  report: {
    id: string;
    title: string;
    createdAt: string;
  };
  scan: {
    verdict: string;
    category: string;
  };
}

type Filter = "all" | "scam" | "safe";

export function ReportsList({ rows }: { rows: ReportRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesFilter =
        filter === "all" || r.scan.verdict === filter;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        r.report.title.toLowerCase().includes(q) ||
        r.scan.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [rows, query, filter]);

  return (
    <div className="space-y-4">
      {/* Search + Filter row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full rounded-xl border border-void-border bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-signal/50 focus:bg-white/[0.05]"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "scam", "safe"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium capitalize transition-all ${
                filter === f
                  ? f === "scam"
                    ? "border-threat-critical/40 bg-threat-critical/10 text-threat-critical"
                    : f === "safe"
                    ? "border-threat-safe/40 bg-threat-safe/10 text-threat-safe"
                    : "border-signal/30 bg-signal/10 text-signal-soft"
                  : "border-void-border text-white/40 hover:text-white"
              }`}
            >
              {f === "all" ? `All (${rows.length})` : f === "scam" ? `Scams (${rows.filter(r => r.scan.verdict === "scam").length})` : `Safe (${rows.filter(r => r.scan.verdict === "safe").length})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <FileText className="h-8 w-8 text-white/20" />
          <p className="text-sm text-white/50">
            {query || filter !== "all" ? "No reports match your search." : "No reports saved yet."}
          </p>
          {!query && filter === "all" && (
            <Link
              href="/dashboard/scan"
              className="text-sm font-medium text-signal-soft hover:text-signal"
            >
              Run a scan and save it as a report →
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ report, scan }) => (
            <Link key={report.id} href={`/dashboard/reports/${report.id}`}>
              <Card className="flex items-center justify-between gap-4 p-4 hover:!border-signal/40 transition-all">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{report.title}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {categoryLabel(scan.category)} ·{" "}
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <VerdictBadge verdict={scan.verdict as "scam" | "safe"} />
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
