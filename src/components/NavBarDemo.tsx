
import { User, Briefcase, DollarSign } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { usePaymentStatus } from "@/hooks/usePaymentStatus"
import { PaymentModal } from "@/components/PaymentModal"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function NavBarDemo() {
  const { user } = useAuth()
  const { isPaid, refreshPaymentStatus, loading } = usePaymentStatus()
  const navigate = useNavigate()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  console.log('[NAVBAR] User:', user?.email, 'isPaid:', isPaid, 'loading:', loading);

  const navItems = [
    { name: 'Tools', url: '#tools', icon: Briefcase },
    { name: 'Dashboard', url: '#dashboard', icon: User },
    { name: 'Pricing', url: '#pricing', icon: DollarSign }
  ]

  const handleAuthClick = () => {
    if (!user) {
      navigate('/auth')
      return
    }

    // If signed in but not paid, show payment modal
    if (!isPaid) {
      setShowPaymentModal(true)
      return
    }

    // If signed in and paid, go to dashboard
    navigate('/dashboard')
  }

  return (
    <>
      <div className="relative">
        <NavBar items={navItems} />
        <div className="fixed top-6 right-6 z-50 flex gap-2">
          {user && (
            <Button
              onClick={refreshPaymentStatus}
              variant="outline"
              className="px-3 py-2 text-sm"
              disabled={loading}
            >
              🔄
            </Button>
          )}
          <Button
            onClick={handleAuthClick}
            className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            disabled={loading}
          >
            {user ? (loading ? 'Checking...' : 'Go to Dashboard') : 'Sign In'} →
          </Button>
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
