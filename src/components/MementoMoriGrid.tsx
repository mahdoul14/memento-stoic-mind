
import { useEffect, useState } from "react";

interface MementoMoriGridProps {
  age: number;
}

export const MementoMoriGrid = ({ age }: MementoMoriGridProps) => {
  const [filledDots, setFilledDots] = useState(0);

  useEffect(() => {
    // Animate dots filling in
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setFilledDots(prev => {
          if (prev >= age) {
            clearInterval(interval);
            return age;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [age]);

  return (
    <div>
      <div className="mb-4 text-center">
        <div className="text-2xl font-bold text-black">{age}</div>
        <div className="text-sm text-gray-500">years lived</div>
      </div>
      
      {/* 10x10 Grid of Dots */}
      <div className="grid grid-cols-10 gap-1 justify-center max-w-[200px] mx-auto mb-4">
        {[...Array(100)].map((_, index) => {
          const yearNumber = index + 1;
          const isFilled = index < filledDots;
          const isCurrentYear = index === age - 1;
          
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border transition-all duration-200 hover:scale-125 cursor-pointer ${
                isFilled 
                  ? isCurrentYear 
                    ? 'bg-red-500 border-red-600' 
                    : 'bg-black border-black'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              title={`Year ${yearNumber}: Age ${yearNumber - 1}`}
              style={{
                transitionDelay: `${index * 10}ms`
              }}
            />
          );
        })}
      </div>
      
      <div className="text-center text-xs text-gray-500">
        {100 - age} years remaining (assuming 100 year lifespan)
      </div>
    </div>
  );
};
