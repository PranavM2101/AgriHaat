import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProofSection } from "@/components/landing/proof-section";
import { MarketplaceCarousel } from "@/components/landing/marketplace-carousel";
import { ProductTabs } from "@/components/landing/product-tabs";
import { LogisticsSection } from "@/components/landing/logistics-section";
import { EarningsSection } from "@/components/landing/earnings-section";
import { BuyerSection } from "@/components/landing/buyer-section";
import { InteractiveRoute } from "@/components/landing/interactive-route";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { AIDemo } from "@/components/landing/ai-demo";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/landing/scroll-to-top";
import { HelpWidget } from "@/components/landing/help-widget";

export default function Home() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAFAF7] text-[#172019] selection:bg-[#16803A] selection:text-white relative">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section Container with Responsive Padding */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero Section with realistic product card */}
        <HeroSection />
      </div>

      {/* 2. Proof & Insight Section */}
      <ProofSection />

      {/* 3. Marketplace Carousel */}
      <MarketplaceCarousel />

      {/* 4. Product Showcase Tabs */}
      <ProductTabs />

      {/* 5. Smart Logistics Split Section */}
      <LogisticsSection />

      {/* 6. Farmer Earnings Breakdown */}
      <EarningsSection />

      {/* 7. Buyer Bulk Procurement Experience */}
      <BuyerSection />

      {/* 8. Tactical Interactive Route Inspector */}
      <InteractiveRoute />

      {/* 9. Verified Scenario Testimonials */}
      <Testimonials />

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
      <HelpWidget />
    </main>
  );
}