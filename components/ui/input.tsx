"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border border-void-border bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/30",
        "outline-none transition-all duration-300 focus:border-signal/50 focus:bg-white/[0.05] focus:shadow-glow",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-xs font-medium tracking-wide text-white/60 font-mono uppercase",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-void-border bg-white/[0.03] accent-signal cursor-pointer",
        className
      )}
      {...props}
    />
  );
}
