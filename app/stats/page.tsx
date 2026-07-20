import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  FileText,
  ArrowRight,
  TrendingUp,
  Globe,
} from "lucide-react";
import { db, schema } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  phishing_url: "Phishing URLs",
  fake_upi_payment: "Fake UPI Payments",
  whatsapp_scam: "WhatsApp Scams",
  sms_phishing: "SMS Phishing",
  email_phishing: "Email Phishing",
  digital_arrest_scam: "Digital Arrest",
  lottery_prize_scam: "Lottery / Prize Scam",
  job_investment_scam: "Job / Investment Scam",
  impersonation_scam: "Impersonation",
  ai_generated_scam_text: "AI-Generated Scam",
  threat_or_harassment: "Threat / Harassment",
  none: "Other",
};

async function getStats() {
  try {
    const [totalScans] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.scans);
    const [scamsDetected] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.scans)
      .where(sql`verdict = 'scam'`);
    const [totalReports] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.reports);
    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.users);

    const categoryRows = await db
      .select({
        category: schema.scans.category,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.scans)
      .where(sql`verdict = 'scam'`)
      .groupBy(schema.scans.category)
      .orderBy(sql`count(*) desc`)
      .limit(6);

    return {
      totalScans: totalScans?.count ?? 0,
      scamsDetected: scamsDetected?.count ?? 0,
      totalReports: totalReports?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
      topCategories: categoryRows || [],
    };
  } catch (err) {
    console.error("Failed to query public stats:", err);
    return {
      totalScans: 0,
      scamsDetected: 0,
      totalReports: 0,
      totalUsers: 0,
      topCategories: [],
    };
  }
}

export default async function StatsPage() {
  const stats = await getStats();
  const safeRate =
    stats.totalScans > 0
      ? Math.round(
          ((stats.totalScans - stats.scamsDetected) / stats.totalScans) * 100
        )
      : 0;

  const statCards = [
    {
      label: "Total Scans Performed",
      value: (stats.totalScans as number).toLocaleString("en-IN"),
      icon: ShieldCheck,
      color: "from-signal/20 to-signal/5",
      border: "border-signal/30",
      iconColor: "text-signal",
    },
    {
      label: "Scams Detected",
      value: (stats.scamsDetected as number).toLocaleString("en-IN"),
      icon: ShieldAlert,
      color: "from-red-500/20 to-red-500/5",
      border: "border-red-500/30",
      iconColor: "text-red-400",
    },
    {
      label: "Citizens Protected",
      value: (stats.totalUsers as number).toLocaleString("en-IN"),
      icon: Users,
      color: "from-green-500/20 to-green-500/5",
      border: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      label: "Reports Filed",
      value: (stats.totalReports as number).toLocaleString("en-IN"),
      icon: FileText,
      color: "from-purple-500/20 to-purple-500/5",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-void text-white">
      <div className="star-field" aria-hidden="true" />

      {/* Nav */}
      <nav className="border-b border-void-border bg-void-panel/60 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-signal to-intel">
              <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-display text-base font-semibold text-white">
              Raksh<span className="text-gradient">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-xl border border-signal/30 bg-signal/10 px-4 py-2 text-sm font-medium text-signal-soft hover:bg-signal/20 transition-all"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 text-xs font-medium text-signal-soft mb-6">
            <TrendingUp className="h-3.5 w-3.5" /> Live Platform Statistics
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            RakshAI Community{" "}
            <span className="bg-gradient-to-r from-signal to-intel bg-clip-text text-transparent">
              Impact
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Real numbers from our growing community of citizens, police
            officers, and bank employees fighting digital fraud across India.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {statCards.map(({ label, value, icon: Icon, color, border, iconColor }) => (
            <div
              key={label}
              className={`gradient-border rounded-2xl border bg-gradient-to-br ${color} ${border} p-6`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 mb-4 ${iconColor}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-3xl font-bold text-white mb-1">
                {value}
              </p>
              <p className="text-sm text-white/50">{label}</p>
            </div>
          ))}
        </div>

        {/* Safe Rate Banner */}
        <div className="gradient-border mb-12 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/10 to-cyan-500/10 p-8 text-center">
          <p className="text-6xl font-display font-bold text-green-400 mb-2">
            {safeRate}%
          </p>
          <p className="text-white/60 text-lg">
            of scanned content successfully identified and protected
          </p>
        </div>

        {/* Top Categories */}
        {(stats.topCategories as { category: string; count: number }[]).length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-semibold text-white mb-6">
              Top Scam Categories Detected
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(stats.topCategories as { category: string; count: number }[]).map(
                (cat, i) => (
                  <div
                    key={cat.category}
                    className="glass-panel flex items-center justify-between rounded-xl border border-void-border px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-signal/10 text-xs font-bold text-signal-soft">
                        #{i + 1}
                      </span>
                      <span className="text-sm text-white/80">
                        {CATEGORY_LABELS[cat.category] ?? cat.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {cat.count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* India Mission */}
        <div className="gradient-border mb-12 rounded-2xl border border-intel/20 bg-gradient-to-r from-intel/10 to-signal/10 p-8">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="h-8 w-8 text-intel-soft" />
            <h2 className="font-display text-xl font-semibold text-white">
              Protecting India from Digital Fraud
            </h2>
          </div>
          <p className="text-white/60 leading-relaxed">
            India loses over ₹7,000 crore annually to cyber fraud. RakshAI uses
            advanced AI to help citizens, police, and banks detect and report
            scams before they cause harm. From UPI fraud to digital arrest
            scams — we&apos;re building a safer digital India, one scan at a
            time.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">
            Join thousands of Indians protected by RakshAI
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-signal to-intel px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:brightness-110 transition-all"
          >
            Start Scanning Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
