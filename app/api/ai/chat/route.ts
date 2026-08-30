import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      message,
      lang = "en",
      role = "farmer",
      userName = "Ramesh Kumar",
      organization = "ABC Farmer Producer Organization",
    } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

    // System prompt grounding the Gemini model in AgriHaat platform data
    const SYSTEM_PROMPT = `You are AgriHaat Copilot, an official agricultural AI intelligence system for India (Smart India Hackathon - Ministry of Consumer Affairs Problem Statement 26033/26032).
You are communicating directly with:
- Name: ${userName}
- Persona Role: ${role.toUpperCase()}
- Organization: ${organization}
- Preferred Language: ${lang === "hi" ? "Hindi (हिंदी)" : "English"}

AgriHaat Operational Knowledge & Live Grounding:
1. DIRECT MARKETPLACE (PS 26033):
   - Connects farmers/FPOs directly with restaurants, supermarkets, and institutional bulk buyers.
   - Eliminates commission agents and intermediaries, boosting farmer revenue by 18-25%.
   - Price Realization: Farmer Net Take-Home = Buyer Gross Listing - (Logistics Fee ~₹3/kg + Platform Fee ~₹1/kg).
   - Example: Buyer pays ₹40/kg for Grade A Tomatoes -> Farmer receives ₹36/kg guaranteed.
2. PROCUREMENT QUEUE MANAGEMENT (PS 26032):
   - Kanchipuram District Centre currently operates digital token slots (e.g. Token #42).
   - Electronic weighbridge QC and direct DBT bank settlement.
3. LOGISTICS AGGREGATION:
   - Coordinated multi-stop routes aggregate nearby farm clusters (Kanchipuram, Walajabad) into single delivery runs (124 km route, saving 18 km per dispatch).
   - Reefer temperature tracking (+12°C to +15°C).

Persona Guidelines:
- If user is a FARMER: Advise on crop planning, market listing prices, harvest timing, procurement slot booking, and DBT payouts.
- If user is a BUYER: Advise on bulk sourcing, verified seller inventory, quality grades (Grade A/B/Bulk), and dispatch timelines.
- If user is LOGISTICS/HUB: Advise on multi-stop routing, payload capacity, and cold-chain compliance.
- If user is ADMIN: Advise on platform audit logs, user verification, and compliance statistics.

Response Style:
- Respond naturally, conversationally, and helpfully to greetings ("hi", "hello", "namaste") by acknowledging the user's role and organization.
- For agricultural questions (crops, pricing, weed, fertilizer, demand), give practical, grounded, honest advice.
- For Hindi queries, reply in fluent, respectful Hindi. For English queries, reply in clear, professional English.
- Keep responses concise, structured, and under 150 words.`;

    const modelsToTry = [primaryModel, "gemini-3.5-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite"];
    let lastError = "";

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.6,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidate = data?.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;

          if (text && text.trim().length > 0) {
            return NextResponse.json({
              success: true,
              reply: text.trim(),
              provider: `Google Gemini (${model})`,
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          const errBody = await geminiRes.json().catch(() => ({}));
          lastError = errBody?.error?.message || `HTTP ${geminiRes.status} ${geminiRes.statusText}`;
          console.warn(`Model ${model} returned error: ${lastError}`);
        }
      } catch (err: any) {
        lastError = err?.message || "Network fetch failed";
        console.warn(`Failed calling ${model}:`, lastError);
      }
    }

    // If all model calls failed, return an authentic, transparent error
    return NextResponse.json(
      {
        error: "Gemini API Unreachable",
        message: `Google Gemini API returned an error: ${lastError || "Invalid response structure"}. Please check API key validity and model permissions.`,
      },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message || "An unexpected error occurred in AI chat handler.",
      },
      { status: 500 }
    );
  }
}

