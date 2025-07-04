
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="font-inter font-bold text-xl tracking-tight text-black">
          MEMENTO
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#tools" className="font-inter font-medium text-gray-600 hover:text-black transition-colors">
            Tools
          </a>
          <a href="#resources" className="font-inter font-medium text-gray-600 hover:text-black transition-colors">
            Resources
          </a>
          <a href="#about" className="font-inter font-medium text-gray-600 hover:text-black transition-colors">
            About
          </a>
        </nav>
        
        <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 font-inter font-medium">
          Create Account
        </Button>
      </div>
    </header>
  );
};

export default Header;
