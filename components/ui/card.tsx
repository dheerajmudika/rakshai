import { cn } from "@/lib/utils";
import * as React from "react";

export function Card({
  className,
  strong,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl gradient-border",
        strong ? "glass-panel-strong" : "glass-panel",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "signal",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "signal" | "intel" | "cyan" | "safe" | "critical";
}) {
  const tones: Record<string, string> = {
    signal: "bg-signal/10 text-signal-soft border-signal/30",
    intel: "bg-intel/10 text-intel-soft border-intel/30",
    cyan: "bg-pulse/10 text-pulse border-pulse/30",
    safe: "bg-threat-safe/10 text-threat-safe border-threat-safe/30",
    critical: "bg-threat-critical/10 text-threat-critical border-threat-critical/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide font-mono",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
