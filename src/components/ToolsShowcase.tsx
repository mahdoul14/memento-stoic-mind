
const ToolsShowcase = () => {
  const tools = [
    {
      name: "MARCUSGPT",
      description: "Talk with Marcus Aurelius via GPT-4"
    },
    {
      name: "MEMENTO MORI",
      description: "A countdown reminding you life is short"
    },
    {
      name: "STOIC JOURNAL", 
      description: "Daily writing prompts for reflection"
    },
    {
      name: "VIRTUE TRACKER",
      description: "Track actions across courage, wisdom, justice, temperance"
    },
    {
      name: "COMING SOON",
      description: "New tools in development"
    }
  ];

  return (
    <section id="tools" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-6 tracking-tight uppercase">
            Your Stoic Toolkit
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div 
              key={tool.name}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-inter font-bold text-2xl text-black mb-4 tracking-tight">
                {tool.name}
              </h3>
              <p className="font-inter text-lg text-gray-600 leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
