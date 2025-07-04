
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock, BookOpen, Target, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  // Calculate filled dots based on age (example: 25 years old)
  const currentAge = 25;
  const weeksPerYear = 52;
  const totalWeeks = 80 * weeksPerYear; // 4160 weeks in 80 years
  const filledWeeks = currentAge * weeksPerYear;

  const tools = [
    {
      id: "marcusgpt",
      name: "MarcusGPT",
      description: "Chat with Marcus Aurelius.",
      icon: Brain,
      route: "/gpt",
      features: ["• GPT-4 answers", "• Inspired by Meditations", "• Stoic wisdom guidance"]
    },
    {
      id: "memento",
      name: "Memento Mori",
      description: "Your weekly countdown.",
      icon: Clock,
      route: "/memento",
      features: ["• Visual life timeline", "• Weekly reflections", "• Mortality awareness"]
    },
    {
      id: "journal",
      name: "Stoic Journal",
      description: "Reflect and write.",
      icon: BookOpen,
      route: "/journal",
      features: ["• Daily reflections", "• Stoic prompts", "• Private entries"]
    },
    {
      id: "tracker",
      name: "Virtue Tracker",
      description: "Log daily Stoic virtues.",
      icon: Target,
      route: "/tracker",
      features: ["• Track wisdom, courage, justice", "• Daily habit building", "• Progress insights"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sign out button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={signOut}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="mb-16 animate-fade-in">
          <h1 className="font-inter font-bold text-4xl text-black mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="font-inter text-xl text-gray-600">
            Track your practice. Access your tools.
          </p>
        </div>

        {/* Section 1: Memento Mori Chart */}
        <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gray-50 rounded-3xl p-12 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-80 gap-1 mb-8">
                {Array.from({ length: totalWeeks }, (_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index < filledWeeks 
                        ? 'bg-gray-800' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="font-inter text-gray-700 text-center text-lg leading-relaxed">
                Each dot is a week of your life. Make them count.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Stoic Tool Grid */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-inter font-bold text-3xl text-black mb-12 text-center tracking-tight">
            Your Practice Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className="group bg-white border-0 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => navigate(tool.route)}
                  onMouseEnter={() => setHoveredCard(tool.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-inter font-bold text-xl text-black mb-2">
                          {tool.name}
                        </h3>
                        <p className="font-inter text-gray-600 text-base">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Features list - shows on hover */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      hoveredCard === tool.id 
                        ? 'max-h-32 opacity-100 mt-4' 
                        : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-4 border-t border-gray-100">
                        {tool.features.map((feature, index) => (
                          <p key={index} className="font-inter text-sm text-gray-500 leading-relaxed">
                            {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
