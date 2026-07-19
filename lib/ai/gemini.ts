import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { analyzeHeuristics, extractUrls } from "./heuristics";

export const ScanVerdictSchema = z.enum(["scam", "safe"]);
export const RiskLevelSchema = z.enum(["low", "medium", "high", "critical"]);

export const ScamCategorySchema = z.enum([
  "phishing_url",
  "fake_upi_payment",
  "whatsapp_scam",
  "sms_phishing",
  "email_phishing",
  "ai_generated_scam_text",
  "digital_arrest_scam",
  "lottery_prize_scam",
  "job_investment_scam",
  "impersonation_scam",
  "none",
]);

export const DetectionResultSchema = z.object({
  verdict: ScanVerdictSchema,
  confidence: z.number().min(0).max(100),
  riskLevel: RiskLevelSchema,
  category: ScamCategorySchema,
  explanation: z.string().min(1),
  recommendedAction: z.string().min(1),
});

export type DetectionResult = z.infer<typeof DetectionResultSchema> & {
  source: "gemini" | "heuristic-fallback";
  heuristicScore: number;
  matchedSignals: string[];
  urlsFound: string[];
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verdict: { type: Type.STRING, enum: ["scam", "safe"] },
    confidence: { type: Type.NUMBER },
    riskLevel: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
    category: {
      type: Type.STRING,
      enum: [
        "phishing_url",
        "fake_upi_payment",
        "whatsapp_scam",
        "sms_phishing",
        "email_phishing",
        "ai_generated_scam_text",
        "digital_arrest_scam",
        "lottery_prize_scam",
        "job_investment_scam",
        "impersonation_scam",
        "none",
      ],
    },
    explanation: { type: Type.STRING },
    recommendedAction: { type: Type.STRING },
  },
  required: [
    "verdict",
    "confidence",
    "riskLevel",
    "category",
    "explanation",
    "recommendedAction",
  ],
};

const SYSTEM_INSTRUCTION = `You are RakshAI's scam-detection engine, built to protect Indian citizens from
digital fraud. You analyze arbitrary user-submitted text — SMS, WhatsApp
messages, emails, URLs, or OCR-extracted text from screenshots/PDFs — and
determine whether it is a scam.

You must specifically recognize these scam categories common in India:
- phishing_url: fake/lookalike links designed to steal credentials
- fake_upi_payment: fraudulent UPI collect requests, fake payment confirmations, refund scams
- whatsapp_scam: WhatsApp-specific fraud (fake job offers, "Hi Mom/Dad" scams, investment groups)
- sms_phishing: SMS-based phishing (fake delivery notices, fake bank alerts)
- email_phishing: email-based credential/financial phishing
- ai_generated_scam_text: scam text that appears machine-generated at scale
- digital_arrest_scam: impersonating CBI/police/customs, threatening "digital arrest", demanding money to avoid arrest
- lottery_prize_scam: fake lottery/prize/lucky draw winnings
- job_investment_scam: fake work-from-home jobs, guaranteed-return investment schemes
- impersonation_scam: impersonating banks, government departments, or companies
- none: message is legitimate/safe

Be precise and evidence-based. Do not just say something is a scam because it
mentions money or a link — evaluate real signals: urgency/threat language,
mismatched or shortened URLs, requests for OTP/PIN/UPI PIN, impersonation of
authority, too-good-to-be-true offers, poor grammar typical of mass scam
campaigns, and pressure to act secretly or immediately.

Always respond with strict JSON matching the provided schema only.`;

function buildPrompt(input: string): string {
  const { signals, score, urls } = analyzeHeuristics(input);
  const matched = signals.filter((s) => s.matched);
  return `INPUT TO ANALYZE:
"""
${input.slice(0, 6000)}
"""

DETECTED URLS: ${urls.length ? urls.join(", ") : "none"}

AUTOMATED HEURISTIC SIGNALS (supporting evidence only — use your own judgement,
these can both under- and over-fire):
${
  matched.length
    ? matched.map((s) => `- ${s.label}: ${s.detail}`).join("\n")
    : "- none of the automated pattern checks fired"
}
Heuristic pre-score: ${score}/100 (purely rule-based, informational only)

Analyze the input above and return your verdict as JSON.`;
}

let client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

function heuristicFallback(input: string, reason: string): DetectionResult {
  const { signals, score, urls } = analyzeHeuristics(input);
  const matched = signals.filter((s) => s.matched);
  // A single high-weight signal (e.g. a digital-arrest scam marker, weight
  // 0.6) or several moderate signals together should already be enough to
  // flag as a scam even before hitting a high aggregate score.
  const strongSignalHit = matched.some((s) => s.weight >= 0.4);
  const verdict: DetectionResult["verdict"] =
    score >= 15 || strongSignalHit || matched.length >= 2 ? "scam" : "safe";
  const riskLevel: DetectionResult["riskLevel"] =
    score >= 55 ? "critical" : score >= 35 ? "high" : score >= 15 ? "medium" : "low";

  let category: DetectionResult["category"] = "none";
  if (matched.some((s) => s.id === "digital_arrest")) category = "digital_arrest_scam";
  else if (matched.some((s) => s.id === "upi_handle" || s.id === "upi_keywords"))
    category = "fake_upi_payment";
  else if (matched.some((s) => s.id === "lottery")) category = "lottery_prize_scam";
  else if (matched.some((s) => s.id === "job_investment")) category = "job_investment_scam";
  else if (matched.some((s) => s.id === "credential_harvest")) category = "phishing_url";
  else if (matched.some((s) => s.id === "impersonation")) category = "impersonation_scam";
  else if (urls.length && matched.some((s) => ["shortener", "suspicious_tld", "ip_host", "homoglyph"].includes(s.id)))
    category = "phishing_url";

  return {
    verdict,
    confidence: Math.max(50, Math.min(95, score)),
    riskLevel,
    category,
    explanation:
      `${reason} Falling back to RakshAI's offline rule-based analyzer. ` +
      (matched.length
        ? `It flagged ${matched.length} suspicious signal(s): ${matched
            .map((m) => m.label)
            .join(", ")}.`
        : `It did not find strong rule-based scam indicators, but this is a lower-confidence, non-AI result.`),
    recommendedAction:
      verdict === "scam"
        ? "Do not click any links, share OTPs/PINs, or make payments. Verify independently through official channels and report to cybercrime.gov.in or call 1930."
        : "No strong scam indicators found by the offline analyzer. Still avoid sharing OTPs or personal/financial details with unverified senders.",
    source: "heuristic-fallback",
    heuristicScore: score,
    matchedSignals: matched.map((m) => m.label),
    urlsFound: urls,
  };
}

export async function detectScam(input: string): Promise<DetectionResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Input text is empty.");
  }

  const ai = getClient();
  const { signals, score, urls } = analyzeHeuristics(trimmed);

  if (!ai) {
    return heuristicFallback(
      trimmed,
      "GEMINI_API_KEY is not configured on the server."
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(trimmed),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini.");

    const parsed = DetectionResultSchema.parse(JSON.parse(text));
    const matched = signals.filter((s) => s.matched);

    return {
      ...parsed,
      source: "gemini",
      heuristicScore: score,
      matchedSignals: matched.map((m) => m.label),
      urlsFound: urls,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Gemini API error.";
    return heuristicFallback(
      trimmed,
      `Gemini API request failed (${message}).`
    );
  }
}

export { extractUrls };
