"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, LayoutDashboard, ScanLine, FileText, Settings, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/scan", label: "Scan", icon: ScanLine },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="md:hidden sticky top-0 z-30 border-b border-void-border bg-void/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-intel">
            <ShieldCheck className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-display text-base font-semibold text-white">
            Raksh<span className="text-gradient">AI</span>
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/50 hover:text-threat-critical"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex overflow-x-auto px-3 pb-2 gap-1.5 no-scrollbar">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" || href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                active
                  ? "bg-signal/10 text-signal-soft border border-signal/30"
                  : "text-white/50 border border-transparent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
