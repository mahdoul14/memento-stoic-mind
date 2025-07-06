
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ModernOperatingCards from "@/components/ui/modern-operating-cards";

const ToolsShowcase = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  return (
    <section id="tools" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <div 
          ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-4 tracking-tight">
            Explore the Tools
          </h2>
          <p className="font-inter text-xl text-gray-600">
            Each one designed to deepen your practice
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
