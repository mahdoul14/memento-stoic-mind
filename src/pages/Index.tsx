
import { NavBarDemo } from "@/components/NavBarDemo";
import Hero from "@/components/Hero";
import ToolsShowcase from "@/components/ToolsShowcase";
import ChatPreview from "@/components/ChatPreview";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import QuoteBanner from "@/components/QuoteBanner";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <NavBarDemo />
      <Hero />
      <ToolsShowcase />
      <ChatPreview />
      <PricingSection />
      <TestimonialsSection />
      <QuoteBanner />
      <ClosingCTA />
      <Footer />
    </div>
  );
};

export default Index;
