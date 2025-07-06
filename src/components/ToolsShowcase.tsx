
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ModernOperatingCards from "@/components/ui/modern-operating-cards";

const ToolsShowcase = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  return (
    <section id="tools" className="bg-white py-20 lg:py-28">
      <div className="container mx-auto px-6 max-w-7xl">
        <div 
          ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-inter font-semibold text-3xl lg:text-4xl text-black mb-4 tracking-tight">
            Tools for Stoic Living
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Four essential tools to help you live with wisdom, courage, and intention
          </p>
        </div>
        
        <div className={`transition-all duration-700 ease-out delay-200 ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}>
          <ModernOperatingCards />
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
