
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface BirthYearFormProps {
  userId: string;
  onBirthYearSaved: (birthYear: number) => void;
}

export const BirthYearForm = ({ userId, onBirthYearSaved }: BirthYearFormProps) => {
  const [birthYear, setBirthYear] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    
    if (!year || year < 1900 || year > currentYear) {
      toast({
        title: "Invalid birth year",
        description: `Please enter a valid birth year between 1900 and ${currentYear}.`,
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      console.log('Attempting to save birth year:', year, 'for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          birth_year: year
        }, {
          onConflict: 'user_id'
        })
        .select();

      console.log('Upsert result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      onBirthYearSaved(year);
      toast({
        title: "Birth year saved",
        description: "Your life timeline has been updated.",
      });
    } catch (error) {
      console.error('Error saving birth year:', error);
      toast({
        title: "Error saving birth year",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="number"
          placeholder="Enter your birth year (e.g., 1990)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          min="1900"
          max={new Date().getFullYear()}
          className="text-center text-lg py-3"
        />
      </div>
      <Button
        type="submit"
        disabled={saving || !birthYear}
        className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-full transition-all duration-200 hover:scale-105 py-3"
      >
        {saving ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Saving...
          </div>
        ) : (
          'Save Birth Year'
        )}
      </Button>
    </form>
  );
};
