import { ScanForm } from "@/components/scan/scan-form";

export default function ScanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">
          AI Scam Detector
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Paste a message or URL, or upload a screenshot/PDF, to check for phishing,
          fake UPI requests, digital arrest scams, and more.
        </p>
      </div>
      <ScanForm />
    </div>
  );
}
