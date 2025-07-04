
import { User, Briefcase, DollarSign } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

export function NavBarDemo() {
  const { user, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { name: 'About', url: '#about', icon: User },
    { name: 'Tools', url: '#tools', icon: Briefcase },
    { name: 'Pricing', url: '#pricing', icon: DollarSign }
  ]

  const handleDashboardClick = async () => {
    if (user) {
      navigate('/dashboard')
    } else {
      await signInWithGoogle()
    }
  }

  return (
    <div className="relative">
      <NavBar items={navItems} />
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={handleDashboardClick}
          className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go to Dashboard →
        </Button>
      </div>
    </div>
  )
}
