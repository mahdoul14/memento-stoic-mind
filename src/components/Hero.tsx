
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: heroTextRef, isVisible: heroTextVisible } = useScrollAnimation();
  const { ref: phonesRef, isVisible: phonesVisible } = useScrollAnimation();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <div 
          ref={heroTextRef}
          className={`transition-all duration-1000 ease-out ${
            heroTextVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-inter font-bold text-5xl lg:text-7xl text-black mb-4 tracking-tight">
            Become Stoic in the Age of Distraction
          </h1>
          <p className="font-inter text-xl text-gray-700 mb-2 max-w-2xl mx-auto">
            A modern AI App for discipline, clarity, and reflection
          </p>
          <p className="font-serif text-lg text-gray-500 mb-12 max-w-2xl mx-auto italic">
            Influenced by the great minds
          </p>
          
          <Button className="bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg rounded-full px-8 py-4 text-lg font-inter font-medium mb-16 group transition-all duration-200 ease-in-out">
            Enter the Temple
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {/* UI Mockup Images Row */}
        <div 
          ref={phonesRef}
          className={`relative flex justify-center items-center max-w-6xl mx-auto transition-all duration-1200 ease-out ${
            phonesVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* First Phone - Community Feed */}
          <div 
            className="relative z-10 transform transition-all duration-700 hover:scale-105 hover:z-30"
            style={{ 
              transitionDelay: phonesVisible ? '200ms' : '0ms',
              transform: `translateX(-60px) rotate(-8deg) ${phonesVisible ? 'translateY(0)' : 'translateY(20px)'}`
            }}
          >
            <img 
              src="/lovable-uploads/276e4f9a-ba4a-423a-b8cb-bdf6ea250d86.png" 
              alt="Community Feed" 
              className="w-64 h-auto drop-shadow-2xl rounded-[2.5rem] hover:drop-shadow-3xl transition-all duration-500"
            />
          </div>

          {/* Second Phone - Profile/Stats */}
          <div 
            className="relative z-20 transform transition-all duration-700 hover:scale-105 hover:z-30"
            style={{ 
              transitionDelay: phonesVisible ? '400ms' : '0ms',
              transform: `translateX(-30px) rotate(-2deg) ${phonesVisible ? 'translateY(0)' : 'translateY(20px)'}`
            }}
          >
            <img 
              src="/lovable-uploads/0085a22d-6704-44bc-b834-fe86b9bc5cf4.png" 
              alt="Profile Stats" 
              className="w-64 h-auto drop-shadow-2xl rounded-[2.5rem] hover:drop-shadow-3xl transition-all duration-500"
            />
          </div>

          {/* Third Phone - Daily Quote */}
          <div 
            className="relative z-30 transform transition-all duration-700 hover:scale-105 hover:z-40"
            style={{ 
              transitionDelay: phonesVisible ? '600ms' : '0ms',
              transform: `translateX(0px) rotate(2deg) ${phonesVisible ? 'translateY(0)' : 'translateY(20px)'}`
            }}
          >
            <img 
              src="/lovable-uploads/806fd202-003c-4d1f-98fd-08a9f3e8aed6.png" 
              alt="Daily Quote" 
              className="w-64 h-auto drop-shadow-2xl rounded-[2.5rem] hover:drop-shadow-3xl transition-all duration-500"
            />
          </div>

          {/* Fourth Phone - Meditation Timer */}
          <div 
            className="relative z-20 transform transition-all duration-700 hover:scale-105 hover:z-30"
            style={{ 
              transitionDelay: phonesVisible ? '800ms' : '0ms',
              transform: `translateX(30px) rotate(8deg) ${phonesVisible ? 'translateY(0)' : 'translateY(20px)'}`
            }}
          >
            <img 
              src="/lovable-uploads/78f4c57c-dd38-402d-9c39-8fa6282b9401.png" 
              alt="Meditation Timer" 
              className="w-64 h-auto drop-shadow-2xl rounded-[2.5rem] hover:drop-shadow-3xl transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
