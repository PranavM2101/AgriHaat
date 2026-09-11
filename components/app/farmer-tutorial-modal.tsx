"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, CheckCircle2, Sprout, Building2, Wallet, Volume2 } from "lucide-react";
import { useLanguage } from "@/components/site/language-context";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FarmerTutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const { lang } = useLanguage();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: Sprout,
      titleEn: "Step 1: List Your Crop",
      titleHi: "चरण 1: अपनी फसल दर्ज करें",
      descEn: "Select your crop type, quantity in kg, and set your target selling price. You can also use the voice microphone to speak in Hindi or Tamil.",
      descHi: "अपनी फसल का प्रकार, किलोग्राम में मात्रा चुनें और अपना लक्ष्य विक्रय मूल्य तय करें। आप हिंदी या तमिल में बोलने के लिए माइक का उपयोग भी कर सकते हैं।",
    },
    {
      icon: Building2,
      titleEn: "Step 2: Choose APMC / Collection Hub",
      titleHi: "चरण 2: खरीद केंद्र का चयन करें",
      descEn: "View interactive maps to find the nearest procurement center with the shortest wait time. Reserve your drop-off token slot directly.",
      descHi: "सबसे कम प्रतीक्षा समय वाले नजदीकी खरीद केंद्र को खोजने के लिए इंटरैक्टिव मैप देखें। अपना ड्रॉप-ऑफ टोकन स्लॉट सीधे बुक करें।",
    },
    {
      icon: Wallet,
      titleEn: "Step 3: Quality Check & Instant Payout",
      titleHi: "चरण 3: गुणवता जांच और तुरंत भुगतान",
      descEn: "Bring your produce to the hub. Once quality grading is verified by the operator, receive payment directly into your bank account within 24 hours.",
      descHi: "अपनी उपज केंद्र पर लाएं। ऑपरेटर द्वारा गुणवत्ता ग्रेडिंग सत्यापित होने के बाद, 24 घंटे के भीतर सीधे अपने बैंक खाते में भुगतान प्राप्त करें।",
    },
  ];

  const activeStep = steps[currentStep];
  const Icon = activeStep.icon;

  const currentDesc = lang === "hi" ? activeStep.descHi : activeStep.descEn;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#E2E7E2] relative space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FAFAF7] hover:bg-[#EEF7EF] text-[#687D6B] hover:text-[#172019] transition"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#EEF7EF] text-[#16803A] text-[10px] font-bold uppercase tracking-wider">
            {lang === "hi" ? "किसान ट्यूटोरियल" : "Farmer Guide"}
          </span>
          <span className="text-xs text-[#687D6B] font-semibold">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-5 bg-[#FAFAF7] rounded-2xl border border-[#E2E7E2] space-y-3 text-center">
          <div className="size-12 mx-auto rounded-full bg-[#16803A] text-white flex items-center justify-center shadow-md">
            <Icon className="size-6" />
          </div>
          <h3 className="text-base font-bold text-[#172019]">
            {lang === "hi" ? activeStep.titleHi : activeStep.titleEn}
          </h3>
          <p className="text-xs text-[#687D6B] leading-relaxed">
            {currentDesc}
          </p>

          {/* Voice Assistance Button */}
          <button
            type="button"
            onClick={() => (isSpeaking ? stop() : speak(currentDesc, lang))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2E7E2] text-xs font-bold text-[#16803A] hover:bg-[#EEF7EF] transition shadow-2xs"
          >
            <Volume2 className="size-3.5" />
            <span>{isSpeaking ? (lang === "hi" ? "रोकें" : "Stop") : (lang === "hi" ? "यह चरण सुनें" : "Listen Step")}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                idx === currentStep ? "bg-[#16803A]" : "bg-[#E2E7E2]"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#687D6B] disabled:opacity-30 hover:text-[#172019]"
          >
            <ChevronLeft className="size-4" />
            <span>{lang === "hi" ? "पीछे" : "Back"}</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#16803A] text-white text-xs font-bold hover:bg-[#12682F] transition shadow-xs"
            >
              <span>{lang === "hi" ? "अगला" : "Next"}</span>
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#16803A] text-white text-xs font-bold hover:bg-[#12682F] transition shadow-xs"
            >
              <CheckCircle2 className="size-4" />
              <span>{lang === "hi" ? "समझ गया" : "Got It"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}