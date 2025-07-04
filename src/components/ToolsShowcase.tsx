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
      description: "Chat with Marcus Aurelius.",
      features: [
        "• Powered by GPT-4",
        "• Inspired by Meditations"
      ]
    },
    {
      id: "memento",
      name: "Memento Mori",
      emoji: "⌛",
      description: "Your weekly countdown.",
      features: [
        "• 4000 dot life grid",
        "• Weekly reflection built-in"
      ]
    },
    {
      id: "journal",
      name: "Stoic Journal", 
      emoji: "📓",
      description: "Reflect and write.",
      features: [
        "• Guided prompts",
        "• Private daily entries"
      ]
    },
    {
      id: "tracker",
      name: "Virtue Tracker",
      emoji: "⚖️",
      description: "Log daily Stoic virtues.",
      features: [
        "• Track justice, courage, wisdom",
        "• Rate yourself daily"
      ]
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
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              style={{ 
                transitionDelay: sectionVisible ? `${index * 100 + 300}ms` : '0ms'
              }}
              onMouseEnter={() => setHoveredCard(tool.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{tool.emoji}</div>
                <h3 className="font-inter font-bold text-2xl text-black mb-2 tracking-tight">
                  {tool.name}
                </h3>
                <p className="font-inter text-lg text-gray-600">
                  {tool.description}
                </p>
              </div>
              
              {/* Features list - shows on hover */}
              <div className={`transition-all duration-300 overflow-hidden ${
                hoveredCard === tool.id 
                  ? 'max-h-24 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="pt-4 border-t border-gray-100">
                  {tool.features.map((feature, featureIndex) => (
                    <p key={featureIndex} className="font-inter text-sm text-gray-500 leading-relaxed mb-1">
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
