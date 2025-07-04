
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ToolsShowcase from "@/components/ToolsShowcase";
import ChatPreview from "@/components/ChatPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      <Hero />
      <ToolsShowcase />
      <ChatPreview />
      <Footer />
    </div>
  );
};

export default Index;
