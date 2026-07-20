import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { jsonError, jsonOk } from "@/lib/api-utils";

const SYSTEM_PROMPT = `You are RakshBot, India's AI cybersecurity safety assistant built into RakshAI. You help Indian citizens understand and protect themselves from digital scams, cyber fraud, and online threats.

You specialize in:
- Explaining common Indian scams (UPI fraud, digital arrest, WhatsApp scams, lottery, job scams, OTP theft)
- Advising on what to do after being scammed
- Explaining how to file cybercrime complaints (1930 helpline, cybercrime.gov.in, CERT-In)
- Answering questions about phishing, identity theft, and online safety
- Explaining banking security, UPI safety, and social media fraud

Always be helpful, clear and concise. Use simple language. When relevant, mention specific Indian resources like:
- National Cyber Crime Helpline: 1930
- Cybercrime portal: cybercrime.gov.in
- CERT-In: cert-in.org.in

Do not scan messages — direct users to the Scan Detector for that. Keep replies under 200 words.`;

// Intelligent Offline Fallback Answer Bank with conversation context awareness
function getOfflineReply(message: string, history: { role: string; content: string }[]): string {
  const query = message.toLowerCase();

  const hasTopicInHistory = (keyword: string) => {
    return history.some(
      (h) =>
        h.role === "assistant" &&
        h.content.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // 1. Digital Arrest Scams
  if (
    query.includes("arrest") ||
    query.includes("police") ||
    query.includes("cbi") ||
    query.includes("customs") ||
    query.includes("threat")
  ) {
    if (hasTopicInHistory("digital arrest") || hasTopicInHistory("police")) {
      return (
        "⚠️ Just to remind you: Digital arrest is 100% fake. Law enforcement never arrests citizens over WhatsApp or video calls. " +
        "If you are currently on a call, hang up immediately. Do not share your screen or send any money. " +
        "If you have already sent money, call 1930 immediately to block the transaction."
      );
    }
    return (
      "🚨 A 'Digital Arrest' scam is when fraudsters impersonate police, CBI, or customs officials over video calls (WhatsApp/Skype). " +
      "They claim you are under 'digital arrest' for illegal packages or money laundering and demand money to clear your name.\n\n" +
      "⚠️ Remember: Indian law enforcement NEVER conducts arrests or investigations over video calls, and there is no such concept as 'digital arrest'. " +
      "Do not pay anything. Block them immediately and report on cybercrime.gov.in or call 1930."
    );
  }

  // 2. UPI and QR Code Fraud
  if (
    query.includes("upi") ||
    query.includes("qr") ||
    query.includes("scan") ||
    query.includes("payment") ||
    query.includes("receive")
  ) {
    if (hasTopicInHistory("collect requests") || hasTopicInHistory("upi pin")) {
      return (
        "⚠️ Remember: You NEVER need to enter your UPI PIN or scan a QR code to receive money. " +
        "If someone sent you a link or QR code saying 'scan this to get money', it is always a scam. " +
        "If you have already made a transaction, contact your bank's helpline immediately to freeze your account."
      );
    }
    return (
      "💸 UPI fraud typically involves scammers sending 'Collect Requests' or sharing QR codes, claiming you need to scan them or enter your UPI PIN to 'receive' money.\n\n" +
      "⚠️ Crucial Rule: You NEVER need to enter your UPI PIN or scan a QR code to receive money. " +
      "UPI PIN is only used for sending money. If you have been scammed, immediately contact your bank to freeze transactions and report to 1930."
    );
  }

  // 3. OTP and Password Safety
  if (
    query.includes("otp") ||
    query.includes("pin") ||
    query.includes("cvv") ||
    query.includes("password")
  ) {
    if (hasTopicInHistory("one-time passwords") || hasTopicInHistory("otp")) {
      return (
        "⚠️ Never share OTPs or banking passwords with anyone, even if they claim to be a bank manager, police officer, or support agent. " +
        "If you have already shared an OTP, log in to your bank app immediately to change your password and block your credit/debit card."
      );
    }
    return (
      "🔑 One-Time Passwords (OTPs) and banking PINs are personal security codes. " +
      "Scammers will impersonate bank staff, delivery agents, or customer support to ask for your OTP to verify your account or cancel an illegal charge.\n\n" +
      "⚠️ Rule: Never share OTPs, PINs, or CVVs with anyone. Banks will never ask for them. " +
      "If you shared one, block your card/account immediately via your banking app."
    );
  }

  // 4. Job and Investment Scams
  if (
    query.includes("job") ||
    query.includes("part-time") ||
    query.includes("part time") ||
    query.includes("task") ||
    query.includes("investment") ||
    query.includes("earn")
  ) {
    if (hasTopicInHistory("ponzi") || hasTopicInHistory("telegram")) {
      return (
        "⚠️ Be extremely careful: these Telegram task groups are scams designed to steal your money. " +
        "They will show fake profits in a dashboard but will block you once you try to withdraw. " +
        "Stop sending them any money. Real jobs never ask you to pay."
      );
    }
    return (
      "💼 Part-time job and fake investment scams offer high income for simple tasks (like liking YouTube videos or reviewing hotels) or promise guaranteed returns on crypto/stocks.\n\n" +
      "⚠️ Scammer Pattern: They ask you to join Telegram channels and deposit money to unlock higher earnings. " +
      "This is a Ponzi scam. Real jobs never require you to pay. Stop communicating with them immediately."
    );
  }

  // 5. Helpline and Cybercrime Complaints
  if (
    query.includes("helpline") ||
    query.includes("complaint") ||
    query.includes("number") ||
    query.includes("report") ||
    query.includes("cybercrime")
  ) {
    if (hasTopicInHistory("1930") || hasTopicInHistory("complaint")) {
      return (
        "📢 To file a complaint online: Go to cybercrime.gov.in, register with your mobile number, and upload transaction receipts or chat screenshots as evidence. " +
        "You can also call the 1930 helpline for real-time tracking of frozen funds."
      );
    }
    return (
      "🚨 If you faced cybercrime or digital fraud in India:\n" +
      "1. Call the National Cyber Crime Helpline at 1930 immediately (available 24/7).\n" +
      "2. Register an official complaint online at cybercrime.gov.in.\n" +
      "3. Contact your bank's fraud unit immediately to block beneficiary accounts and request a chargeback. " +
      "Reporting within 24 hours increases recovery chances."
    );
  }

  // 6. Conversational Greetings
  if (query.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/)) {
    return (
      "👋 Hello! I'm RakshBot, your digital safety assistant. " +
      "I can help you stay safe from online fraud. What cyber safety topic or scam would you like to learn about today?"
    );
  }

  // 7. Conversational fallbacks
  if (history.length > 0) {
    return (
      "I can help you protect yourself from online threats! " +
      "Feel free to ask about: 'Digital Arrest scams', 'UPI/QR code safety', 'OTP safety', 'How to file cyber complaints', or 'Job scams'."
    );
  }

  // Default fallback answer
  return (
    "👋 I'm RakshBot, your digital safety assistant! I can guide you on digital safety and cybersecurity rules.\n\n" +
    "Ask me about: 'Digital Arrest scams', 'UPI/QR code safety', 'OTP safety', 'How to file cyber complaints', or 'Job scams'.\n\n" +
    "For urgent help with a scam, call 1930 or visit cybercrime.gov.in."
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON.");
  }

  const { message, history = [] } = body as {
    message: string;
    history?: { role: string; content: string }[];
  };
  if (!message?.trim()) return jsonError("Message is required.");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return jsonOk({ reply: getOfflineReply(message, history) });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    return jsonOk({ reply: response.text ?? getOfflineReply(message, history) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("RakshBot API error:", msg);
    return jsonOk({ reply: getOfflineReply(message, history) });
  }
}
