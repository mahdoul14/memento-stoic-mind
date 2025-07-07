
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface VirtueTrackerProps {
  userId: string;
}

const virtues = [
  { name: 'Courage', icon: '🛡️', description: 'Facing challenges bravely' },
  { name: 'Wisdom', icon: '🧠', description: 'Making sound judgments' },
  { name: 'Justice', icon: '⚖️', description: 'Acting fairly and righteously' },
  { name: 'Temperance', icon: '🌿', description: 'Practicing moderation' }
];

export const VirtueTracker = ({ userId }: VirtueTrackerProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [hasRatedToday, setHasRatedToday] = useState(false);

  // Check if user has already rated today
  useEffect(() => {
    const checkTodaysRatings = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('virtue_tracker')
          .select('virtue, rating')
          .eq('user_id', userId)
          .eq('date', today);

        if (error) {
          console.error('Error checking today\'s ratings:', error);
          return;
        }

        if (data && data.length > 0) {
          setHasRatedToday(true);
          const todaysRatings: Record<string, number> = {};
          data.forEach(entry => {
            if (entry.virtue && entry.rating) {
              todaysRatings[entry.virtue] = entry.rating;
            }
          });
          setRatings(todaysRatings);
        }
      } catch (error) {
        console.error('Error checking today\'s ratings:', error);
      }
    };

    if (userId) {
      checkTodaysRatings();
    }
  }, [userId]);

  const handleRatingChange = (virtue: string, rating: number) => {
    setRatings(prev => ({ ...prev, [virtue]: rating }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length === 0) {
      toast({
        title: "No ratings",
        description: "Please rate at least one virtue before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = Object.entries(ratings).map(([virtue, rating]) => ({
        user_id: userId,
        virtue,
        rating,
        date: today,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('virtue_tracker')
        .insert(entries);

      if (error) throw error;

      setHasRatedToday(true);
      toast({
        title: "Virtues tracked!",
        description: "Your daily virtue ratings have been saved.",
      });
    } catch (error) {
      console.error('Error saving virtue ratings:', error);
      toast({
        title: "Error",
        description: "Failed to save your virtue ratings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasRatedToday) {
    return (
      <div className="space-y-4">
        <div className="text-center text-green-600 text-sm mb-4">
          ✓ You've already tracked your virtues today.
        </div>
        <div className="grid grid-cols-2 gap-3">
          {virtues.map(virtue => (
            <div key={virtue.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{virtue.icon}</span>
                <span className="text-sm font-medium">{virtue.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {ratings[virtue.name] || 0}/5
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {virtues.map(virtue => (
        <div key={virtue.name} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{virtue.icon}</span>
            <div>
              <h4 className="font-medium text-black">{virtue.name}</h4>
              <p className="text-sm text-gray-600">{virtue.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleRatingChange(virtue.name, rating)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  ratings[virtue.name] >= rating
                    ? 'bg-black border-black text-white'
                    : 'border-gray-300 text-gray-400 hover:border-gray-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <Button 
        onClick={handleSubmit}
        disabled={loading || Object.keys(ratings).length === 0}
        className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-full transition-all duration-200 hover:scale-105"
      >
        {loading ? 'Saving...' : 'Track My Virtues'}
      </Button>
    </div>
  );
};
