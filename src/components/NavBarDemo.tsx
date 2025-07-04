
import { User, Briefcase, DollarSign } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'About', url: '#about', icon: User },
    { name: 'Tools', url: '#tools', icon: Briefcase },
    { name: 'Pricing', url: '#pricing', icon: DollarSign }
  ]

  return <NavBar items={navItems} />
}
