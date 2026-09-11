"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/site/language-context";
import { sendGeminiMessage, checkGeminiStatus, ChatMessage } from "@/lib/gemini";

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPopup({ isOpen, onClose }: AIChatPopupProps) {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "active" | "error">("checking");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check connection status when the popup opens
  useEffect(() => {
    if (isOpen) {
      setApiStatus("checking");
      checkGeminiStatus().then((isReachable) => {
        setApiStatus(isReachable ? "active" : "error");
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMsg },
    ];
    setMessages(updatedHistory);
    setLoading(true);

    const aiReply = await sendGeminiMessage(messages, userMsg);

    // Update indicator status if an error occurs
    if (aiReply === "Error: API key not reachable.") {
      setApiStatus("error");
    } else {
      setApiStatus("active");
    }

    setMessages([...updatedHistory, { role: "assistant", content: aiReply }]);
    setLoading(false);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-[#E2E7E2] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-[#16803A] text-white p-3.5 px-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-white/10 text-white border border-white/20">
            <Sparkles className="size-4 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight">
              AgriHaat AI Copilot
            </h3>
            <p className="text-[10px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
              {/* Status Dot Indicator */}
              <span
                className={`size-2 rounded-full transition-colors duration-300 ${
                  apiStatus === "active"
                    ? "bg-emerald-400 animate-pulse"
                    : apiStatus === "error"
                    ? "bg-red-500"
                    : "bg-amber-300 animate-ping"
                }`}
              />
              <span>
                {apiStatus === "active" && "Gemini API Active"}
                {apiStatus === "error" && "API Error"}
                {apiStatus === "checking" && "Connecting..."}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
            title="Clear Chat"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF7] text-xs"
      >
        {messages.length === 0 && (
          <div className="text-center py-6 px-4 space-y-3">
            <div className="size-10 rounded-full bg-[#EEF7EF] border border-[#16803A]/20 text-[#16803A] grid place-items-center mx-auto">
              <Bot className="size-5" />
            </div>
            <p className="font-semibold text-[#172019]">
              {lang === "hi"
                ? "नमस्ते! मैं AgriHaat Gemini AI हूँ। मैं आपकी क्या मदद कर सकता हूँ?"
                : "Hello! I am AgriHaat Gemini AI Copilot. How can I help you today?"}
            </p>
            <div className="grid gap-1.5 pt-2">
              <button
                type="button"
                onClick={() =>
                  setInput(
                    lang === "hi"
                      ? "मुझे ₹32/kg पर लिस्ट करना चाहिए?"
                      : "What is the tomato price forecast?"
                  )
                }
                className="text-left p-2 rounded-xl border border-[#E2E7E2] bg-white hover:bg-[#EEF7EF] hover:border-[#16803A]/30 text-[11px] text-[#687D6B] hover:text-[#172019] transition"
              >
                💡{" "}
                {lang === "hi"
                  ? "मुझे ₹32/kg पर लिस्ट करना चाहिए?"
                  : "What is the tomato price forecast?"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInput(
                    lang === "hi"
                      ? "खरीद केंद्र में अगला स्लॉट कब मिलेगा?"
                      : "How to book a procurement hub slot?"
                  )
                }
                className="text-left p-2 rounded-xl border border-[#E2E7E2] bg-white hover:bg-[#EEF7EF] hover:border-[#16803A]/30 text-[11px] text-[#687D6B] hover:text-[#172019] transition"
              >
                💡{" "}
                {lang === "hi"
                  ? "खरीद केंद्र में अगला स्लॉट कब मिलेगा?"
                  : "How to book a procurement hub slot?"}
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`size-6 rounded-full grid place-items-center shrink-0 text-[10px] ${
                msg.role === "user"
                  ? "bg-[#172019] text-white"
                  : "bg-[#16803A] text-white"
              }`}
            >
              {msg.role === "user" ? (
                <User className="size-3.5" />
              ) : (
                <Bot className="size-3.5" />
              )}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#16803A] text-white rounded-tr-none font-medium"
                  : msg.content === "Error: API key not reachable."
                  ? "bg-red-50 border border-red-200 text-red-700 rounded-tl-none font-medium shadow-2xs"
                  : "bg-white border border-[#E2E7E2] text-[#172019] rounded-tl-none shadow-2xs whitespace-pre-line"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[#687D6B] p-2 bg-white rounded-xl border border-[#E2E7E2] w-max shadow-2xs">
            <Loader2 className="size-3.5 animate-spin text-[#16803A]" />
            <span className="text-[11px]">Asking Gemini...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-2.5 bg-white border-t border-[#E2E7E2] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "hi" ? "सवाल पूछें..." : "Ask Gemini a question..."}
          className="flex-1 bg-[#FAFAF7] border border-[#E2E7E2] rounded-full px-3.5 py-2 text-xs text-[#172019] focus:outline-none focus:border-[#16803A] focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="grid size-8.5 place-items-center rounded-full bg-[#16803A] text-white disabled:opacity-40 hover:bg-[#16803A]/90 transition shrink-0"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  );
}