
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MarcusGPTWidgetProps {
  animateCards: boolean;
  typingDots: string;
  onOpenChat: () => void;
}

export const MarcusGPTWidget = ({ animateCards, typingDots, onOpenChat }: MarcusGPTWidgetProps) => {
  return (
    <Card className={`bg-black text-white rounded-3xl shadow-lg transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 hover:bg-gray-900 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`} style={{ animationDelay: '0.1s' }}>
      <CardContent className="p-6 relative overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Talk to Marcus</h3>
          <div className="text-gray-300 text-sm leading-relaxed mb-2">
            "Reflect on your day with Stoic wisdom and guidance{typingDots}"
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none opacity-0 hover:opacity-100"></div>
        </div>
        <Button 
          onClick={onOpenChat}
          className="w-full bg-white text-black hover:bg-gray-100 font-medium rounded-full transition-all duration-200 hover:scale-105"
        >
          Open Chat
        </Button>
      </CardContent>
    </Card>
  );
};
