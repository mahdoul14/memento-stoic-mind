
import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useChatMessages } from '@/hooks/useChatMessages';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showExpanded, setShowExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    messages: chatHistory, 
    loading: messagesLoading, 
    showAll, 
    sendMessage, 
    toggleShowAll,
    refreshMessages 
  } = useChatMessages({ userId: user?.id, limit: 5 });

  // Convert chat history to message format for display
  const allMessages = chatHistory.flatMap(chat => [
    {
      id: `${chat.id}-user`,
      content: chat.user_message,
      sender: 'user' as const,
      timestamp: new Date(chat.created_at),
    },
    {
      id: `${chat.id}-marcus`,
      content: chat.ai_response,
      sender: 'marcus' as const,
      timestamp: new Date(chat.created_at),
    }
  ]).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const displayMessages = showExpanded ? allMessages : allMessages.slice(-10);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [displayMessages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Typewriter effect for Marcus responses
  useEffect(() => {
    if (isTyping && typewriterText) {
      const lastMessage = displayMessages[displayMessages.length - 1];
      if (lastMessage && lastMessage.sender === 'marcus') {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex < lastMessage.content.length) {
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            setTypewriterText('');
          }
        }, 30);
        return () => clearInterval(interval);
      }
    }
  }, [isTyping, typewriterText, displayMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping || !user) return;

    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendMessage(messageToSend);
      setTypewriterText(response);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleClearConversation = async () => {
    // For now, just refresh to show the latest messages
    // In a full implementation, you might want to add a delete endpoint
    await refreshMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105"
        >
          <MessageSquare size={24} />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />
            
            {/* Chat Panel */}
            <motion.div
              className="fixed top-4 right-4 bottom-4 w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col overflow-hidden"
              initial={{ opacity: 0, x: 400, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 400, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                    <div className="text-lg">👤</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Marcus Aurelius</h3>
                    <p className="text-xs text-gray-500">Stoic Philosopher</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chatHistory.length > 5 && (
                    <Button
                      onClick={() => {
                        setShowExpanded(!showExpanded);
                        toggleShowAll();
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {showExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  )}
                  <Button
                    onClick={handleClearConversation}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <RotateCcw size={16} />
                  </Button>
                  <Button
                    onClick={onToggle}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {displayMessages.length === 0 && !messagesLoading && (
                    <div className="text-center text-gray-500 py-8">
                      <h4 className="font-medium mb-2">Welcome to MarcusGPT</h4>
                      <p className="text-sm">Ask Marcus Aurelius for Stoic wisdom and guidance</p>
                    </div>
                  )}

                  <AnimatePresence>
                    {displayMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            message.sender === 'user' 
                              ? 'bg-blue-500 text-white ml-8' 
                              : 'bg-gray-100 text-gray-900 mr-8'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.sender === 'marcus' && isTyping && index === displayMessages.length - 1
                              ? message.content.substring(0, typewriterText.length)
                              : message.content
                            }
                            {message.sender === 'marcus' && isTyping && index === displayMessages.length - 1 && (
                              <span className="animate-pulse">|</span>
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && displayMessages[displayMessages.length - 1]?.sender !== 'marcus' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 rounded-2xl px-4 py-3 mr-8">
                          <div className="flex space-x-1">
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200/50 backdrop-blur-sm">
                <div className="flex gap-2 items-end">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask Marcus..."
                    className="flex-1 rounded-xl border-gray-300 bg-white/70 focus:border-blue-400 focus:ring-blue-400/20"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                  >
                    Send
                  </Button>
                </div>
                
                {/* Privacy Disclaimer */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Your conversations are private and stored securely.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
