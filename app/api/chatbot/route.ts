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
    return jsonOk({
      reply:
        "RakshBot is currently offline (API key not configured). For cybercrime help, call 1930 or visit cybercrime.gov.in",
    });
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

    return jsonOk({ reply: response.text ?? "Sorry, I couldn't generate a response." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("quota") || msg.includes("429")) {
      return jsonOk({
        reply:
          "RakshBot is temporarily unavailable (quota exceeded). For urgent help, call the Cyber Crime Helpline: 1930 or visit cybercrime.gov.in",
      });
    }
    return jsonOk({
      reply: "RakshBot encountered an error. For cybercrime help, call 1930 or visit cybercrime.gov.in",
    });
  }
}
