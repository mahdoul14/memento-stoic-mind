
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Hourglass } from "lucide-react";

const ClosingCTA = () => {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div 
          ref={ctaRef}
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            ctaVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Animated Hourglass Icon */}
          <div className="mb-8 flex justify-center">
            <div className="animate-pulse">
              <Hourglass 
                size={48} 
                className="text-gray-600 animate-spin" 
                style={{ animationDuration: '8s' }}
              />
            </div>
          </div>

          {/* Headline */}
          <h2 className="font-inter font-bold text-4xl lg:text-6xl text-black mb-6 tracking-tight">
            Live with clarity. Reflect daily.
          </h2>

          {/* Subheadline */}
          <p className="font-inter text-xl lg:text-2xl text-gray-600 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
            Built to help you slow down, think deeply, and act with intention — every single day.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center space-y-3">
            <Button 
              className="bg-white text-black border border-gray-200 hover:bg-gray-50 hover:scale-105 hover:shadow-xl rounded-full px-12 py-4 text-lg font-inter font-medium group transition-all duration-300 ease-out"
            >
              Start Free
            </Button>
            <p className="text-sm text-gray-500 font-inter">
              No sign-up needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
