import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProofSection } from "@/components/landing/proof-section";
import { MarketplaceCarousel } from "@/components/landing/marketplace-carousel";
import { ProductTabs } from "@/components/landing/product-tabs";
import { LogisticsSection } from "@/components/landing/logistics-section";
import { MandiComparison } from "@/components/landing/mandi-comparison";
import { EarningsSection } from "@/components/landing/earnings-section";
import { BuyerSection } from "@/components/landing/buyer-section";
import { InteractiveRoute } from "@/components/landing/interactive-route";
import { FAQ } from "@/components/landing/faq";
import { AIDemo } from "@/components/landing/ai-demo";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/landing/scroll-to-top";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#172019] selection:bg-[#16803A] selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      {/* 1. Hero Section with realistic product card */}
      <HeroSection />

      {/* 2. Proof & Insight Section (Farmer Realization + Demand Outlook) */}
      <ProofSection />

      {/* 3. Marketplace Carousel (What's moving today) */}
      <MarketplaceCarousel />

      {/* 4. Product Showcase Tabs (Listings, Forecast, Prices, Logistics) */}
      <ProductTabs />

      {/* 5. Direct Mandi vs AgriHaat Middlemen Elimination Section */}
      <MandiComparison />

      {/* 6. Smart Logistics Split Section */}
      <LogisticsSection />

      {/* 7. Farmer Earnings Breakdown */}
      <EarningsSection />

      {/* 8. Buyer Bulk Procurement Experience */}
      <BuyerSection />

      {/* 9. Tactical Interactive Route Inspector */}
      <InteractiveRoute />

      {/* 10. Frequently Asked Questions Accordion */}
      <FAQ />

      {/* 11. Dark Agricultural AI Copilot Demo */}
      <AIDemo />

      {/* 12. Final High-Contrast Call to Action */}
      <FinalCTA />

      {/* 13. Multi-Column Footer */}
      <Footer />

      {/* Floating Utilities */}
      <ScrollToTop />
    </main>
  );
}
