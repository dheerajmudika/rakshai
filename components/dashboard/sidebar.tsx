"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  ScanLine,
  FileText,
  Settings,
  LogOut,
  Home,
  Map,
  LifeBuoy,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/scan", label: "Scan Detector", icon: ScanLine },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/heatmap", label: "Scam Heatmap", icon: Map },
  { href: "/dashboard/help", label: "Help Guide", icon: LifeBuoy },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-void-border bg-void-panel/60 backdrop-blur-xl">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-6 py-6 hover:opacity-80 transition-opacity"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-intel shadow-glow">
          <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.2} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-white">
          Raksh<span className="text-gradient">AI</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-signal/10 text-signal-soft border border-signal/30 shadow-glow"
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-void-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-signal to-intel text-xs font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
          </div>
        </div>
        <Link
          href="/stats"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <BarChart3 className="h-4.5 w-4.5" />
          Community Stats
        </Link>
        <Link
          href="/"
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Home className="h-4.5 w-4.5" />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/50 hover:text-threat-critical hover:bg-threat-critical/10 transition-all duration-200"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
