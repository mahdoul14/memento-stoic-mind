
import { Home, Lightbulb, Library, TrendingUp } from "lucide-react";

export const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
          <Home className="w-5 h-5 text-black" />
          <span className="text-xs text-black font-medium">Today</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
          <Lightbulb className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Inspirations</span>
        </button>
        <button className="w-12 h-12 bg-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-gray-800">
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-0.5 bg-white"></div>
            <div className="w-0.5 h-4 bg-white absolute"></div>
          </div>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
          <Library className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Library</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 transition-transform duration-200 hover:scale-110">
          <TrendingUp className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">Journey</span>
        </button>
      </div>
    </div>
  );
};
