
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { BirthYearForm } from "@/components/BirthYearForm";
import { MementoMoriGrid } from "@/components/MementoMoriGrid";

interface MementoMoriWidgetProps {
  userId: string;
  birthYear: number | null;
  age: number;
  loadingProfile: boolean;
  animateCards: boolean;
  onBirthYearSaved: (year: number) => void;
}

export const MementoMoriWidget = ({ 
  userId, 
  birthYear, 
  age, 
  loadingProfile, 
  animateCards, 
  onBirthYearSaved 
}: MementoMoriWidgetProps) => {
  return (
    <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`} style={{ animationDelay: '0.4s' }}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
            <Clock className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black">Memento Mori</h3>
        </div>
        
        <p className="text-gray-700 text-sm mb-4">A visual reminder that time is finite.</p>
        
        {loadingProfile ? (
          <div className="text-gray-500 text-sm">Loading your timeline...</div>
        ) : !birthYear ? (
          <div className="space-y-6">
            {/* Show empty grid first */}
            <div className="grid grid-cols-10 gap-2 justify-center max-w-[240px] mx-auto">
              {[...Array(100)].map((_, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full bg-gray-100 border border-gray-300"
                />
              ))}
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">0</div>
              <div className="text-sm text-gray-500 mb-4">weeks lived</div>
              <div className="text-gray-500 text-sm text-center mb-4">
                Enter your birth year to view your timeline.
              </div>
            </div>
            <BirthYearForm userId={userId} onBirthYearSaved={onBirthYearSaved} />
          </div>
        ) : (
          <MementoMoriGrid age={age} />
        )}
      </CardContent>
    </Card>
  );
};
