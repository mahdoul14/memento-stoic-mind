
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnterTemple = () => {
    if (user) {
      // User is logged in, go to dashboard (which will check subscription)
      navigate('/dashboard');
    } else {
      // User not logged in, redirect to auth first
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div 
        ref={heroRef}
        className={`container mx-auto px-6 text-center relative z-10 transition-all duration-1000 ease-out ${
          heroVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Main heading with enhanced typography */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="font-inter font-bold text-5xl md:text-6xl lg:text-7xl text-black mb-6 tracking-tight leading-[1.1]">
            Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                Stoic
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 transform -skew-x-12 opacity-30"></div>
            </span>
            {" "}Mind
          </h1>
          
          <p className="font-inter text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            A digital sanctuary for the modern Stoic. Track your virtue, reflect with wisdom, 
            and remember that time is finite.
          </p>
        </div>

        {/* Enhanced CTA section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={handleEnterTemple}
            size="lg"
            className="bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-2xl px-8 py-4 text-lg font-inter font-semibold rounded-full transition-all duration-300 shadow-lg"
          >
            Enter the Temple →
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const toolsSection = document.getElementById('tools');
              toolsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-black text-black hover:bg-black hover:text-white hover:scale-105 px-8 py-4 text-lg font-inter font-semibold rounded-full transition-all duration-300"
          >
            Explore Tools
          </Button>
        </div>

        {/* Elegant feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          <div className="group p-6 rounded-2xl bg-white/50 border border-gray-100 hover:shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-inter font-semibold text-lg text-black mb-2">Daily Reflection</h3>
            <p className="font-inter text-gray-600 text-sm leading-relaxed">
              Journal with guidance from Marcus Aurelius and track your philosophical growth.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 border border-gray-100 hover:shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="font-inter font-semibold text-lg text-black mb-2">Virtue Tracking</h3>
            <p className="font-inter text-gray-600 text-sm leading-relaxed">
              Monitor your practice of the four cardinal virtues in daily life.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-white/50 border border-gray-100 hover:shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="font-inter font-semibold text-lg text-black mb-2">Memento Mori</h3>
            <p className="font-inter text-gray-600 text-sm leading-relaxed">
              A visual reminder of life's brevity to inspire mindful living.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
