
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { PaymentModal } from "@/components/PaymentModal";
import { useState } from "react";

const Hero = () => {
  const { ref: leftPhoneRef, isVisible: leftPhoneVisible } = useScrollAnimation();
  const { ref: rightPhoneRef, isVisible: rightPhoneVisible } = useScrollAnimation();
  const { ref: heroTextRef, isVisible: heroTextVisible } = useScrollAnimation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPaid, loading: paymentLoading } = usePaymentStatus();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleEnterTemple = () => {
    console.log('Enter Temple clicked', { user: !!user, isPaid, paymentLoading });
    
    // If not signed in, redirect to auth page
    if (!user) {
      console.log('User not signed in, redirecting to auth');
      navigate('/auth');
      return;
    }

    // If signed in but not paid, show payment modal
    if (!isPaid) {
      console.log('User signed in but not paid, showing payment modal');
      setShowPaymentModal(true);
      return;
    }

    // If signed in and paid, go to dashboard
    console.log('User signed in and paid, redirecting to dashboard');
    navigate('/dashboard');
  };

  return (
    <>
      <section className="bg-white py-24 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div 
            ref={heroTextRef}
            className={`transition-all duration-1000 ease-out ${
              heroTextVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="font-inter font-bold text-5xl lg:text-7xl text-black mb-4 tracking-tight">
              Become Stoic in the Age of Distraction
            </h1>
            <p className="font-inter text-xl text-gray-700 mb-2 max-w-2xl mx-auto">
              A modern AI App for discipline, clarity, and reflection
            </p>
            <p className="font-serif text-lg text-gray-500 mb-12 max-w-2xl mx-auto italic">
              Influenced by the great minds
            </p>
            
            <div className="mb-16">
              <button 
                onClick={handleEnterTemple}
                disabled={paymentLoading}
                className="relative bg-red-600 text-white hover:bg-red-700 hover:scale-105 hover:shadow-2xl rounded-full px-12 py-5 text-lg font-inter font-semibold group transition-all duration-300 ease-out disabled:opacity-50 overflow-hidden"
              >
                {/* Moving gradient animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient-x opacity-80"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center">
                  Enter the Temple
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 justify-center items-center max-w-5xl mx-auto">
            {/* Phone 1 - MarcusGPT */}
            <div 
              ref={leftPhoneRef}
              className={`relative transition-all duration-1200 ease-out ${
                leftPhoneVisible 
                  ? 'opacity-100 translate-y-0 translate-x-0' 
                  : 'opacity-0 translate-y-12 -translate-x-8'
              }`}
              style={{ transitionDelay: leftPhoneVisible ? '300ms' : '0ms' }}
            >
              <div className="w-72 h-[580px] bg-black rounded-[2.5rem] p-2 transform perspective-1000 rotate-y-[-12deg] rotate-x-[8deg] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 ease-out">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3 text-xs text-black">
                    <span className="font-medium">10:42</span>
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-6 h-2 bg-black rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="flex-1 px-6 pb-6 flex flex-col">
                    <div className="text-center py-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-black">MarcusGPT</h2>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[200px]">
                          <p className="text-sm text-black">What should I focus on today?</p>
                        </div>
                      </div>
                      
                      {/* Marcus Reply */}
                      <div className="flex justify-start">
                        <div className="bg-black rounded-2xl px-4 py-3 max-w-[200px]">
                          <p className="text-sm text-white">Your task is to practice discipline in all things...</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom dots */}
                    <div className="flex justify-center space-x-2 mt-4">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Phone 2 - Memento Mori */}
            <div 
              ref={rightPhoneRef}
              className={`relative transition-all duration-1200 ease-out ${
                rightPhoneVisible 
                  ? 'opacity-100 translate-y-0 translate-x-0' 
                  : 'opacity-0 translate-y-12 translate-x-8'
              }`}
              style={{ transitionDelay: rightPhoneVisible ? '500ms' : '0ms' }}
            >
              <div className="w-72 h-[580px] bg-black rounded-[2.5rem] p-2 transform perspective-1000 rotate-y-[12deg] rotate-x-[8deg] shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 ease-out">
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3 text-xs text-black">
                    <span className="font-medium">10:42</span>
                    <div className="w-6 h-6 bg-black rounded-full"></div>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-6 h-2 bg-black rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="flex-1 px-6 pb-6 flex flex-col justify-center items-center text-center">
                    <div className="mb-8">
                      <p className="text-sm text-gray-500 mb-2">Wed Sep</p>
                      <p className="text-6xl font-bold text-black mb-1">18</p>
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <span className="text-black font-medium">Day</span>
                        <span className="text-gray-500">45%</span>
                      </div>
                      
                      {/* Progress dots */}
                      <div className="grid grid-cols-6 gap-1 mt-4 mb-8">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < 11 ? 'bg-black' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4 w-full">
                      <h3 className="text-lg font-semibold text-black">Memento Mori</h3>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-black mb-2">73</div>
                        <div className="text-base text-black mb-1">Years</div>
                        <div className="text-sm text-gray-500 mb-6">Average lifespan remaining</div>
                        
                        {/* Life Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div className="bg-black h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="text-xs text-gray-500">Life Progress</div>
                      </div>
                    </div>
                    
                    {/* Bottom dots */}
                    <div className="flex justify-center space-x-2 mt-8">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
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

export default Hero;
