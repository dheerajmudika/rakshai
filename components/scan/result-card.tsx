"use client";

import { Card, Badge } from "@/components/ui/card";
import { VerdictBadge, RiskBadge, categoryLabel } from "@/components/dashboard/badges";
import { Info, Link2, FileSearch2, ListChecks } from "lucide-react";

export interface ScanResultView {
  verdict: "scam" | "safe";
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  category: string;
  explanation: string;
  recommendedAction: string;
  source: "gemini" | "heuristic-fallback";
  matchedSignals: string[];
  urlsFound: string[];
}

export function ResultCard({
  result,
  extractedText,
}: {
  result: ScanResultView;
  extractedText?: string;
}) {
  return (
    <Card
      className={`p-6 border-2 ${
        result.verdict === "scam" ? "!border-threat-critical/40" : "!border-threat-safe/40"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <VerdictBadge verdict={result.verdict} />
        <RiskBadge level={result.riskLevel} />
        <Badge tone="signal">{categoryLabel(result.category)}</Badge>
        <Badge tone="intel">{result.confidence}% confidence</Badge>
        {result.source === "heuristic-fallback" && (
          <Badge tone="cyan">Offline heuristic mode</Badge>
        )}
      </div>

      {extractedText && (
        <div className="mt-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
            <FileSearch2 className="h-3.5 w-3.5" /> Extracted Text (OCR)
          </p>
          <div className="rounded-xl border border-void-border bg-white/[0.02] p-3.5 text-sm text-white/70 max-h-40 overflow-y-auto whitespace-pre-wrap">
            {extractedText}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
          <Info className="h-3.5 w-3.5" /> Explanation
        </p>
        <p className="text-sm leading-relaxed text-white/80">{result.explanation}</p>
      </div>

      <div className="mt-5">
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
          <ListChecks className="h-3.5 w-3.5" /> Recommended Action
        </p>
        <p className="text-sm leading-relaxed text-white/80">{result.recommendedAction}</p>
      </div>

      {result.urlsFound.length > 0 && (
        <div className="mt-5">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
            <Link2 className="h-3.5 w-3.5" /> URLs Found
          </p>
          <ul className="space-y-1">
            {result.urlsFound.map((url) => (
              <li
                key={url}
                className="truncate rounded-lg border border-void-border bg-white/[0.02] px-3 py-1.5 font-mono text-xs text-white/60"
              >
                {url}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.matchedSignals.length > 0 && (
        <div className="mt-5">
          <p className="mb-1.5 text-xs font-mono uppercase tracking-widest text-white/40">
            Supporting Signals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSignals.map((s) => (
              <span
                key={s}
                className="rounded-full border border-void-border bg-white/[0.02] px-2.5 py-1 text-xs text-white/50"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
