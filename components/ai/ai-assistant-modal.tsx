"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, CornerDownRight, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/site/language-context";
import { useAuth } from "@/components/auth/auth-context";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SAMPLE_QUERIES = [
  { q: "Chennai mein tomato demand kaisi hai?", role: "farmer" },
  { q: "Mujhe ₹32/kg par list karna chahiye?", role: "farmer" },
  { q: "2,000 kg tomato kaha se milega?", role: "buyer" },
  { q: "Kanchipuram centre par next slot kab milega?", role: "farmer" },
];

export function AIAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        lang === "hi"
          ? `नमस्ते ${user?.name ? user.name.split(" ")[0] : ""}! मैं AgriHaat AI सहायक हूँ। आप मुझसे मंडी भाव, मांग का पूर्वानुमान, लॉजिस्टिक्स रूट, या खरीद केंद्र स्लॉट के बारे में कुछ भी पूछ सकते हैं।`
          : `Namaste ${user?.name ? user.name.split(" ")[0] : ""}! I am the AgriHaat AI Copilot powered by Google Gemini. Ask me about mandi trends, demand forecasts, supply aggregation, or procurement centre slots.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      // Call server-side Google Gemini endpoint with live user context
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          lang,
          role: user?.role || "farmer",
          userName: user?.name || "Ramesh Kumar",
          organization: user?.organization || "ABC FPO",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
          setLoading(false);
          return;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `⚠️ Gemini AI Notice: ${errData.message || "Unable to reach Google Gemini live service. Please check API key configuration."}`,
          },
        ]);
        setLoading(false);
        return;
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Network connection error. Unable to communicate with AgriHaat AI service.",
        },
      ]);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-[#E2E7E2] shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[620px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E7E2] px-5 py-4 bg-[#172019] text-white">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#16803A] text-white shadow-xs">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-semibold">AgriHaat Copilot</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#16803A]/20 border border-[#16803A]/40 px-2 py-0.5 text-[9px] font-bold text-[#4ade80]">
                  <span className="size-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                  Gemini 3.5 Flash Lite
                </span>
              </div>
              <p className="text-[11px] text-gray-300">Grounded Agricultural AI & Mandi Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm bg-white">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[#16803A] text-white text-[10px] font-bold shadow-xs">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#16803A] text-white rounded-br-xs shadow-xs"
                    : "bg-[#FAFAF7] text-[#172019] border border-[#E2E7E2] rounded-bl-xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-[#16803A] pl-9 py-1">
              <div className="size-2 rounded-full bg-[#16803A] animate-ping" />
              <span className="font-semibold">Querying Gemini API & Mandi Forecasting Engine...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Suggestions */}
        <div className="px-4 py-2 border-t border-[#E2E7E2] bg-[#FAFAF7] overflow-x-auto no-scrollbar flex gap-2">
          {SAMPLE_QUERIES.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sq.q)}
              className="shrink-0 rounded-full border border-[#E2E7E2] bg-white px-3 py-1 text-[11px] font-medium text-[#172019] hover:bg-[#EEF7EF] hover:border-[#16803A] transition"
            >
              <CornerDownRight className="size-2.5 inline mr-1 text-[#16803A]" />
              {sq.q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-[#E2E7E2] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "hi" ? "कृषि, मांग, भाव या स्लॉट के बारे में पूछें..." : "Ask about prices, demand, routes, or slots..."}
              className="flex-1 rounded-xl border border-[#E2E7E2] px-3.5 py-2.5 text-xs outline-none focus:border-[#16803A] bg-[#FAFAF7]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="grid size-9 place-items-center rounded-xl bg-[#16803A] text-white disabled:opacity-40 hover:bg-[#16803A]/90 transition"
              aria-label="Send message"
            >
              <Send className="size-3.5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#687D6B] px-1">
            <span className="flex items-center gap-1 font-medium text-[#16803A]">
              <Zap className="size-3" /> Live Agricultural Knowledge Graph
            </span>
            <span>Problem Statement 26033/26032</span>
          </div>
        </div>
      </div>
    </div>
  );
}
