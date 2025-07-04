
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, BookOpen, Target, LogOut, Home, BarChart3, User, MessageCircle } from "lucide-react";
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const virtues = [
    { name: "Courage", progress: 75 },
    { name: "Wisdom", progress: 82 },
    { name: "Justice", progress: 90 },
    { name: "Temperance", progress: 68 }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-inter">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-600 text-sm">Track your daily practice</p>
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

      {/* Main Content */}
      <div className="px-6 pb-24 space-y-4">
        {/* MarcusGPT Widget */}
        <Card className={`bg-white border-gray-200 rounded-2xl shadow-sm transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">MarcusGPT</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-sm leading-relaxed">
                  "Your task is to practice discipline in all things. Begin each day with purpose..."
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/gpt')}
              className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-xl"
            >
              Continue Conversation
            </Button>
          </CardContent>
        </Card>

        {/* Memento Mori Widget */}
        <Card className={`bg-white border-gray-200 rounded-2xl shadow-sm transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">Memento Mori</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-black mb-1">73</div>
              <p className="text-gray-600 text-sm">Years Left</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Life Progress</span>
                <span className="text-gray-700">32%</span>
              </div>
              <Progress value={32} className="h-2 bg-gray-100" />
            </div>
            <Button 
              onClick={() => navigate('/memento')}
              variant="outline" 
              className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl"
            >
              View Timeline
            </Button>
          </CardContent>
        </Card>

        {/* Stoic Journal Widget */}
        <Card className={`bg-white border-gray-200 rounded-2xl shadow-sm transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black">Stoic Journal</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-700 text-sm font-medium mb-2">Today's Prompt</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                "What tested your temper today, and how did you respond with virtue?"
              </p>
            </div>
            <Button 
              onClick={() => navigate('/journal')}
              className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-xl"
            >
              Write Today's Reflection
            </Button>
          </CardContent>
        </Card>

        {/* Virtue Tracker Widget */}
        <Card className={`bg-white border-gray-200 rounded-2xl shadow-sm transition-all duration-700 ease-out ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black">Virtue Tracker</h3>
              </div>
              <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                Daily Score: 79%
              </div>
            </div>
            <div className="space-y-3">
              {virtues.map((virtue) => (
                <div key={virtue.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{virtue.name}</span>
                    <span className="text-gray-600">{virtue.progress}%</span>
                  </div>
                  <Progress value={virtue.progress} className="h-2 bg-gray-100" />
                </div>
              ))}
            </div>
            <Button 
              onClick={() => navigate('/tracker')}
              variant="outline" 
              className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl"
            >
              Update Virtues
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <button className="flex flex-col items-center gap-1 p-2">
            <Home className="w-5 h-5 text-black" />
            <span className="text-xs text-black font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/journal')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Journal</span>
          </button>
          <button 
            onClick={() => navigate('/tracker')}
            className="flex flex-col items-center gap-1 p-2"
          >
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Stats</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
