
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Footer = () => {
  const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation();

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-6">
        <div 
          ref={footerRef}
          className={`text-center transition-all duration-700 ease-out ${
            footerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="font-inter font-bold text-2xl text-black mb-4">
            MEMENTO
          </div>
          <p className="font-inter text-gray-600 mb-8 max-w-md mx-auto">
            Build discipline, clarity, and wisdom in the digital age.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors hover:scale-105 duration-200 ease-in-out">Terms</a>
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors hover:scale-105 duration-200 ease-in-out">Privacy</a>
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors hover:scale-105 duration-200 ease-in-out">Built with Lovable</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
