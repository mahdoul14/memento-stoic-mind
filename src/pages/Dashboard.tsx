import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Lightbulb, Library, User, MessageCircle, TrendingUp, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BirthYearForm } from "@/components/BirthYearForm";
import { MementoMoriGrid } from "@/components/MementoMoriGrid";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [animateCards, setAnimateCards] = useState(false);
  const [typingDots, setTypingDots] = useState('');

  // Journal widget state
  const [isJournalExpanded, setIsJournalExpanded] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [checkingEntry, setCheckingEntry] = useState(true);

  // Memento Mori state
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [age, setAge] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoadingProfile(true);
      try {
        console.log('Fetching profile for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('birth_year')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Profile fetch result:', { data, error });

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data && data.birth_year) {
          setBirthYear(data.birth_year);
          const currentYear = new Date().getFullYear();
          const calculatedAge = currentYear - data.birth_year;
          setAge(calculatedAge);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Check for existing journal entry today
  useEffect(() => {
    const checkTodaysEntry = async () => {
      if (!user) return;

      setCheckingEntry(true);
      try {
        console.log('Checking today\'s journal entry for user:', user.id);
        
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('journal_entries')
          .select('id')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();

        console.log('Journal entry check result:', { data, error });

        if (error) {
          console.error('Error checking journal entry:', error);
        } else if (data) {
          setHasEntryToday(true);
        }
      } catch (error) {
        console.error('Error checking journal entry:', error);
      } finally {
        setCheckingEntry(false);
      }
    };

    if (user) {
      checkTodaysEntry();
    }
  }, [user]);

  // Trigger staggered animations after mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Typing animation for MarcusGPT
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle journal save
  const handleSaveJournal = async () => {
    if (!journalText.trim() || !user) return;
    
    setIsSaving(true);
    try {
      console.log('Attempting to save journal entry for user:', user.id);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          entry_text: journalText.trim(),
          date: new Date().toISOString().split('T')[0]
        })
        .select();

      console.log('Journal save result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setJournalText('');
      setIsJournalExpanded(false);
      setHasEntryToday(true);
      toast({
        title: "Saved successfully",
        description: "Your reflection has been saved.",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving",
        description: error instanceof Error ? error.message : "There was a problem saving your reflection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBirthYearSaved = (year: number) => {
    setBirthYear(year);
    const currentYear = new Date().getFullYear();
    const calculatedAge = currentYear - year;
    setAge(calculatedAge);
  };

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
    { name: "Courage", icon: "🛡️", streak: 5 },
    { name: "Wisdom", icon: "🧠", streak: 3 },
    { name: "Justice", icon: "⚖️", streak: 7 },
    { name: "Temperance", icon: "🌿", streak: 2 }
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
            className="text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-105"
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
          <Card className={`bg-black text-white rounded-3xl shadow-lg transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 hover:bg-gray-900 ${
            animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 relative overflow-hidden">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Talk to Marcus</h3>
                <div className="text-gray-300 text-sm leading-relaxed mb-2">
                  "Reflect on your day with Stoic wisdom and guidance{typingDots}"
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none opacity-0 hover:opacity-100"></div>
              </div>
              <Button 
                onClick={() => {
                  console.log('Navigating to Marcus page...');
                  navigate('/marcus');
                }}
                className="w-full bg-white text-black hover:bg-gray-100 font-medium rounded-full transition-all duration-200 hover:scale-105"
              >
                Reflect with Marcus
              </Button>
            </CardContent>
          </Card>

          {/* Stoic Journal - Expandable */}
          <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
            animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          } ${isJournalExpanded ? 'row-span-2' : ''}`} style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 relative overflow-hidden">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Today's Journal</h3>
                {checkingEntry ? (
                  <div className="text-gray-600 text-sm leading-relaxed">
                    Checking today's entry...
                  </div>
                ) : hasEntryToday ? (
                  <div className="text-green-600 text-sm leading-relaxed">
                    ✓ You've already written your entry for today.
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm leading-relaxed relative">
                    <span className="hover:bg-gradient-to-r hover:from-gray-600 hover:via-gray-400 hover:to-gray-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                      "What challenged your patience today?"
                    </span>
                  </div>
                )}
              </div>
              
              {/* Expandable content */}
              <div className={`transition-all duration-400 ease-out overflow-hidden ${
                isJournalExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-4 pt-4">
                  <Textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="min-h-[120px] resize-none border-gray-200 focus:border-black focus:ring-black"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveJournal}
                      disabled={!journalText.trim() || isSaving}
                      className="bg-black text-white hover:bg-gray-800 font-medium rounded-full transition-all duration-200 hover:scale-105"
                    >
                      {isSaving ? 'Saving...' : 'Save Reflection'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsJournalExpanded(false);
                        setJournalText('');
                      }}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
              
              {!isJournalExpanded && !hasEntryToday && !checkingEntry && (
                <Button 
                  onClick={() => setIsJournalExpanded(true)}
                  variant="outline" 
                  className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-medium rounded-full transition-all duration-200 hover:scale-105"
                >
                  Write Now
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Virtue Tracker Section */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
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
                <div key={virtue.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <span className="text-sm">{virtue.icon}</span>
                    </div>
                    <span className="text-black font-medium">{virtue.name.toLowerCase()}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i < virtue.streak ? 'bg-black scale-100' : 'bg-gray-200 scale-90'
                        }`}
                        style={{ 
                          transitionDelay: `${i * 100}ms`,
                          transform: i < virtue.streak ? 'scale(1)' : 'scale(0.9)'
                        }}
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
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Memento Mori</h3>
            </div>
            
            <p className="text-gray-700 text-sm mb-4">A visual reminder that time is finite.</p>
            
            {loadingProfile ? (
              <div className="text-gray-500 text-sm">Loading your timeline...</div>
            ) : !birthYear ? (
              <div className="space-y-4">
                <div className="text-gray-500 text-sm text-center mb-4">
                  Enter your birth year to view your timeline.
                </div>
                <BirthYearForm userId={user.id} onBirthYearSaved={handleBirthYearSaved} />
              </div>
            ) : (
              <MementoMoriGrid age={age} />
            )}
          </CardContent>
        </Card>

        {/* Daily Inspiration */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
                <Lightbulb className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Daily Inspiration</h3>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 transition-all duration-300 hover:bg-gray-100">
              <p className="text-gray-800 text-sm leading-relaxed italic mb-3">
                "{dailyQuote.text}"
              </p>
              <p className="text-gray-500 text-xs text-right">— {dailyQuote.author}</p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
          animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`} style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-black mb-4">Daily Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">How are you feeling?</span>
                <div className="flex gap-2">
                  {['😊', '😐', '😔', '😤', '😌'].map((emoji, i) => (
                    <button 
                      key={i} 
                      className="text-lg hover:scale-125 transition-transform duration-200 hover:rotate-12"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
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
          <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
            <Home className="w-5 h-5 text-black" />
            <span className="text-xs text-black font-medium">Today</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
            <Lightbulb className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Inspirations</span>
          </button>
          <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-gray-800">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-white"></div>
              <div className="w-0.5 h-4 bg-white absolute"></div>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
            <Library className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Library</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
            <TrendingUp className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
