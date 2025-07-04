
import { useEffect, useState } from "react";

interface MementoMoriGridProps {
  age: number;
}

export const MementoMoriGrid = ({ age }: MementoMoriGridProps) => {
  const [filledDots, setFilledDots] = useState(0);

  useEffect(() => {
    // Calculate weeks lived based on age
    const weeksLived = Math.floor((age * 365.25) / 7);
    // Cap at 100 to match our 10x10 grid
    const weeksToShow = Math.min(weeksLived, 100);
    
    // Animate dots filling in
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setFilledDots(prev => {
          if (prev >= weeksToShow) {
            clearInterval(interval);
            return weeksToShow;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [age]);

  const weeksLived = Math.floor((age * 365.25) / 7);
  const weeksRemaining = Math.max(0, 100 - weeksLived);

  return (
    <div>
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold text-black">{weeksLived}</div>
        <div className="text-sm text-gray-500">weeks lived</div>
      </div>
      
      {/* 10x10 Grid of Dots representing weeks */}
      <div className="grid grid-cols-10 gap-1 justify-center max-w-[200px] mx-auto mb-4">
        {[...Array(100)].map((_, index) => {
          const weekNumber = index + 1;
          const isFilled = index < filledDots;
          const isCurrentWeek = index === Math.floor((age * 365.25) / 7) - 1;
          
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border transition-all duration-200 hover:scale-125 cursor-pointer ${
                isFilled 
                  ? isCurrentWeek 
                    ? 'bg-red-500 border-red-600' 
                    : 'bg-black border-black'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              title={`Week ${weekNumber}`}
              style={{
                transitionDelay: `${index * 10}ms`
              }}
            />
          );
        })}
      </div>
      
      <div className="text-center text-xs text-gray-500">
        {weeksRemaining} weeks remaining (based on 100-week visualization)
      </div>
    </div>
  );
};
