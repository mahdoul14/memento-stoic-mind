
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface DailyInspirationWidgetProps {
  animateCards: boolean;
}

export const DailyInspirationWidget = ({ animateCards }: DailyInspirationWidgetProps) => {
  const dailyQuote = {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  };

  return (
    <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`} style={{ animationDelay: '0.5s' }}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg transition-transform duration-200 hover:scale-110">
            <Lightbulb className="w-5 h-5 text-black" />
          </div>
          <h3 className="text-lg font-bold text-black">Daily Inspiration</h3>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 transition-all duration-300 hover:bg-gray-100">
          <p className="text-gray-800 text-sm leading-relaxed italic mb-3">
            "{dailyQuote.text}"
          </p>
          <p className="text-gray-500 text-xs text-right">— {dailyQuote.author}</p>
        </div>
      </CardContent>
    </Card>
  );
};
