"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Helper: Converts Western numerals and units into speakable Hindi strings.
 */
export function prepareTextForHindiSpeech(text: string): string {
  if (!text) return "";
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return text
    .replace(/₹/g, " रुपए ")
    .replace(/kg/gi, " किलोग्राम ")
    .replace(/km/gi, " किलोमीटर ")
    .replace(/\b(Order|ord)\b/gi, "ऑर्डर")
    .replace(/\b(Grade)\b/gi, "ग्रेड")
    .replace(/\d/g, (digit) => hindiDigits[parseInt(digit, 10)]);
}

export function useHindiVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hindiVoice, setHindiVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice =
        voices.find((v) => v.lang.includes("hi") || v.lang.includes("HI")) ||
        voices.find((v) => v.name.toLowerCase().includes("hindi"));

      if (selectedVoice) {
        setHindiVoice(selectedVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ─── Native Hindi Text-to-Speech Engine ───
  const speakHindi = useCallback(
    (rawText: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const sanitizedText = prepareTextForHindiSpeech(rawText);

      const utterance = new SpeechSynthesisUtterance(sanitizedText);
      utterance.lang = "hi-IN";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [hindiVoice]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // ─── Hindi Speech-to-Text Recognition ───
  const startHindiListening = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Hindi Voice Input requires Google Chrome or Microsoft Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, []);

  return {
    speakHindi,
    stopSpeaking,
    isSpeaking,
    startHindiListening,
    isListening,
    transcript,
    setTranscript,
  };
}