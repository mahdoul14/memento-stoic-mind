
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
    if (!year || year < 1900 || year > new Date().getFullYear()) {
      toast({
        title: "Invalid birth year",
        description: "Please enter a valid birth year between 1900 and current year.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          birth_year: year
        });

      if (error) throw error;

      onBirthYearSaved(year);
      toast({
        title: "Birth year saved",
        description: "Your timeline has been updated.",
      });
    } catch (error) {
      console.error('Error saving birth year:', error);
      toast({
        title: "Error saving birth year",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Input
          type="number"
          placeholder="Enter your birth year (e.g., 1990)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          min="1900"
          max={new Date().getFullYear()}
          className="text-center"
        />
      </div>
      <Button
        type="submit"
        disabled={saving || !birthYear}
        className="w-full bg-black text-white hover:bg-gray-800 font-medium rounded-full transition-all duration-200 hover:scale-105"
      >
        {saving ? 'Saving...' : 'Save Birth Year'}
      </Button>
    </form>
  );
};
