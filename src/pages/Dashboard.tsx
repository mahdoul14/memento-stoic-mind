import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Lightbulb, Library, User, MessageCircle, TrendingUp, LogOut, Home, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { BirthYearForm } from "@/components/BirthYearForm";
import { MementoMoriGrid } from "@/components/MementoMoriGrid";
import { VirtueTracker } from "@/components/VirtueTracker";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, session, signOut, loading: authLoading } = useAuth();
  const { subscribed, loading: subscriptionLoading, createCheckout } = useSubscription();
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Check if user has access (authenticated AND subscribed)
  const hasAccess = user && subscribed;
  const isLoading = authLoading || subscriptionLoading;

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

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpgrade = async (priceType: 'monthly' | 'lifetime') => {
    try {
      await createCheckout(priceType);
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    }
  };

  // Show loading while checking auth and subscription
  if (isLoading) {
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

  // Show subscription required screen if user doesn't have access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 text-black font-inter">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Premium access required</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>

        {/* Subscription Required Content */}
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Premium Access Required</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Unlock your personal Stoic dashboard with journaling, virtue tracking, and wisdom from Marcus Aurelius.
              </p>
            </div>

            {/* Pricing Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <Card className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-200">
                <CardContent className="p-0 space-y-6">
                  <div className="mb-6">
                    <div className="font-inter font-bold text-4xl text-black mb-2">
                      £9<span className="text-xl font-medium text-gray-500">/month</span>
                    </div>
                    <h3 className="font-inter font-semibold text-xl text-black">Monthly Access</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Unlimited access to all Stoic tools</span>
                    </li>
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Private journal with full history</span>
                    </li>
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Cancel anytime, no commitment</span>
                    </li>
                  </ul>

                  <Button 
                    onClick={() => handleUpgrade('monthly')}
                    className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-full py-3 text-base transition-all duration-200 hover:scale-105"
                  >
                    Choose Monthly Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Lifetime Plan */}
              <Card className="bg-white border-2 border-black rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Best Value Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-inter font-semibold shadow-lg">
                    ✨ Best Value
                  </div>
                </div>

                <CardContent className="p-0 space-y-6 mt-4">
                  <div className="mb-6">
                    <div className="font-inter font-bold text-4xl text-black mb-2">
                      £79<span className="text-xl font-medium text-gray-500"> one-time</span>
                    </div>
                    <h3 className="font-inter font-semibold text-xl text-black">Lifetime Access</h3>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>All tools included forever</span>
                    </li>
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Priority access to new tools & features</span>
                    </li>
                    <li className="font-inter text-gray-700 flex items-start">
                      <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Best value for serious Stoics</span>
                    </li>
                  </ul>

                  <Button 
                    onClick={() => handleUpgrade('lifetime')}
                    className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-full py-3 text-base transition-all duration-200 hover:scale-105"
                  >
                    Choose Lifetime Plan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Back to Home Button */}
            <div className="text-center mt-8">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-2 text-base transition-all duration-200"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
            onClick={handleSignOut}
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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Virtue Tracker</h3>
            </div>
            
            <p className="text-gray-700 text-sm mb-6">Rate yourself on the four Stoic virtues today.</p>
            
            <VirtueTracker userId={user.id} />
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
              <div className="space-y-6">
                {/* Show empty grid first */}
                <div className="grid grid-cols-10 gap-2 justify-center max-w-[240px] mx-auto">
                  {[...Array(100)].map((_, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full bg-gray-100 border border-gray-300"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">0</div>
                  <div className="text-sm text-gray-500 mb-4">weeks lived</div>
                  <div className="text-gray-500 text-sm text-center mb-4">
                    Enter your birth year to view your timeline.
                  </div>
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
