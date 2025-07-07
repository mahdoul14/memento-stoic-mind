
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface VirtueTrackerProps {
  userId: string;
}

const virtues = [
  { name: "Courage", key: "courage" as const, icon: "🛡️" },
  { name: "Wisdom", key: "wisdom" as const, icon: "🧠" },
  { name: "Justice", key: "justice" as const, icon: "⚖️" },
  { name: "Temperance", key: "temperance" as const, icon: "🌿" }
];

export const VirtueTracker = ({ userId }: VirtueTrackerProps) => {
  const [ratings, setRatings] = useState({
    courage: 0,
    wisdom: 0,
    justice: 0,
    temperance: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (virtue: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [virtue]: rating
    }));
  };

  const handleSubmit = async () => {
    // Check if all virtues have been rated
    const unratedVirtues = Object.entries(ratings).filter(([_, rating]) => rating === 0);
    if (unratedVirtues.length > 0) {
      toast({
        title: "Please rate all virtues",
        description: "You need to provide a rating for each virtue before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting virtue ratings:', ratings);
      
      const { data, error } = await supabase
        .from('virtue_entries')
        .insert({
          user_id: userId,
          courage: ratings.courage,
          wisdom: ratings.wisdom,
          justice: ratings.justice,
          temperance: ratings.temperance,
          date: new Date().toISOString().split('T')[0]
        })
        .select();

      console.log('Virtue submission result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Reset ratings after successful submission
      setRatings({
        courage: 0,
        wisdom: 0,
        justice: 0,
        temperance: 0
      });

      toast({
        title: "Virtues tracked successfully",
        description: "Your virtue ratings have been saved for today.",
      });
    } catch (error) {
      console.error('Error saving virtue ratings:', error);
      toast({
        title: "Error saving ratings",
        description: error instanceof Error ? error.message : "There was a problem saving your virtue ratings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {virtues.map((virtue) => (
          <div key={virtue.key} className="flex flex-col items-center space-y-3">
            {/* Virtue Icon and Name */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg hover:bg-gray-200 transition-colors duration-200">
                {virtue.icon}
              </div>
              <span className="text-sm font-medium text-gray-800">{virtue.name}</span>
            </div>

            {/* Rating Dots */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(virtue.key, rating)}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    ratings[virtue.key] >= rating
                      ? 'bg-black border-black'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
              ))}
            </div>

            {/* Current Rating Display */}
            <div className="text-xs text-gray-500">
              {ratings[virtue.key] > 0 ? ratings[virtue.key] : '-'}/5
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || Object.values(ratings).every(rating => rating === 0)}
          className="bg-black text-white hover:bg-gray-800 font-medium rounded-full px-8 py-2 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          {isSubmitting ? 'Saving...' : 'Track Virtues'}
        </Button>
      </div>
    </div>
  );
};
