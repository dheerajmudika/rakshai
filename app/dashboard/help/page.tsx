import Link from "next/link";
import {
  Phone,
  Globe,
  Shield,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HelpPage() {
  const steps = [
    {
      icon: Phone,
      color: "from-red-500/20 to-orange-500/10",
      border: "border-red-500/30",
      iconColor: "text-red-400",
      title: "Step 1: Call the Cybercrime Helpline Immediately",
      content:
        "Call 1930 — India's National Cyber Crime Helpline — available 24/7. Report the incident while it is fresh. For financial fraud, call within the first few hours so banks can freeze the fraudulent transactions before the money is withdrawn.",
      action: { label: "📞 Call 1930", href: "tel:1930" },
    },
    {
      icon: Globe,
      color: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      title: "Step 2: File a Complaint on cybercrime.gov.in",
      content:
        "Register an official complaint on the National Cyber Crime Reporting Portal. Choose 'Report Financial Fraud' for money-related crimes or 'Report Other Cyber Crime' for other scams. You will receive a complaint ID to track your case status.",
      action: {
        label: "Open cybercrime.gov.in",
        href: "https://cybercrime.gov.in",
        external: true,
      },
    },
    {
      icon: Shield,
      color: "from-yellow-500/20 to-amber-500/10",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      title: "Step 3: Contact Your Bank (for financial fraud)",
      content:
        "If money was transferred fraudulently, immediately call your bank's fraud helpline and ask them to: (1) Freeze the beneficiary account, (2) Raise a chargeback request, (3) Block your account/card if compromised. Time is critical — money can often be recovered if reported within 24 hours.",
      action: { label: "RBI Helpline: 14448", href: "tel:14448" },
    },
    {
      icon: Camera,
      color: "from-purple-500/20 to-pink-500/10",
      border: "border-purple-500/30",
      iconColor: "text-purple-400",
      title: "Step 4: Collect and Preserve Evidence",
      content: "",
      checklist: [
        "Screenshot all suspicious messages, calls, and transaction details",
        "Note the scammer's phone numbers, UPI IDs, bank account numbers",
        "Save transaction reference IDs (UTR/RRN numbers for UPI payments)",
        "Record the exact date, time, and amount of each suspicious transaction",
        "Do NOT delete any messages or call logs — they are legal evidence",
      ],
    },
    {
      icon: AlertTriangle,
      color: "from-orange-500/20 to-red-500/10",
      border: "border-orange-500/30",
      iconColor: "text-orange-400",
      title: "Step 5: Secure Your Accounts Immediately",
      content: "",
      checklist: [
        "Change passwords for all online banking and social accounts",
        "Enable two-factor authentication (2FA) everywhere possible",
        "Check and revoke suspicious third-party app permissions",
        "If UPI PIN was shared, reset it immediately in your banking app",
        "Alert your contacts if your social media was compromised",
      ],
    },
    {
      icon: CheckCircle2,
      color: "from-green-500/20 to-emerald-500/10",
      border: "border-green-500/30",
      iconColor: "text-green-400",
      title: "Step 6: Report to CERT-In for Advanced Threats",
      content:
        "If you faced a serious cyberattack (hacked website, data breach, ransomware, or advanced phishing), report to CERT-In (Indian Computer Emergency Response Team). They can help track and block the attackers.",
      action: {
        label: "Visit cert-in.org.in",
        href: "https://cert-in.org.in",
        external: true,
      },
    },
  ];

  const helplines = [
    {
      name: "Cyber Crime Helpline",
      number: "1930",
      desc: "24/7 national helpline",
      href: "tel:1930",
    },
    {
      name: "cybercrime.gov.in",
      number: "Portal",
      desc: "File online complaint",
      href: "https://cybercrime.gov.in",
    },
    {
      name: "RBI Banking Helpline",
      number: "14448",
      desc: "Banking fraud",
      href: "tel:14448",
    },
    {
      name: "CERT-In",
      number: "Email",
      desc: "Advanced cyber threats",
      href: "mailto:incident@cert-in.org.in",
    },
  ];

  const doNots = [
    "Never share your OTP, UPI PIN, CVV, or internet banking password — not even with bank officials",
    "Never allow screen sharing/remote access apps (AnyDesk, TeamViewer) to anyone claiming to be from a bank or government",
    "Never pay money to 'unfreeze' your account — this is always a scam",
    "Never click links from unknown SMS/WhatsApp — type URLs directly in your browser",
    "Never install apps from links shared via WhatsApp or SMS",
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          Cybercrime Help Guide
        </h1>
        <p className="mt-1 text-sm text-white/50">
          What to do if you&apos;ve been targeted by a scam or cyber fraud — step by
          step.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="font-display text-lg font-semibold text-red-400">
              🚨 Emergency Cybercrime Helpline
            </p>
            <p className="text-sm text-white/60">
              If you were just scammed, call immediately — faster response means
              higher recovery chance:
            </p>
          </div>
          <a
            href="tel:1930"
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-2.5 text-lg font-bold text-white hover:bg-red-600 transition-all"
          >
            📞 1930
          </a>
        </div>
      </div>

      {/* Quick Helplines */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {helplines.map((h) => (
          <a
            key={h.name}
            href={h.href}
            target={h.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex flex-col gap-1 rounded-xl border border-void-border bg-white/[0.03] p-4 hover:border-signal/30 hover:bg-signal/5 transition-all group"
          >
            <p className="text-sm font-semibold text-white group-hover:text-signal-soft">
              {h.name}
            </p>
            <p className="text-lg font-bold text-signal">{h.number}</p>
            <p className="text-xs text-white/40">{h.desc}</p>
          </a>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-white">
          What To Do After a Scam
        </h2>
        {steps.map(
          ({ icon: Icon, color, border, iconColor, title, content, checklist, action }) => (
            <Card
              key={title}
              className={`border bg-gradient-to-br ${color} ${border} p-5`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-semibold text-white mb-2">
                    {title}
                  </h3>
                  {content && (
                    <p className="text-sm text-white/70 leading-relaxed mb-3">
                      {content}
                    </p>
                  )}
                  {checklist && (
                    <ul className="space-y-1.5 mb-3">
                      {checklist.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-white/70"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {action && (
                    <a
                      href={action.href}
                      target={
                        (action as { external?: boolean }).external
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-all"
                    >
                      {action.label}{" "}
                      {(action as { external?: boolean }).external && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          )
        )}
      </div>

      {/* What NOT to Do */}
      <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="h-6 w-6 text-red-400" />
          <h2 className="font-display text-lg font-semibold text-white">
            ⚠️ Critical: What You Should NEVER Do
          </h2>
        </div>
        <ul className="space-y-2">
          {doNots.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <span className="shrink-0 mt-0.5 text-red-400">✗</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Scan CTA */}
      <div className="rounded-2xl border border-signal/20 bg-gradient-to-r from-signal/10 to-intel/10 p-6 text-center">
        <p className="text-white font-medium mb-2">
          Received a suspicious message? Scan it first.
        </p>
        <p className="text-sm text-white/50 mb-4">
          Use RakshAI&apos;s AI Scan Detector to instantly check if a message,
          link, or image is a scam.
        </p>
        <Link
          href="/dashboard/scan"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-signal to-intel px-6 py-2.5 text-sm font-semibold text-white shadow-glow hover:brightness-110 transition-all"
        >
          Open Scan Detector
        </Link>
      </div>
    </div>
  );
}
