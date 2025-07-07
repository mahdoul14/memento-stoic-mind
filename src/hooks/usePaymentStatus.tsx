
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePaymentStatus = () => {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const checkPaymentStatus = async () => {
    if (!user) {
      setIsPaid(false);
      setLoading(false);
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
        setIsPaid(false);
      } else {
        setIsPaid(data?.is_paid || false);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setIsPaid(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [user]);

  const refreshPaymentStatus = () => {
    setLoading(true);
    checkPaymentStatus();
  };

  return {
    isPaid,
    loading,
    refreshPaymentStatus,
  };
};
