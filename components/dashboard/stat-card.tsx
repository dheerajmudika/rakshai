import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "signal",
  suffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "signal" | "critical" | "safe" | "intel";
  suffix?: string;
}) {
  const toneClasses: Record<string, string> = {
    signal: "text-signal-soft bg-signal/10 border-signal/30",
    critical: "text-threat-critical bg-threat-critical/10 border-threat-critical/30",
    safe: "text-threat-safe bg-threat-safe/10 border-threat-safe/30",
    intel: "text-intel-soft bg-intel/10 border-intel/30",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-white/40">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-white">
            {value}
            {suffix && <span className="ml-1 text-base text-white/40">{suffix}</span>}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            toneClasses[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
