
const ToolsShowcase = () => {
  const tools = [
    {
      name: "MarcusGPT",
      description: "Talk with Marcus Aurelius via GPT-4.",
      features: [
        "Ask questions about life, death, virtue",
        "Daily quote & reflection from Meditations",
        "Personalized guidance from a Stoic lens"
      ]
    },
    {
      name: "Memento Mori",
      description: "A countdown reminding you that time is finite.",
      features: [
        "Track days left using your birthdate",
        "Animates gently to reinforce awareness",
        "Designed to reflect Stoic mortality themes"
      ]
    },
    {
      name: "Stoic Journal", 
      description: "Daily reflection prompts and private writing space.",
      features: [
        "Morning and evening reflection prompts",
        "Private, autosaving writing space",
        "Minimal, calming UI for focus"
      ]
    },
    {
      name: "Virtue Tracker",
      description: "Measure courage, wisdom, justice, temperance.",
      features: [
        "Log actions for each core Stoic virtue",
        "Weekly visual summaries",
        "Built to encourage personal accountability"
      ]
    }
  ];

  return (
    <section id="tools" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="font-inter font-bold text-5xl lg:text-6xl text-black mb-6 tracking-tight">
            Explore the Tools
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {tools.map((tool, index) => (
            <div 
              key={tool.name}
              className="group bg-white p-12 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-inter font-bold text-3xl text-black mb-4 tracking-tight">
                {tool.name}
              </h3>
              <p className="font-inter text-xl text-gray-600 mb-6 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-2 group-hover:translate-y-0">
                <ul className="space-y-3">
                  {tool.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="font-inter text-lg text-gray-500 flex items-start"
                      style={{ 
                        transitionDelay: `${featureIndex * 50}ms` 
                      }}
                    >
                      <span className="text-black mr-3 font-medium">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
