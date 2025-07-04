
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ToolsShowcase = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  const tools = [
    {
      id: "marcusgpt",
      name: "MarcusGPT",
      emoji: "🧠",
      tagline: "Converse with ancient wisdom. Get modern clarity.",
      description: "Ask life's hardest questions. Get answers from the Stoics. Built with GPT-4, fine-tuned to think like Marcus Aurelius."
    },
    {
      id: "memento",
      name: "Memento Mori",
      emoji: "⌛",
      tagline: "A visual reminder of your mortality — and your purpose.",
      description: "Track your life in weeks. Each dot reminds you to live with urgency, intention, and grace."
    },
    {
      id: "journal",
      name: "Stoic Journal", 
      emoji: "📓",
      tagline: "Reflect. Accept. Improve.",
      description: "Capture your thoughts each day. Practice morning intention and evening reflection, just like the Stoics."
    },
    {
      id: "tracker",
      name: "Virtue Tracker",
      emoji: "⚖️",
      tagline: "Measure yourself by what matters.",
      description: "Daily reflections on courage, temperance, wisdom, and justice. Let your actions show your growth."
    }
  ];

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
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 ease-out delay-200 ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}>
          {tools.map((tool, index) => (
            <div 
              key={tool.id}
              className={`group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer ${
                sectionVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: sectionVisible ? `${index * 150 + 300}ms` : '0ms'
              }}
              onMouseEnter={() => setHoveredCard(tool.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {tool.emoji}
                </div>
                <p className="font-inter text-sm italic text-gray-500 mb-3 leading-relaxed">
                  {tool.tagline}
                </p>
                <h3 className="font-inter font-bold text-2xl text-black mb-4 tracking-tight">
                  {tool.name}
                </h3>
                <p className="font-inter text-base text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              
              {/* Subtle hover indicator */}
              <div className={`w-full h-0.5 bg-gradient-to-r from-transparent via-black to-transparent transition-all duration-300 ${
                hoveredCard === tool.id 
                  ? 'opacity-20 scale-x-100' 
                  : 'opacity-0 scale-x-0'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
