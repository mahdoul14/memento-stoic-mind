
import { User, Briefcase, DollarSign, ArrowRight } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { usePaymentStatus } from "@/hooks/usePaymentStatus"
import { PaymentModal } from "@/components/PaymentModal"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function NavBarDemo() {
  const { user } = useAuth()
  const { isPaid, loading: paymentLoading } = usePaymentStatus()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Tools', url: '#tools', icon: Briefcase },
    { name: 'Dashboard', url: '#dashboard', icon: User },
    { name: 'Pricing', url: '#pricing', icon: DollarSign }
  ]

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
  }

  return (
    <>
      <div className="relative">
        <NavBar items={navItems} />
        <div className="fixed top-6 right-6 z-50">
          <button 
            onClick={handleEnterTemple}
            disabled={paymentLoading}
            className="relative bg-red-600 text-white hover:bg-red-700 hover:scale-105 hover:shadow-2xl rounded-full px-8 py-3 text-base font-inter font-semibold group transition-all duration-300 ease-out disabled:opacity-50 overflow-hidden"
          >
            {/* Moving gradient animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient-x opacity-80"></div>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center">
              Enter the Temple
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  )
}
