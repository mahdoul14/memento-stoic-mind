
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePaymentStatus = () => {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<string | null>(null);
  const { user } = useAuth();

  const checkPaymentStatus = async () => {
    if (!user) {
      console.log('No user found, setting unpaid status');
      setIsPaid(false);
      setPaymentType(null);
      setPaymentDate(null);
      setLoading(false);
      return;
    }

    console.log('Checking payment status for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paid, payment_type, payment_date, stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Payment status query result:', { data, error });

      if (error) {
        console.error('Error checking payment status:', error);
        setIsPaid(false);
        setPaymentType(null);
        setPaymentDate(null);
      } else if (data) {
        console.log('User payment status:', {
          isPaid: data.is_paid,
          paymentType: data.payment_type,
          paymentDate: data.payment_date,
          hasStripeCustomer: !!data.stripe_customer_id
        });
        
        setIsPaid(data.is_paid || false);
        setPaymentType(data.payment_type);
        setPaymentDate(data.payment_date);
      } else {
        console.log('No profile found for user, setting unpaid status');
        setIsPaid(false);
        setPaymentType(null);
        setPaymentDate(null);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setIsPaid(false);
      setPaymentType(null);
      setPaymentDate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [user]);

  const refreshPaymentStatus = () => {
    console.log('Manually refreshing payment status');
    checkPaymentStatus();
  };

  return {
    isPaid,
    loading,
    paymentType,
    paymentDate,
    refreshPaymentStatus,
  };
};
