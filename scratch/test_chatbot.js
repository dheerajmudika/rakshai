const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({ path: "C:/Users/mudik/Desktop/rakshai/.env" });

const SYSTEM_PROMPT = `You are RakshBot, India's AI cybersecurity safety assistant.`;

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? "FOUND (starts with " + apiKey.slice(0, 10) + ")" : "NOT FOUND");

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // In SDK version 0.1+, the format of contents is slightly different, or let's verify if array works
    const contents = [
      { role: "user", parts: [{ text: "Hello, what is a digital arrest scam?" }] }
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

    console.log("Success! Reply:", response.text);
  } catch (err) {
    console.error("Failed call:", err);
  }
}

test();
