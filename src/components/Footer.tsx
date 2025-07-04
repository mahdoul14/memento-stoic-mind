
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="font-inter font-bold text-2xl text-black mb-4">
            MEMENTO
          </div>
          <p className="font-inter text-gray-600 mb-8 max-w-md mx-auto">
            Build discipline, clarity, and wisdom in the digital age.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors">Privacy</a>
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors">Terms</a>
            <a href="#" className="font-inter text-gray-500 hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
