
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { VirtueTracker } from "@/components/VirtueTracker";

interface VirtueTrackerWidgetProps {
  userId: string;
  animateCards: boolean;
}

export const VirtueTrackerWidget = ({ userId, animateCards }: VirtueTrackerWidgetProps) => {
  return (
    <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`} style={{ animationDelay: '0.3s' }}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black">Virtue Tracker</h3>
        </div>
        
        <p className="text-gray-700 text-sm mb-6">Rate yourself on the four Stoic virtues today.</p>
        
        <VirtueTracker userId={userId} />
      </CardContent>
    </Card>
  );
};
