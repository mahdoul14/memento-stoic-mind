
import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);

  const handleBirthYearSaved = (year: number) => {
    onBirthYearSaved(year);
    setIsEditing(false);
  };

  const handleEditBirthYear = () => {
    setIsEditing(true);
  };

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
        
        <p className="text-gray-700 text-sm mb-6">A visual reminder that time is finite and precious.</p>
        
        {loadingProfile ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <div className="text-gray-500 text-sm">Loading your timeline...</div>
          </div>
        ) : !birthYear || isEditing ? (
          <div className="space-y-6">
            {!birthYear && (
              <>
                {/* Show empty grid first */}
                <div className="grid grid-cols-10 gap-3 justify-center max-w-[300px] mx-auto mb-6">
                  {[...Array(100)].map((_, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300"
                    />
                  ))}
                </div>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-black mb-2">0 years lived</div>
                  <div className="text-sm text-gray-500 mb-4">
                    Enter your birth year to visualize your life timeline
                  </div>
                </div>
              </>
            )}
            <BirthYearForm userId={userId} onBirthYearSaved={handleBirthYearSaved} />
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-black transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <MementoMoriGrid age={age} onEditBirthYear={handleEditBirthYear} />
        )}
      </CardContent>
    </Card>
  );
};
