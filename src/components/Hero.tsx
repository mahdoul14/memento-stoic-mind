
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: phonesRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="font-inter font-bold text-5xl lg:text-7xl text-black mb-6 tracking-tight">
            Become Stoic in the Age of Distraction
          </h1>
          <p className="font-inter text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A calm AI dashboard for discipline, clarity, and reflection.
          </p>
          
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-4 text-lg font-inter font-medium mb-16 group">
            Enter the Temple
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div 
          ref={phonesRef}
          className="flex flex-col lg:flex-row gap-8 justify-center items-center max-w-4xl mx-auto"
        >
          <div 
            className={`relative animate-fade-in transition-all duration-700 ease-out ${
              isVisible 
                ? 'transform rotate-y-[-6deg] scale-105' 
                : 'transform rotate-y-0 scale-100'
            }`}
            style={{ 
              animationDelay: '0.3s',
              transformStyle: 'preserve-3d',
              filter: isVisible ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))' : 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1))'
            }}
          >
            <div className="w-64 h-[520px] bg-white rounded-[3rem] border-8 border-gray-800 relative overflow-hidden transform rotate-[-8deg] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-white m-2 rounded-[2.5rem] flex flex-col p-6">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <div className="text-sm font-inter font-medium text-gray-600 mb-2">MarcusGPT</div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="text-xs text-gray-400 mb-1">You</div>
                    <div className="text-sm text-gray-800">What should I focus on today?</div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-3 text-white">
                  <div className="text-xs text-gray-300 mb-1">Marcus Aurelius</div>
                  <div className="text-sm">Your task is to practice discipline...</div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className={`relative animate-fade-in transition-all duration-700 ease-out ${
              isVisible 
                ? 'transform rotate-y-[6deg] scale-105' 
                : 'transform rotate-y-0 scale-100'
            }`}
            style={{ 
              animationDelay: '0.6s',
              transformStyle: 'preserve-3d',
              filter: isVisible ? 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))' : 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1))'
            }}
          >
            <div className="w-64 h-[520px] bg-white rounded-[3rem] border-8 border-gray-800 relative overflow-hidden transform rotate-[8deg] shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-white m-2 rounded-[2.5rem] flex flex-col items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-sm font-inter font-medium text-gray-600 mb-6">Memento Mori</div>
                  <div className="text-4xl font-inter font-bold text-black mb-2">73</div>
                  <div className="text-lg text-gray-600 mb-1">Years</div>
                  <div className="text-sm text-gray-400">Average lifespan remaining</div>
                  <div className="mt-8 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-black h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Life progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
