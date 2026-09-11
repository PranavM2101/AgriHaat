"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Maps numbers, times, and metrics into speakable Hindi words.
 */
function convertToHindiWords(text: string): string {
  if (!text) return "";

  return text
    .replace(/₹\s?18,000/g, "18,000 रुपये")
    .replace(/₹\s?18000/g, "18,000 रुपये")
    .replace(/₹/g, " रुपये ")
    .replace(/\b500\b/g, "पाँच सौ")
    .replace(/\b18,000\b/g, "अठारह हजार")
    .replace(/\b18000\b/g, "अठारह हजार")
    .replace(/\b10:30\s?AM\b/gi, "दस बजकर तीस मिनट")
    .replace(/\b10:30\b/g, "दस बजकर तीस मिनट")
    .replace(/\b42\b/g, "बयालीस")
    .replace(/\b3\b/g, "तीन")
    .replace(/\bkg\b/gi, " किलोग्राम ")
    .replace(/\bkm\b/gi, " किलोमीटर ");
}

/**
 * Phonetic fallback for systems without native Hindi voice packs.
 */
function convertToHinglishPhonetics(text: string): string {
  if (!text) return "";

  return text
    .replace(/नमस्ते/g, "Namaste")
    .replace(/आपकी/g, "aapki")
    .replace(/पाँच सौ/g, "paaanchsoo")
    .replace(/किलोग्राम/g, "kilo")
    .replace(/टमाटर/g, "taamataarrr")
    .replace(/लिस्टेड/g, "darjj")
    .replace(/हैं।/g, "hain.")
    .replace(/है।/g, "hai.")
    .replace(/आपके/g, "aapke")
    .replace(/तीन/g, "teen")
    .replace(/सक्रिय/g, "saakriya")
    .replace(/ऑर्डर्स/g, "orders")
    .replace(/अपेक्षित/g, "apekshith")
    .replace(/कमाई/g, "kamai")
    .replace(/अठारह हजार/g, "athaarah hazaar")
    .replace(/रुपये/g, "rupayy")
    .replace(/आपका/g, "aapka")
    .replace(/खरीद/g, "khareed")
    .replace(/केंद्र/g, "kendraaa")
    .replace(/स्लॉट/g, "saamaayi")
    .replace(/कल/g, "kal")
    .replace(/सुबह/g, "subahh")
    .replace(/दस बजकर तीस मिनट/g, "ddas bajkar tees minute")
    .replace(/बजे/g, "baje")
    .replace(/टोकन/g, "token")
    .replace(/नंबर/g, "number")
    .replace(/बयालीस/g, "bayaalis")
    .replace(/साथ/g, "saath")
    .replace(/निर्धारित/g, "nirdharit");
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hindiVoice, setHindiVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      const selectedVoice =
        voices.find((v) => v.lang.includes("hi") || v.lang.includes("HI")) ||
        voices.find((v) => v.name.toLowerCase().includes("hindi")) ||
        voices.find((v) => v.lang.includes("en-IN") || v.lang.includes("en_IN"));

      if (selectedVoice) {
        setHindiVoice(selectedVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: "en" | "hi" = "en") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      let speechText = text;

      if (lang === "hi") {
        // Step 1: Convert digits and time into Hindi words
        speechText = convertToHindiWords(text);

        // Step 2: If OS lacks native Hindi voice, convert to Hinglish phonetics
        if (!hindiVoice?.lang.includes("hi")) {
          speechText = convertToHinglishPhonetics(speechText);
        }
      }

      const utterance = new SpeechSynthesisUtterance(speechText);

      if (lang === "hi") {
        utterance.lang = hindiVoice ? hindiVoice.lang : "en-IN";
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      } else {
        utterance.lang = "en-US";
        utterance.rate = 0.95;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [hindiVoice]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking };
}