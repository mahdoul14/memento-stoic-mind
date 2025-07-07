
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface MementoMoriGridProps {
  age: number;
  onEditBirthYear: () => void;
}

export const MementoMoriGrid = ({ age, onEditBirthYear }: MementoMoriGridProps) => {
  const [filledDots, setFilledDots] = useState(0);
  const lifeExpectancy = 90;
  const yearsRemaining = Math.max(0, lifeExpectancy - age);

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
      }, 50);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [age]);

  return (
    <div className="space-y-6">
      {/* Age Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-black mb-2">
          You are currently {age} years old
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Projected lifespan: {lifeExpectancy} years
        </div>
      </div>

      {/* 10x10 Grid of Dots representing years */}
      <div className="grid grid-cols-10 gap-3 justify-center max-w-[300px] mx-auto">
        {[...Array(100)].map((_, index) => {
          const yearNumber = index + 1;
          const isFilled = index < filledDots;
          const isCurrentYear = index === age - 1;
          
          return (
            <div
              key={index}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-125 cursor-pointer ${
                isFilled 
                  ? isCurrentYear 
                    ? 'bg-red-500 border-red-600 shadow-lg' 
                    : 'bg-black border-black'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
              title={`Year ${yearNumber}`}
              style={{
                transitionDelay: `${index * 20}ms`
              }}
            />
          );
        })}
      </div>
      
      {/* Statistics */}
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-black">
          {age} years lived • {yearsRemaining} years remaining
        </div>
        <div className="text-sm text-gray-500">
          Each dot represents one year of life
        </div>
      </div>

      {/* Edit Birth Year Button */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditBirthYear}
          className="text-gray-600 hover:text-black border-gray-300 hover:border-black"
        >
          Edit Birth Year
        </Button>
      </div>
    </div>
  );
};
