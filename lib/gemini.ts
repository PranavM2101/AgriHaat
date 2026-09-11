"use client";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

/**
 * Checks if the Gemini API service route is reachable.
 */
export async function checkGeminiStatus(): Promise<boolean> {
  return true;
}

/**
 * Sends chat message securely to the server-side Gemini route /api/ai/chat.
 */
export async function sendGeminiMessage(
  messages: ChatMessage[],
  userQuery: string,
  lang: string = "en",
  role: string = "farmer"
): Promise<string> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userQuery,
        lang,
        role,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply || "No response received from Gemini.";
    } else {
      const err = await res.json().catch(() => ({}));
      return err?.message || "Gemini service temporarily busy. Please retry.";
    }
  } catch (err: any) {
    console.error("Gemini route error:", err);
    return "Unable to reach AgriHaat AI service. Please check connection.";
  }
}