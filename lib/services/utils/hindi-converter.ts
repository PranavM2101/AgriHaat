/**
 * Converts standard Western Arabic numbers (0-9) to Devanagari Hindi numbers (०-९).
 */
export function toHindiNumerals(num: number | string): string {
  if (num === null || num === undefined) return "";
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num).replace(/\d/g, (digit) => hindiDigits[parseInt(digit, 10)]);
}

/**
 * Formats currency values cleanly for Hindi UI display and Hindi voice synthesis.
 */
export function rupeesHindi(amount: number): string {
  const formattedNum = toHindiNumerals(amount.toLocaleString("en-IN"));
  return `₹${formattedNum}`; // Or "₹" + formattedNum
}

/**
 * Pre-processes text for the Hindi Text-To-Speech Engine so numbers are spoken properly in Hindi context.
 */
export function prepareTextForHindiSpeech(text: string): string {
  // Replace symbols and common metric units with speakable Hindi words
  return text
    .replace(/₹/g, " रुपए ")
    .replace(/kg/gi, " किलोग्राम ")
    .replace(/km/gi, " किलोमीटर ")
    .replace(/\b(Order|ord)\b/gi, "ऑर्डर")
    .replace(/\b(Grade)\b/gi, "ग्रेड")
    .replace(/\d+/g, (match) => toHindiNumerals(match));
}