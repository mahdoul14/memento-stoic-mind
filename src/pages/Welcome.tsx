
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_paid')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking payment status:', error);
          navigate('/pricing');
          return;
        }

        const userIsPaid = data?.is_paid || false;
        setIsPaid(userIsPaid);

        if (!userIsPaid) {
          navigate('/pricing');
          return;
        }

        // Redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error checking payment status:', error);
        navigate('/pricing');
      }
    };

    if (!loading && user) {
      checkPaymentStatus();
    }
  }, [user, loading, navigate]);

  // Don't render anything while checking payment status
  if (loading || isPaid === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  // Only render if user is paid (otherwise they get redirected)
  if (!isPaid) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 backdrop-blur-3xl" />
      </motion.div>

      {/* Soft glow layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div className="w-96 h-96 bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 rounded-full blur-3xl" />
      </motion.div>

      {/* Main content */}
      <div className="text-center z-10 px-8">
        <motion.h1
          className="text-6xl md:text-7xl font-light text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          🎉 Welcome to the Temple
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Your Stoic Toolkit has been unlocked.
        </motion.p>

        {/* Subtle loading indicator for redirect */}
        <motion.div
          className="mt-12 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
