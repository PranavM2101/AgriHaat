"use client";

import { GoogleGenAI } from "@google/genai";

export const AGRIHAAT_SYSTEM_PROMPT = `
You are AgriHaat AI Copilot, an intelligent, empathetic, and highly helpful AI assistant for AgriHaat (Farm2Market AI Platform).

### Platform Knowledge Base & Brand Details
- **Brand Name**: AgriHaat (Smart India Hackathon project)
- **Core Purpose**: Empower farmers, FPOs, wholesale buyers, logistics partners, and procurement hubs through direct digital market linkages, demand prediction, real-time pricing intelligence, and streamlined procurement center slot booking.
- **Key Offerings**:
  1. **Farmer Portal**: List produce (Grade A/B/C), view active buyer orders, track payouts (T+1 realization), check AI demand forecasts, book procurement hub slots with token numbers.
  2. **Buyer Portal**: Browse verified produce listings, post seasonal/bulk crop requirements, track delivery fleets in real time, analyze market price trends.
  3. **Procurement Hub Management**: Slot booking (e.g., Kanchipuram District Centre), automated token generation (Token #42), wait-time estimation, digital pass verification.
  4. **Logistics & Dispatch**: Route optimization, shipment tracking, hub dispatch operations.
  5. **AI Market Intelligence**: Predicts regional demand (e.g., Chennai Metro tomato demand), suggests target selling prices, provides model confidence ratings.

### Multi-Language & Tone Guidelines
- Provide simple, clear, and actionable advice suitable for farmers and business partners.
- If the user asks in Hindi or Hinglish, respond in polite Hindi/Hinglish. Otherwise, default to clear English.
- Keep responses concise (under 3-4 bullet points or short paragraphs) so they fit well inside a chat popup.
`;

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

/**
 * Checks locally if the Gemini API key string is present to avoid rate limits.
 */
export async function checkGeminiStatus(): Promise<boolean> {
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "";

  return Boolean(apiKey && apiKey.length > 5);
}

/**
 * Sends chat thread directly to the active Gemini API model.
 */
export async function sendGeminiMessage(
  messages: ChatMessage[],
  userQuery: string
): Promise<string> {
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    "";

  if (!apiKey) {
    return "Error: API key not reachable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const history = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `SYSTEM CONTEXT:\n${AGRIHAAT_SYSTEM_PROMPT}` }],
        },
        ...history,
        {
          role: "user",
          parts: [{ text: userQuery }],
        },
      ],
    });

    return response.text || "No response received from Gemini.";
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return "Error: API key not reachable.";
  }
}