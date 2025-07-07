
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEnterTemple = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-6">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
          Build Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-black">
            Stoic Mind
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Ancient wisdom meets modern tools. Track your virtues, reflect with Marcus Aurelius, 
          and build mental resilience through daily Stoic practices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={handleEnterTemple}
            size="lg" 
            className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 rounded-full group transition-all duration-300 hover:scale-105"
          >
            Enter the Temple
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const toolsSection = document.getElementById('tools');
              toolsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-lg px-8 py-6 rounded-full border-2 border-gray-300 hover:border-black transition-all duration-300"
          >
            Explore Tools
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-black mb-2">4</div>
            <div className="text-gray-600 text-sm">Stoic Virtues</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-black mb-2">365</div>
            <div className="text-gray-600 text-sm">Days of Growth</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-black mb-2">∞</div>
            <div className="text-gray-600 text-sm">Ancient Wisdom</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-black mb-2">1</div>
            <div className="text-gray-600 text-sm">Present Moment</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
