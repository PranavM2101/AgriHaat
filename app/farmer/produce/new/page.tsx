"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  Check,
  ChevronRight,
  ArrowLeft,
  UploadCloud,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { MarketplaceService } from "@/lib/services";
import { useLanguage, rupees } from "@/components/site/language-context";
import { useAuth } from "@/components/auth/auth-context";

const PRODUCE_OPTIONS = [
  { id: "tomato", name: "Tomatoes", nameHi: "टमाटर", image: "/tomatoes-market.png", category: "Vegetables" as const },
  { id: "onion", name: "Red Onions", nameHi: "लाल प्याज", image: "/onion.jpg", category: "Vegetables" as const },
  { id: "potato", name: "Potatoes", nameHi: "आलू", image: "/potato.jpg", category: "Vegetables" as const },
  { id: "rice", name: "Basmati Rice", nameHi: "बासमती चावल", image: "/basmati.jpg", category: "Grains" as const },
  { id: "wheat", name: "Sharbati Wheat", nameHi: "शरबती गेहूं", image: "/placeholder.svg", category: "Grains" as const },
  { id: "groundnut", name: "Groundnut", nameHi: "मूंगफली", image: "/placeholder.svg", category: "Pulses" as const },
];

export default function NewProduceListingPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedProduce, setSelectedProduce] = useState(PRODUCE_OPTIONS[0]);
  const [grade, setGrade] = useState<"A" | "B" | "Bulk">("A");
  const [quantity, setQuantity] = useState<number>(500);
  const [pricePerKg, setPricePerKg] = useState<number>(32);
  const [harvestDate, setHarvestDate] = useState<string>("2026-08-28");
  const [location, setLocation] = useState<string>("Kanchipuram, Tamil Nadu");
  const [windowFrom, setWindowFrom] = useState<string>("2026-08-29");
  const [windowTo, setWindowTo] = useState<string>("2026-09-02");
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Arithmetic breakdown
  const logisticsFee = 3;
  const platformFee = 1;
  const buyerPrice = pricePerKg + logisticsFee + platformFee;
  const farmerRealization = pricePerKg;

  const handlePublish = async () => {
    setLoading(true);
    await MarketplaceService.createListing({
      farmerId: user?.id || "farmer-01",
      farmerName: user?.name || "Ramesh Kumar",
      farmerLocation: location,
      fpoName: user?.organization || "ABC FPO",
      productName: selectedProduce.name,
      productNameHi: selectedProduce.nameHi,
      category: selectedProduce.category,
      grade,
      totalQuantity: quantity,
      availableQuantity: quantity,
      unit: "kg",
      pricePerKg,
      harvestDate,
      availabilityWindow: { from: windowFrom, to: windowTo },
      location,
      district: "Kanchipuram",
      state: "Tamil Nadu",
      verified: true,
      image: customPhoto || selectedProduce.image,
    });

    setLoading(false);
    setPublished(true);
    setTimeout(() => {
      router.push("/farmer/produce");
    }, 1800);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#687D6B] mb-4">
          <Link href="/farmer/produce" className="hover:underline">
            My Produce
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-[#172019]">List New Produce</span>
        </div>

        <div className="border-b border-[#E2E7E2] pb-4 mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#172019]">
            {lang === "hi" ? "नई उपज लिस्टिंग बनाएं" : "Create Produce Listing"}
          </h1>
          <p className="text-xs text-[#687D6B] mt-1">
            Step {step} of 9 · Direct farmer-to-buyer transparent pricing
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-[#16803A]" : "bg-[#E2E7E2]"
              }`}
            />
          ))}
        </div>

        {published ? (
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-8 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="grid size-16 place-items-center rounded-full bg-[#EEF7EF] text-[#16803A] mx-auto">
              <Check className="size-8 stroke-[3]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#172019]">
              {lang === "hi" ? "उपज सफलतापूर्वक लिस्ट हुई!" : "Produce Listed Successfully!"}
            </h2>
            <p className="text-xs text-[#687D6B] max-w-md mx-auto leading-relaxed">
              Your {quantity} kg of {selectedProduce.name} (Grade {grade}) has been published to the verified buyer marketplace at {rupees(pricePerKg)}/kg.
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#16803A] font-semibold">Redirecting to My Produce...</span>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E2E7E2] bg-white p-6 sm:p-8 shadow-sm">
            {/* ─── Step 1: Select Produce ─── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 1: Select Agricultural Produce
                  </h3>
                  <p className="text-xs text-[#687D6B]">Choose the crop variety you wish to sell</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRODUCE_OPTIONS.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProduce(prod)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-center text-center gap-2 ${
                        selectedProduce.id === prod.id
                          ? "border-[#16803A] bg-[#EEF7EF] ring-2 ring-[#16803A]/20"
                          : "border-[#E2E7E2] hover:bg-[#FAFAF7]"
                      }`}
                    >
                      <div className="size-14 rounded-xl overflow-hidden bg-white border border-[#E2E7E2]">
                        <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#172019]">
                          {lang === "hi" ? prod.nameHi : prod.name}
                        </p>
                        <span className="text-[10px] text-[#687D6B]">{prod.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Step 2: Quality Grade ─── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 2: Produce Quality Grade
                  </h3>
                  <p className="text-xs text-[#687D6B]">Specify batch grading standards</p>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "A", title: "Grade A (Premium / Hotel Quality)", desc: "Uniform size, firm texture, zero pest damage, ideal for restaurants." },
                    { id: "B", title: "Grade B (Standard Retail Quality)", desc: "Standard consumer grade, slight size variance, clean skin." },
                    { id: "Bulk", title: "Bulk / Food Processing Grade", desc: "For sauces, puree, milling, and commercial bulk processing." },
                  ].map((g) => (
                    <label
                      key={g.id}
                      onClick={() => setGrade(g.id as any)}
                      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                        grade === g.id
                          ? "border-[#16803A] bg-[#EEF7EF] ring-2 ring-[#16803A]/20"
                          : "border-[#E2E7E2] hover:bg-[#FAFAF7]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="grade"
                        checked={grade === g.id}
                        onChange={() => setGrade(g.id as any)}
                        className="mt-0.5 text-[#16803A] focus:ring-[#16803A]"
                      />
                      <div>
                        <p className="font-bold text-xs text-[#172019]">{g.title}</p>
                        <p className="text-xs text-[#687D6B] mt-0.5">{g.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Step 3: Quantity ─── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 3: Total Harvest Quantity
                  </h3>
                  <p className="text-xs text-[#687D6B]">Available batch quantity in kilograms</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(10, Number(e.target.value)))}
                      className="w-48 rounded-xl border border-[#E2E7E2] px-4 py-2.5 text-base font-bold text-[#172019] outline-none focus:border-[#16803A]"
                    />
                    <span className="font-bold text-sm text-[#687D6B]">Kilograms (kg)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[200, 500, 800, 1000, 2000, 5000].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`rounded-full border px-3.5 py-1 text-xs font-semibold ${
                          quantity === q ? "border-[#16803A] bg-[#16803A] text-white" : "border-[#E2E7E2] hover:bg-[#FAFAF7]"
                        }`}
                      >
                        {q} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 4: Expected Price ─── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 4: Your Desired Gate Price (₹/kg)
                  </h3>
                  <p className="text-xs text-[#687D6B]">Estimated price you wish to receive before transport</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[#E2E7E2] px-3 py-2">
                      <span className="font-bold text-base text-[#172019] mr-1">₹</span>
                      <input
                        type="number"
                        value={pricePerKg}
                        onChange={(e) => setPricePerKg(Math.max(1, Number(e.target.value)))}
                        className="w-32 text-base font-bold text-[#172019] outline-none"
                      />
                    </div>
                    <span className="font-semibold text-xs text-[#687D6B]">per kilogram</span>
                  </div>

                  {/* Mandi Benchmark Guide */}
                  <div className="rounded-2xl border border-[#16803A]/20 bg-[#EEF7EF] p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#16803A]">
                      <Sparkles className="size-3.5" /> Mandi Intelligence Guide
                    </div>
                    <p className="mt-1 text-[#172019]">
                      Current nearby buyer bids range from <strong>₹30 – ₹34/kg</strong>. Your rate of <strong>₹{pricePerKg}/kg</strong> is well matched.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 5: Harvest Date ─── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 5: Harvest Date
                  </h3>
                  <p className="text-xs text-[#687D6B]">When was or will this produce be harvested?</p>
                </div>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="rounded-xl border border-[#E2E7E2] px-4 py-2.5 text-xs font-bold text-[#172019] outline-none focus:border-[#16803A]"
                />
              </div>
            )}

            {/* ─── Step 6: Farm Location ─── */}
            {step === 6 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 6: Farm / FPO Pickup Location
                  </h3>
                  <p className="text-xs text-[#687D6B]">Where should the coordinated pickup truck arrive?</p>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Village, Taluk, District, State"
                  className="w-full rounded-xl border border-[#E2E7E2] px-4 py-2.5 text-xs text-[#172019] outline-none focus:border-[#16803A]"
                />
              </div>
            )}

            {/* ─── Step 7: Availability Window ─── */}
            {step === 7 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 7: Pickup Availability Window
                  </h3>
                  <p className="text-xs text-[#687D6B]">Dates within which this harvest can be dispatched</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#687D6B]">Available From:</span>
                    <input
                      type="date"
                      value={windowFrom}
                      onChange={(e) => setWindowFrom(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E2E7E2] px-3 py-2 text-xs text-[#172019] outline-none focus:border-[#16803A]"
                    />
                  </div>
                  <div>
                    <span className="text-[#687D6B]">Available To:</span>
                    <input
                      type="date"
                      value={windowTo}
                      onChange={(e) => setWindowTo(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#E2E7E2] px-3 py-2 text-xs text-[#172019] outline-none focus:border-[#16803A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 8: Photos & Camera Capture ─── */}
            {step === 8 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 8: Produce Inspection Photos
                  </h3>
                  <p className="text-xs text-[#687D6B]">
                    Take a photo with your mobile/laptop camera or upload from your gallery
                  </p>
                </div>

                {customPhoto ? (
                  <div className="space-y-3">
                    <div className="relative rounded-3xl overflow-hidden border border-[#E2E7E2] bg-black/5 max-h-72 flex items-center justify-center">
                      <img src={customPhoto} alt="Uploaded produce" className="max-h-72 w-full object-contain rounded-3xl" />
                      <button
                        type="button"
                        onClick={() => setCustomPhoto(null)}
                        className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                        title="Remove photo"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-center text-[#16803A] font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="size-4" /> Custom photo uploaded for listing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Upload Dropzone */}
                    <label className="border-2 border-dashed border-[#16803A]/40 bg-[#EEF7EF]/30 rounded-3xl p-8 text-center hover:bg-[#EEF7EF]/60 cursor-pointer transition block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (typeof evt.target?.result === "string") {
                                setCustomPhoto(evt.target.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <UploadCloud className="size-12 text-[#16803A] mx-auto mb-2" />
                      <p className="text-xs font-bold text-[#172019]">Click to choose from file gallery or drag & drop</p>
                      <p className="text-[11px] text-[#687D6B] mt-1">PNG, JPG, WebP up to 15MB</p>
                    </label>

                    {/* Mobile Direct Camera Capture Button */}
                    <div className="flex gap-3">
                      <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-[#16803A] bg-[#EEF7EF] py-3 px-4 text-xs font-bold text-[#16803A] hover:bg-[#16803A] hover:text-white cursor-pointer transition">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (typeof evt.target?.result === "string") {
                                  setCustomPhoto(evt.target.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <Camera className="size-4" />
                        Take Live Camera Photo
                      </label>

                      <label className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-[#E2E7E2] bg-white py-3 px-4 text-xs font-bold text-[#172019] hover:bg-[#FAFAF7] cursor-pointer transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (typeof evt.target?.result === "string") {
                                  setCustomPhoto(evt.target.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <ImageIcon className="size-4" />
                        Choose from Gallery
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Step 9: Review & Transparent Breakdown ─── */}
            {step === 9 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#172019]">
                    Step 9: Review Listing & Transparent Price Arithmetic
                  </h3>
                  <p className="text-xs text-[#687D6B]">Review before broadcasting to verified buyers</p>
                </div>

                <div className="rounded-2xl border border-[#E2E7E2] p-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Produce Variety:</span>
                    <span className="font-bold text-[#172019]">{selectedProduce.name} (Grade {grade})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Quantity:</span>
                    <span className="font-bold text-[#172019]">{quantity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Pickup Location:</span>
                    <span className="font-semibold text-[#172019]">{location}</span>
                  </div>
                </div>

                {/* Price Breakdown Table */}
                <div className="rounded-2xl border border-[#16803A]/30 bg-[#EEF7EF] p-5 space-y-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803A]">
                    Transparent Breakdown Per Kilogram
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Buyer Listing Price:</span>
                    <span className="font-bold text-[#172019]">₹{buyerPrice}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Estimated Logistics Fee:</span>
                    <span className="font-medium text-red-600">−₹{logisticsFee}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#687D6B]">Platform Facilitation Fee:</span>
                    <span className="font-medium text-red-600">−₹{platformFee}/kg</span>
                  </div>
                  <div className="flex justify-between border-t border-[#16803A]/20 pt-3 text-sm font-bold text-[#16803A]">
                    <span>Your Guaranteed Net Realization:</span>
                    <span>₹{farmerRealization}/kg</span>
                  </div>
                  <div className="text-right text-[11px] text-[#687D6B] pt-1">
                    Total Estimated Take-Home: <strong className="text-[#16803A] text-sm">{rupees(quantity * farmerRealization)}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-[#687D6B] text-center">
                  *Illustrative calculation based on verified regional logistics schedules.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-[#E2E7E2] pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#687D6B] hover:text-[#172019]"
                >
                  <ArrowLeft className="size-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 9 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#16803A] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition"
                >
                  Next Step <ChevronRight className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#16803A] px-7 py-2.5 text-xs font-bold text-white hover:bg-[#16803A]/90 transition shadow-sm"
                >
                  <CheckCircle2 className="size-4" />
                  {loading ? "Publishing..." : "Publish Listing"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
