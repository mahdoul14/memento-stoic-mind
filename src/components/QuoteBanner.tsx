
import { Hourglass } from "lucide-react";

const QuoteBanner = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <Hourglass className="w-8 h-8 text-black" />
          </div>
          <blockquote className="font-inter text-2xl lg:text-3xl text-black font-medium italic mb-4 leading-relaxed">
            "You could leave life right now. Let that determine what you do and say and think."
          </blockquote>
          <cite className="font-inter text-lg text-gray-600 font-medium">
            — Marcus Aurelius
          </cite>
        </div>
      </div>
    </section>
  );
};

export default QuoteBanner;
