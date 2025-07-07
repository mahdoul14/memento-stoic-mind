
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface VirtueTrackerProps {
  userId: string;
}

const virtues = [
  { name: "Courage", description: "Bravery in facing challenges" },
  { name: "Wisdom", description: "Sound judgment and knowledge" },
  { name: "Justice", description: "Fairness and moral righteousness" },
  { name: "Temperance", description: "Self-control and moderation" }
];

export const VirtueTracker = ({ userId }: VirtueTrackerProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [todaysRatings, setTodaysRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTodaysRatings();
  }, [userId]);

  const fetchTodaysRatings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('virtue_tracker')
        .select('virtue, rating')
        .eq('user_id', userId)
        .eq('date', today);

      if (error) throw error;

      const ratingsMap: Record<string, number> = {};
      data?.forEach(entry => {
        if (entry.virtue && entry.rating) {
          ratingsMap[entry.virtue] = entry.rating;
        }
      });
      
      setTodaysRatings(ratingsMap);
      setRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleRatingChange = (virtue: string, rating: number) => {
    setRatings(prev => ({ ...prev, [virtue]: rating }));
  };

  const saveRating = async (virtue: string, rating: number) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Use upsert with proper conflict resolution
      const { error } = await supabase
        .from('virtue_tracker')
        .upsert({
          user_id: userId,
          virtue: virtue,
          rating: rating,
          date: today
        }, {
          onConflict: 'user_id,virtue,date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Upsert error:', error);
        throw error;
      }

      setTodaysRatings(prev => ({ ...prev, [virtue]: rating }));
      
      toast({
        title: "Rating saved",
        description: `Your ${virtue.toLowerCase()} rating has been recorded.`,
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error",
        description: "Failed to save rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {virtues.map((virtue) => (
        <div key={virtue.name} className="space-y-3">
          <div>
            <h4 className="font-semibold text-black">{virtue.name}</h4>
            <p className="text-sm text-gray-600">{virtue.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 w-16">Poor</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(virtue.name, rating)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    (ratings[virtue.name] || 0) >= rating
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 w-16">Excellent</span>
            
            {ratings[virtue.name] && ratings[virtue.name] !== todaysRatings[virtue.name] && (
              <Button
                onClick={() => saveRating(virtue.name, ratings[virtue.name])}
                disabled={loading}
                size="sm"
                className="ml-2 bg-black text-white hover:bg-gray-800"
              >
                Save
              </Button>
            )}
          </div>
          
          {todaysRatings[virtue.name] && (
            <div className="text-xs text-green-600">
              ✓ Rated {todaysRatings[virtue.name]}/5 today
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
