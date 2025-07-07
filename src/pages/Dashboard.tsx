import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MarcusGPTWidget } from "@/components/dashboard/MarcusGPTWidget";
import { JournalWidget } from "@/components/dashboard/JournalWidget";
import { VirtueTrackerWidget } from "@/components/dashboard/VirtueTrackerWidget";
import { MementoMoriWidget } from "@/components/dashboard/MementoMoriWidget";
import { DailyInspirationWidget } from "@/components/dashboard/DailyInspirationWidget";
import { DailySummaryWidget } from "@/components/dashboard/DailySummaryWidget";
import { BottomNavigation } from "@/components/dashboard/BottomNavigation";
import { FloatingChat } from "@/components/chat/FloatingChat";
import { useFloatingChat } from "@/hooks/useFloatingChat";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [animateCards, setAnimateCards] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const { isOpen: isChatOpen, toggle: toggleChat, open: openChat } = useFloatingChat();

  // Payment status
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Journal widget state
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
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Check payment status
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return;

      setCheckingPayment(true);
      try {
        console.log('Checking payment status for user:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_paid')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Payment status result:', { data, error });

        if (error) {
          console.error('Error checking payment status:', error);
          navigate('/');
        } else if (data) {
          if (!data.is_paid) {
            console.log('User not paid, redirecting to home');
            navigate('/');
          } else {
            setIsPaid(true);
          }
        } else {
          // No profile exists, redirect to home
          console.log('No profile found, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        navigate('/');
      } finally {
        setCheckingPayment(false);
      }
    };

    if (user) {
      checkPaymentStatus();
    }
  }, [user, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !isPaid) return;

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

    if (user && isPaid) {
      fetchProfile();
    }
  }, [user, isPaid]);

  // Check for existing journal entry today
  useEffect(() => {
    const checkTodaysEntry = async () => {
      if (!user || !isPaid) return;

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

    if (user && isPaid) {
      checkTodaysEntry();
    }
  }, [user, isPaid]);

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

  const handleJournalEntryCreated = () => {
    setHasEntryToday(true);
  };

  // Show loading while checking auth or payment
  if (authLoading || checkingPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated or not paid
  if (!user || !isPaid) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-black font-inter pb-20">
        {/* Header */}
        <DashboardHeader onSignOut={handleSignOut} />

        {/* Main Content */}
        <div className="px-6 pt-6 space-y-6">
          {/* Top Section - Main Actions */}
          <div className="grid grid-cols-2 gap-4">
            {/* MarcusGPT */}
            <MarcusGPTWidget 
              animateCards={animateCards} 
              typingDots={typingDots} 
              onOpenChat={openChat}
            />

            {/* Stoic Journal - Expandable */}
            <JournalWidget 
              userId={user.id}
              hasEntryToday={hasEntryToday}
              checkingEntry={checkingEntry}
              animateCards={animateCards}
              onEntryCreated={handleJournalEntryCreated}
            />
          </div>

          {/* Virtue Tracker Section */}
          <VirtueTrackerWidget userId={user.id} animateCards={animateCards} />

          {/* Memento Mori */}
          <MementoMoriWidget 
            userId={user.id}
            birthYear={birthYear}
            age={age}
            loadingProfile={loadingProfile}
            animateCards={animateCards}
            onBirthYearSaved={handleBirthYearSaved}
          />

          {/* Daily Inspiration */}
          <DailyInspirationWidget animateCards={animateCards} />

          {/* Daily Summary */}
          <DailySummaryWidget animateCards={animateCards} />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* Floating Chat */}
      <FloatingChat isOpen={isChatOpen} onToggle={toggleChat} />
    </>
  );
};

export default Dashboard;
