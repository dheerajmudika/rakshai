import { Badge } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  phishing_url: "Phishing URL",
  fake_upi_payment: "Fake UPI Payment",
  whatsapp_scam: "WhatsApp Scam",
  sms_phishing: "SMS Phishing",
  email_phishing: "Email Phishing",
  ai_generated_scam_text: "AI-Generated Scam Text",
  digital_arrest_scam: "Digital Arrest Scam",
  lottery_prize_scam: "Lottery / Prize Scam",
  job_investment_scam: "Job / Investment Scam",
  impersonation_scam: "Impersonation Scam",
  threat_or_harassment: "Threat / Harassment",
  none: "No Category",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function VerdictBadge({ verdict }: { verdict: "scam" | "safe" }) {
  if (verdict === "scam") {
    return (
      <Badge tone="critical">
        <ShieldAlert className="h-3.5 w-3.5" /> Scam Detected
      </Badge>
    );
  }
  return (
    <Badge tone="safe">
      <ShieldCheck className="h-3.5 w-3.5" /> Safe
    </Badge>
  );
}

export function RiskBadge({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const tone =
    level === "critical" ? "critical" : level === "high" ? "critical" : level === "medium" ? "intel" : "safe";
  return (
    <Badge tone={tone as "critical" | "intel" | "safe"}>
      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
    </Badge>
  );
}
