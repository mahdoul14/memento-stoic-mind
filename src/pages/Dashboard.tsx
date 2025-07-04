
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, BookOpen, Target, LogOut, Home, Lightbulb, Library, User, MessageCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [animateCards, setAnimateCards] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Trigger animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const virtues = [
    { name: "Courage", icon: "🛡️", progress: 75, streak: 5 },
    { name: "Wisdom", icon: "🧠", progress: 82, streak: 3 },
    { name: "Justice", icon: "⚖️", progress: 90, streak: 7 },
    { name: "Temperance", icon: "🌿", progress: 68, streak: 2 }
  ];

  const dailyQuote = {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black font-inter pb-20">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-black">Good morning.</h1>
          <p className="text-gray-500 text-sm mt-1">Let's make today meaningful</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <Button
            onClick={() => {
              console.log('Signing out...');
              signOut();
            }}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-black hover:bg-gray-100"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Top Section - Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* MarcusGPT */}
          <Card className={`bg-black text-white rounded-3xl shadow-lg transition-all duration-700 ease-out ${
            animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Talk to Marcus</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Reflect on your day with Stoic wisdom and guidance."
                </p>
              </div>
              <Button 
                onClick={() => navigate('/gpt')}
                className="w-full bg-white text-black hover:bg-gray-100 font-medium rounded-full"
              >
                Reflect with Marcus
              </Button>
            </CardContent>
          </Card>

          {/* Stoic Journal */}
          <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out ${
            animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Today's Journal</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "What challenged your patience today?"
                </p>
              </div>
              <Button 
                onClick={() => navigate('/journal')}
                variant="outline" 
                className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-medium rounded-full"
              >
                Write Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Virtue Tracker Section */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-black">TRACK YOUR VIRTUES</h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-black">3/7</div>
                <div className="text-xs text-gray-500">days</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {virtues.map((virtue, index) => (
                <div key={virtue.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">
                      <span className="text-sm">{virtue.icon}</span>
                    </div>
                    <span className="text-black font-medium">{virtue.name.toLowerCase()}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${
                          i < virtue.streak ? 'bg-black' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">Covered this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Memento Mori */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Memento Mori</h3>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-700 text-sm mb-2">Time is finite — cherish each moment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-black">73</span>
                  <span className="text-gray-500 text-sm">Years Left</span>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${32 * 2 * Math.PI}`}
                    strokeDashoffset={`${32 * 2 * Math.PI * (1 - 0.32)}`}
                    className="text-black"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">32%</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/memento')}
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl"
            >
              View Timeline
            </Button>
          </CardContent>
        </Card>

        {/* Daily Inspiration */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Daily Inspiration</h3>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-gray-800 text-sm leading-relaxed italic mb-3">
                "{dailyQuote.text}"
              </p>
              <p className="text-gray-500 text-xs text-right">— {dailyQuote.author}</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-black mb-4">Daily Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">How are you feeling?</span>
                <div className="flex gap-2">
                  {['😊', '😐', '😔', '😤', '😌'].map((emoji, i) => (
                    <button key={i} className="text-lg hover:scale-110 transition-transform">
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Sleep hours</span>
                <span className="text-black font-medium">7.5h</span>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-xs text-center">
                  Remember to reflect on your day before sleep
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <button className="flex flex-col items-center gap-1 p-2">
            <Home className="w-5 h-5 text-black" />
            <span className="text-xs text-black font-medium">Today</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Lightbulb className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Inspirations</span>
          </button>
          <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-white"></div>
              <div className="w-0.5 h-4 bg-white absolute"></div>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Library className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Library</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
