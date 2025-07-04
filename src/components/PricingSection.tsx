import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const PricingSection = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
  const { subscribed, subscription_tier, loading, createCheckout, openCustomerPortal } = useSubscription();
  const { user } = useAuth();

  const handleSubscribe = (priceType: 'monthly' | 'lifetime') => {
    if (subscribed) {
      openCustomerPortal();
    } else {
      createCheckout(priceType);
    }
  };

  return (
    <section id="pricing" className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div 
          ref={sectionRef}
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            sectionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-4 tracking-tight">
            Simple, Honest Pricing
          </h2>
          <p className="font-inter text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the plan that works best for your Stoic journey
          </p>
        </div>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto transition-all duration-700 ease-out delay-200 ${
          sectionVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}>
          {/* Monthly Access Card */}
          <Card className={`group bg-white border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
            subscribed && subscription_tier === 'Monthly' 
              ? 'border-black ring-2 ring-black/20' 
              : 'border-gray-100 hover:border-gray-200'
          }`}>
            <CardHeader className="p-0 mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="font-inter font-bold text-5xl text-black">
                  £9<span className="text-xl font-medium text-gray-500">/month</span>
                </div>
                {subscribed && subscription_tier === 'Monthly' && (
                  <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Your Plan
                  </div>
                )}
              </div>
              <CardTitle className="font-inter font-semibold text-xl text-black">
                Monthly Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <ul className="space-y-4">
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Unlimited access to all Stoic tools</span>
                </li>
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Private journal with full history</span>
                </li>
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Cancel anytime, no commitment</span>
                </li>
              </ul>
              
              <div className="pt-4">
                <Button 
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loading || !user}
                  className="w-full bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg rounded-xl py-6 text-lg font-inter font-semibold transition-all duration-200 ease-in-out disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {subscribed && subscription_tier === 'Monthly' 
                    ? 'Manage Subscription' 
                    : 'Unlock Full Access →'
                  }
                </Button>
                <p className="font-inter text-gray-500 text-sm text-center mt-3">
                  {!user ? 'Sign in required' : '7-day free trial included. No risk.'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Lifetime Access Card - Featured */}
          <Card className={`group bg-white border-2 rounded-3xl p-8 relative hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
            subscribed && subscription_tier === 'Lifetime' 
              ? 'border-black ring-2 ring-black/20' 
              : 'border-black'
          }`}>
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black text-white px-6 py-2 rounded-full text-sm font-inter font-semibold shadow-lg">
                {subscribed && subscription_tier === 'Lifetime' ? '✨ Your Plan' : '✨ Best Value'}
              </div>
            </div>
            
            <CardHeader className="p-0 mb-8 mt-4">
              <div className="font-inter font-bold text-5xl text-black mb-2">
                £79<span className="text-xl font-medium text-gray-500"> one-time</span>
              </div>
              <CardTitle className="font-inter font-semibold text-xl text-black">
                Lifetime Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <ul className="space-y-4">
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>All tools included forever</span>
                </li>
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Priority access to new tools & features</span>
                </li>
                <li className="font-inter text-gray-700 flex items-start">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Best value for serious Stoics</span>
                </li>
              </ul>
              
              <div className="pt-4">
                <Button 
                  onClick={() => handleSubscribe('lifetime')}
                  disabled={loading || !user}
                  className="w-full bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg rounded-xl py-6 text-lg font-inter font-semibold transition-all duration-200 ease-in-out disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {subscribed && subscription_tier === 'Lifetime' 
                    ? 'Manage Subscription' 
                    : 'Unlock Full Access →'
                  }
                </Button>
                <p className="font-inter text-gray-500 text-sm text-center mt-3">
                  {!user ? 'Sign in required' : '7-day free trial included. No risk.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
