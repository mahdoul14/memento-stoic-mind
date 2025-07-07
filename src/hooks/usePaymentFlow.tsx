
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentFlow = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Check payment status when user changes
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        setIsPaid(false);
        setCheckingPayment(false);
        return;
      }

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
          setIsPaid(false);
        } else if (data) {
          setIsPaid(data.is_paid || false);
        } else {
          // No profile exists yet, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              is_paid: false
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
          setIsPaid(false);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setIsPaid(false);
      } finally {
        setCheckingPayment(false);
      }
    };

    if (!authLoading) {
      checkPaymentStatus();
    }
  }, [user, authLoading]);

  const handleStartFlow = () => {
    if (!user) {
      // User not signed in, show auth modal
      setShowAuthModal(true);
    } else if (!isPaid) {
      // User signed in but not paid, show payment modal
      setShowPaymentModal(true);
    } else {
      // User signed in and paid, go to dashboard
      window.location.href = '/dashboard';
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After auth, check if they need to pay
    if (!isPaid) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setIsPaid(true);
    window.location.href = '/dashboard';
  };

  return {
    showAuthModal,
    setShowAuthModal,
    showPaymentModal,
    setShowPaymentModal,
    isPaid,
    checkingPayment,
    handleStartFlow,
    handleAuthSuccess,
    handlePaymentSuccess,
  };
};
