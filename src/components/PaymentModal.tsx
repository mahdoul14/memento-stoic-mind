
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'monthly' | 'lifetime' | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();

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
    setLoadingType(priceType);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      // Close the modal and show success message
      onClose();
      toast({
        title: "Redirecting to checkout",
        description: "Please complete your payment in the new tab",
      });
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <DialogHeader className="relative pb-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-2xl font-bold text-center text-black pt-4">
            Unlock Your Stoic Toolkit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600 text-center leading-relaxed">
            Get lifetime access to MarcusGPT, the Virtue Tracker, Stoic Journal, and Memento Countdown.
          </p>
          
          <div className="space-y-4">
            {/* Monthly Option */}
            <div className="relative group">
              <Button
                onClick={() => handlePayment('monthly')}
                disabled={loading}
                className="w-full h-14 bg-gray-100 hover:bg-gray-200 text-black border border-gray-200 rounded-xl transition-all duration-200 group-hover:shadow-md"
              >
                {loading && loadingType === 'monthly' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">Try Monthly</span>
                  <span className="font-bold">£9/month</span>
                </div>
              </Button>
            </div>

            {/* Lifetime Option - Featured */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-700 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
              <Button
                onClick={() => handlePayment('lifetime')}
                disabled={loading}
                className="relative w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200"
              >
                {loading && loadingType === 'lifetime' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                )}
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    Unlock Lifetime
                    <span className="text-xs text-gray-300 ml-2">(Best Value)</span>
                  </span>
                  <span className="font-bold">£79.99</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure Stripe checkout. No hidden fees.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
