
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { RecentJournalEntries } from "@/components/RecentJournalEntries";

interface JournalWidgetProps {
  userId: string;
  hasEntryToday: boolean;
  checkingEntry: boolean;
  animateCards: boolean;
  onEntryCreated: () => void;
}

export const JournalWidget = ({ 
  userId, 
  hasEntryToday, 
  checkingEntry, 
  animateCards,
  onEntryCreated 
}: JournalWidgetProps) => {
  const [isJournalExpanded, setIsJournalExpanded] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSaveJournal = async () => {
    if (!journalText.trim() || !userId) return;
    
    setIsSaving(true);
    try {
      console.log('Attempting to save journal entry for user:', userId);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          content: journalText.trim(),
          date: new Date().toISOString().split('T')[0]
        })
        .select();

      console.log('Journal save result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setJournalText('');
      setIsJournalExpanded(false);
      onEntryCreated();
      setRefreshTrigger(prev => prev + 1); // Trigger refresh of recent entries
      toast({
        title: "Saved successfully",
        description: "Your reflection has been saved.",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving",
        description: error instanceof Error ? error.message : "There was a problem saving your reflection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={`bg-white rounded-3xl shadow-lg border-0 transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-1 ${
      animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    } ${isJournalExpanded ? 'row-span-2' : ''}`} style={{ animationDelay: '0.2s' }}>
      <CardContent className="p-6 relative overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Today's Journal</h3>
          {checkingEntry ? (
            <div className="text-gray-600 text-sm leading-relaxed">
              Checking today's entry...
            </div>
          ) : hasEntryToday ? (
            <div className="text-green-600 text-sm leading-relaxed">
              ✓ You've already written your entry for today.
            </div>
          ) : (
            <div className="text-gray-600 text-sm leading-relaxed relative">
              <span className="hover:bg-gradient-to-r hover:from-gray-600 hover:via-gray-400 hover:to-gray-600 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                "What challenged your patience today?"
              </span>
            </div>
          )}
        </div>
        
        {/* Expandable content */}
        <div className={`transition-all duration-400 ease-out overflow-hidden ${
          isJournalExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-4 pt-4">
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[120px] resize-none border-gray-200 focus:border-black focus:ring-black"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveJournal}
                disabled={!journalText.trim() || isSaving}
                className="bg-black text-white hover:bg-gray-800 font-medium rounded-full transition-all duration-200 hover:scale-105"
              >
                {isSaving ? 'Saving...' : 'Save Reflection'}
              </Button>
              <Button
                onClick={() => {
                  setIsJournalExpanded(false);
                  setJournalText('');
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
        
        {!isJournalExpanded && !hasEntryToday && !checkingEntry && (
          <Button 
            onClick={() => setIsJournalExpanded(true)}
            variant="outline" 
            className="w-full border-2 border-black text-black hover:bg-black hover:text-white font-medium rounded-full transition-all duration-200 hover:scale-105 mb-4"
          >
            Write Now
          </Button>
        )}

        {/* Recent Entries Section */}
        {!isJournalExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <RecentJournalEntries 
              userId={userId} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
