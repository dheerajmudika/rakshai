import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "AI Scan Center", href: "/dashboard/scan" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Command Center", href: "/dashboard/reports" },
      { label: "Community Stats", href: "/stats" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-void-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-intel shadow-glow">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-semibold text-white">
                RakshAI
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Protecting citizens from digital fraud using artificial
              intelligence.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-white/50">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-signal-soft" />
                contact@rakshai.gov.in
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-signal-soft" />
                1930 (Cyber Crime Helpline)
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-signal-soft" />
                New Delhi, India
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/45 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-void-border pt-8 sm:flex-row">
          <p className="text-xs text-white/35">
            © 2026 RakshAI. All rights reserved. A digital public safety
            initiative.
          </p>
          <div className="flex gap-6 text-xs text-white/35">
            <Link href="#" className="hover:text-white/60">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white/60">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
