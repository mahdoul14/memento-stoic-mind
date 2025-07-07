
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

interface UseChatMessagesProps {
  userId: string | undefined;
  limit?: number;
}

export const useChatMessages = ({ userId, limit = 5 }: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchMessages = async (fetchAll = false) => {
    if (!userId) return;

    setLoading(true);
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!fetchAll) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (fetchAll) {
        setAllMessages(data || []);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string): Promise<string> => {
    if (!userId) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-marcus', {
        body: {
          message,
          userId,
        },
      });

      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }

      // Refresh messages after successful send
      await fetchMessages(showAll);
      
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const toggleShowAll = () => {
    if (!showAll) {
      fetchMessages(true);
    }
    setShowAll(!showAll);
  };

  useEffect(() => {
    fetchMessages();
  }, [userId, limit]);

  return {
    messages: showAll ? allMessages : messages,
    loading,
    showAll,
    sendMessage,
    toggleShowAll,
    refreshMessages: () => fetchMessages(showAll),
  };
};
