/**
 * Lightweight, deterministic heuristic signal extraction.
 *
 * These signals are NOT the final verdict — they are fed into the Gemini
 * prompt as supporting evidence (so the model reasons over concrete,
 * checkable signals rather than vibes), and are also used as a safe
 * offline fallback if GEMINI_API_KEY is missing/invalid so the feature
 * degrades gracefully instead of silently faking a result.
 */

export interface HeuristicSignal {
  id: string;
  label: string;
  weight: number; // 0-1 contribution toward "scam"
  matched: boolean;
  detail: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)|(\bwww\.[^\s]+)/gi;
const SHORTENER_DOMAINS =
  /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rebrand\.ly|shorturl\.at)/i;
const SUSPICIOUS_TLDS = /\.(xyz|top|zip|click|country|gq|tk|ml|cf|work|loan)(\/|$)/i;
const IP_HOST_REGEX = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;
const HOMOGLYPH_BRAND_REGEX =
  /(paypa1|amaz0n|g00gle|micros0ft|netfl1x|app1e|sbi[-_]?bank|hdfc[-_]?secure|icici[-_]?verify)/i;

const UPI_REGEX = /\b[\w.\-]{2,256}@(ok(hdfcbank|icici|axis|sbi)|ybl|paytm|apl|ibl|axl|upi)\b/i;
const UPI_KEYWORDS =
  /(upi\s*pin|scan\s*(this\s*)?qr|collect\s*request|refund\s*request|received\s*(rs\.?|₹)|cashback\s*claim|kyc\s*update|otp\s*share|share\s*(your\s*)?otp)/i;

const URGENCY_KEYWORDS =
  /(act\s*now|urgent(ly)?|immediately|within\s*24\s*hours|account\s*(will\s*be\s*)?(blocked|suspended|frozen|deactivated)|last\s*warning|final\s*notice|failure\s*to\s*comply|legal\s*action)/i;

const DIGITAL_ARREST_KEYWORDS =
  /(digital\s*arrest|cbi\s*officer|narcotics\s*department|trai\s*(notice|suspension)|your\s*(aadhaar|mobile\s*number)\s*(is\s*)?(linked|involved)\s*in|money\s*laundering\s*case|skype\s*(interrogation|call)|do\s*not\s*disconnect\s*(this\s*)?call|video\s*call\s*investigation)/i;

const LOTTERY_PRIZE_KEYWORDS =
  /(you\s*(have\s*)?won|lucky\s*draw|lottery\s*winner|claim\s*your\s*prize|free\s*gift\s*card|selected\s*for\s*a\s*reward)/i;

const CREDENTIAL_HARVEST_KEYWORDS =
  /(verify\s*your\s*account|confirm\s*your\s*(identity|details)|update\s*your\s*(password|billing)|login\s*to\s*avoid|re[- ]?activate\s*your\s*account|suspicious\s*login\s*attempt)/i;

const JOB_INVESTMENT_SCAM_KEYWORDS =
  /(work\s*from\s*home\s*job|earn\s*(₹|rs\.?)?\s*\d{3,}\s*per\s*day|investment\s*(plan|scheme)\s*guarantee|double\s*your\s*money|crypto\s*trading\s*bot|part[- ]?time\s*job\s*offer)/i;

const IMPERSONATION_KEYWORDS =
  /(dear\s*customer|this\s*is\s*(from\s*)?(bank|police|income\s*tax|customs)\s*department|official\s*(notice|communication)\s*from)/i;

const GENERIC_AI_TEXT_MARKERS =
  /(as an ai language model|i cannot verify|note: this is a simulated|disclaimer: for educational purposes)/i;

export function extractUrls(text: string): string[] {
  return Array.from(new Set(text.match(URL_REGEX) ?? []));
}

export function analyzeHeuristics(rawInput: string): {
  signals: HeuristicSignal[];
  score: number; // 0-100 aggregate heuristic scam score
  urls: string[];
} {
  const input = rawInput.trim();
  const urls = extractUrls(input);

  const checks: Omit<HeuristicSignal, "matched">[] = [
    { id: "shortener", label: "URL shortener detected", weight: 0.35, detail: "" },
    { id: "suspicious_tld", label: "Suspicious/free top-level domain", weight: 0.3, detail: "" },
    { id: "ip_host", label: "Raw IP address used instead of domain", weight: 0.45, detail: "" },
    { id: "homoglyph", label: "Brand name look-alike / typosquat", weight: 0.5, detail: "" },
    { id: "upi_handle", label: "UPI handle present in message", weight: 0.2, detail: "" },
    { id: "upi_keywords", label: "UPI/payment-request language", weight: 0.3, detail: "" },
    { id: "urgency", label: "Artificial urgency / threat language", weight: 0.35, detail: "" },
    { id: "digital_arrest", label: "Digital arrest scam script markers", weight: 0.6, detail: "" },
    { id: "lottery", label: "Lottery / prize-claim bait", weight: 0.4, detail: "" },
    { id: "credential_harvest", label: "Credential-harvesting phishing phrasing", weight: 0.4, detail: "" },
    { id: "job_investment", label: "Job/investment scam phrasing", weight: 0.35, detail: "" },
    { id: "impersonation", label: "Authority/bank impersonation phrasing", weight: 0.3, detail: "" },
    { id: "ai_marker", label: "AI-generated boilerplate markers", weight: 0.15, detail: "" },
  ];

  const patternMap: Record<string, RegExp> = {
    shortener: SHORTENER_DOMAINS,
    suspicious_tld: SUSPICIOUS_TLDS,
    ip_host: IP_HOST_REGEX,
    homoglyph: HOMOGLYPH_BRAND_REGEX,
    upi_handle: UPI_REGEX,
    upi_keywords: UPI_KEYWORDS,
    urgency: URGENCY_KEYWORDS,
    digital_arrest: DIGITAL_ARREST_KEYWORDS,
    lottery: LOTTERY_PRIZE_KEYWORDS,
    credential_harvest: CREDENTIAL_HARVEST_KEYWORDS,
    job_investment: JOB_INVESTMENT_SCAM_KEYWORDS,
    impersonation: IMPERSONATION_KEYWORDS,
    ai_marker: GENERIC_AI_TEXT_MARKERS,
  };

  const signals: HeuristicSignal[] = checks.map((c) => {
    const pattern = patternMap[c.id];
    const match = pattern.exec(input);
    return {
      ...c,
      matched: !!match,
      detail: match ? `Matched: "${match[0]}"` : "No match",
    };
  });

  const maxScore = signals.reduce((sum, s) => sum + s.weight, 0);
  const rawScore = signals.reduce((sum, s) => sum + (s.matched ? s.weight : 0), 0);
  const score = Math.round((rawScore / maxScore) * 100);

  return { signals, score, urls };
}
