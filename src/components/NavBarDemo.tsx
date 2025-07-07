
import { User, Briefcase, DollarSign, LogIn, LogOut } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { usePaymentStatus } from "@/hooks/usePaymentStatus"
import { PaymentModal } from "@/components/PaymentModal"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function NavBarDemo() {
  const { user, signOut } = useAuth()
  const { isPaid, loading: paymentLoading } = usePaymentStatus()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const navigate = useNavigate()

  const handleAuthAction = () => {
    if (user) {
      // User is signed in, so sign them out
      signOut()
    } else {
      // User is not signed in, redirect to auth page
      navigate('/auth')
    }
  }

  const navItems = [
    { name: 'Tools', url: '#tools', icon: Briefcase },
    { name: 'Dashboard', url: '#dashboard', icon: User },
    { name: 'Pricing', url: '#pricing', icon: DollarSign }
  ]

  return (
    <>
      <div className="relative">
        <NavBar items={navItems} />
        <div className="fixed top-6 right-6 z-50">
          <button 
            onClick={handleAuthAction}
            className="relative bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-2xl rounded-full px-8 py-3 text-base font-inter font-semibold group transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Button content */}
            <span className="relative z-10 flex items-center">
              {user ? (
                <>
                  Sign Out
                  <LogOut className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
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
