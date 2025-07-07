
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  created_at: string;
}

interface RecentJournalEntriesProps {
  userId: string;
  refreshTrigger: number;
}

export const RecentJournalEntries = ({ userId, refreshTrigger }: RecentJournalEntriesProps) => {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentEntries();
  }, [userId, refreshTrigger]);

  const fetchRecentEntries = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, date, created_at')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error fetching recent journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEntries = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, date, created_at')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setAllEntries(data || []);
    } catch (error) {
      console.error('Error fetching all journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllToggle = () => {
    if (!showAll) {
      fetchAllEntries();
    }
    setShowAll(!showAll);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const entriesToShow = showAll ? allEntries : recentEntries;

  if (loading && entriesToShow.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading entries...
      </div>
    );
  }

  if (entriesToShow.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No journal entries yet. Start writing your first reflection!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          {showAll ? 'All Entries' : 'Recent Entries'}
        </h4>
        {(recentEntries.length >= 3 || showAll) && (
          <Button
            onClick={handleViewAllToggle}
            variant="ghost"
            size="sm"
            className="text-xs text-gray-600 hover:text-black p-1 h-auto"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-3 h-3 ml-1" />
              </>
            ) : (
              <>
                View All <ChevronDown className="w-3 h-3 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {entriesToShow.map((entry) => (
          <Card key={entry.id} className="bg-gray-50 border-gray-200">
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(entry.date)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
