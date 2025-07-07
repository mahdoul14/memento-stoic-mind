
import { useState } from "react";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePayment = async (priceType: 'monthly' | 'lifetime') => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Redirect to Stripe Checkout in the same window
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">
              Unlock Your Stoic Toolkit
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get access to MarcusGPT, Virtue Tracker, Stoic Journal and more.
            </p>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            {/* Lifetime Option */}
            <Button
              onClick={() => handlePayment('lifetime')}
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-4 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              Unlock Lifetime – £79.99
            </Button>

            {/* Monthly Option */}
            <Button
              onClick={() => handlePayment('monthly')}
              disabled={loading}
              variant="outline"
              className="w-full border-2 border-gray-200 text-black hover:bg-gray-50 rounded-full py-4 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              Try Monthly – £9/month
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secured by Stripe · No hidden fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};
