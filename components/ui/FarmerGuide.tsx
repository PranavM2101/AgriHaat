"use client";

import { useState } from "react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

export default function FarmerGuide() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const { speak, stop, isSpeaking } = useTextToSpeech();

  // Separate content dictionaries
  const content = {
    hi: {
      instruction: "अपनी फसल बेचने के लिए फसल का नाम और कुल मात्रा दर्ज करें।",
      btnLabel: "सुनिए",
      stopLabel: "रोकिए",
    },
    en: {
      instruction: "To sell your crop, enter the crop name and total quantity.",
      btnLabel: "Listen",
      stopLabel: "Stop",
    },
  };

  const currentText = content[lang].instruction;

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white max-w-md">
      {/* Language Toggle Dropdown / Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { stop(); setLang("hi"); }}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            lang === "hi" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          हिंदी
        </button>
        <button
          onClick={() => { stop(); setLang("en"); }}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            lang === "en" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          English
        </button>
      </div>

      {/* Main Instruction Display */}
      <p className="text-gray-800 text-lg mb-4">{currentText}</p>

      {/* Dynamic Voiceover Button */}
      <button
        onClick={() => (isSpeaking ? stop() : speak(currentText, lang))}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        <span>🔊</span>
        <span>{isSpeaking ? content[lang].stopLabel : content[lang].btnLabel}</span>
      </button>
    </div>
  );
}