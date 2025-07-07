
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentModal } from "@/components/PaymentModal";
import { Hourglass, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClosingCTA = () => {
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();
  const { user } = useAuth();
  const { isPaid, loading: paymentLoading } = usePaymentStatus();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const handleStartFree = () => {
    // If not signed in, redirect to auth page
    if (!user) {
      navigate('/auth');
      return;
    }

    // If signed in but not paid, show payment modal
    if (!isPaid) {
      setShowPaymentModal(true);
      return;
    }

    // If signed in and paid, go to dashboard
    navigate('/dashboard');
  };

  return (
    <>
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div 
            ref={ctaRef}
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ease-out ${
              ctaVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            {/* Animated Hourglass Icon */}
            <div className="mb-8 flex justify-center">
              <div className="animate-pulse">
                <Hourglass 
                  size={48} 
                  className="text-gray-600 animate-spin" 
                  style={{ animationDuration: '8s' }}
                />
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-inter font-bold text-4xl lg:text-6xl text-black mb-6 tracking-tight">
              Live with clarity. Reflect daily.
            </h2>

            {/* Subheadline */}
            <p className="font-inter text-xl lg:text-2xl text-gray-600 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Built to help you slow down, think deeply, and act with intention — every single day.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center space-y-3">
              <Button 
                onClick={handleStartFree}
                disabled={paymentLoading}
                className="bg-white text-black border border-gray-200 hover:bg-gray-50 hover:scale-105 hover:shadow-xl rounded-full px-12 py-4 text-lg font-inter font-medium group transition-all duration-300 ease-out disabled:opacity-50"
              >
                {paymentLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {user && isPaid ? 'Go to Dashboard' : 'Start Free'}
              </Button>
              <p className="text-sm text-gray-500 font-inter">
                {user && isPaid ? 'Access your tools' : 'No sign-up needed • Start immediately'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
};

export default ClosingCTA;
