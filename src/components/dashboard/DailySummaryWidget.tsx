
import { Card, CardContent } from "@/components/ui/card";

interface DailySummaryWidgetProps {
  animateCards: boolean;
}

export const DailySummaryWidget = ({ animateCards }: DailySummaryWidgetProps) => {
  return (
    <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`} style={{ animationDelay: '0.6s' }}>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-black mb-4">Daily Summary</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">How are you feeling?</span>
            <div className="flex gap-2">
              {['😊', '😐', '😔', '😤', '😌'].map((emoji, i) => (
                <button 
                  key={i} 
                  className="text-lg hover:scale-125 transition-transform duration-200 hover:rotate-12"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Sleep hours</span>
            <span className="text-black font-medium">7.5h</span>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-500 text-xs text-center">
              Remember to reflect on your day before sleep
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
