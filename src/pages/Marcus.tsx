
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'marcus';
  timestamp: Date;
  virtue?: string;
}

const Marcus = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "How do I handle difficult people?",
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: "2",
      content: "Remember that their actions reflect their character, not yours.\n\nMeet their weakness with your strength, their anger with your patience.\n\nYou cannot control their behavior, only your response to it.",
      sender: 'marcus',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only redirect if we're sure there's no user after loading is complete
  useEffect(() => {
    if (!loading && !user) {
      console.log('No authenticated user, redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && user) {
      inputRef.current.focus();
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate Marcus thinking and responding
    setTimeout(() => {
      const marcusResponses = [
        {
          content: "You have power over your mind — not outside events.\n\nRealize this, and you will find strength.",
          virtue: "Discipline"
        },
        {
          content: "The best revenge is not to be like your enemy.\n\nFocus on what you can control, and let go of what you cannot.",
          virtue: "Justice"
        },
        {
          content: "Very little is needed to make a happy life.\n\nIt is all within yourself, in your way of thinking.",
          virtue: "Temperance"
        },
        {
          content: "When you wake up in the morning, tell yourself:\n\nThe people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.\n\nThey are like this because they can't tell good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.",
          virtue: "Courage"
        },
        {
          content: "Accept the things to which fate binds you,\nand love the people with whom fate brings you together.",
          virtue: "Wisdom"
        }
      ];

      const randomResponse = marcusResponses[Math.floor(Math.random() * marcusResponses.length)];
      
      const marcusMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        sender: 'marcus',
        timestamp: new Date(),
        virtue: randomResponse.virtue,
      };

      setMessages(prev => [...prev, marcusMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-lg text-stone-600 font-inter">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-lg text-stone-600 font-inter">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/20 font-inter flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Subtle ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-radial from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-radial from-stone-100/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header Navigation */}
      <motion.header 
        className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-stone-200/40 px-6 py-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-stone-100/60 rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} className="text-stone-600" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏛️</div>
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">MarcusGPT</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-stone-100/60 rounded-xl transition-all duration-200"
          >
            <Settings size={20} className="text-stone-600" />
          </Button>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 relative z-10">
        <ScrollArea className="flex-1 py-8" ref={scrollAreaRef}>
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1] 
                  }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div 
                    className={`max-w-2xl ${message.sender === 'user' ? 'ml-16' : 'mr-16'}`}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    {message.sender === 'marcus' ? (
                      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200/30 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 mr-4 flex items-center justify-center overflow-hidden border border-stone-300/20">
                            <div className="text-xl text-stone-700">👤</div>
                          </div>
                          <div>
                            <div className="font-serif text-lg font-medium text-stone-800">Marcus Aurelius</div>
                            <div className="text-sm text-stone-500">Moments ago</div>
                          </div>
                        </div>
                        
                        <div className="font-serif text-stone-700 leading-relaxed text-lg whitespace-pre-line">
                          {message.content}
                        </div>
                        
                        {message.virtue && (
                          <div className="mt-4">
                            <span className="text-xs text-stone-500 bg-stone-100/60 px-3 py-1 rounded-full">
                              {message.virtue}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-stone-100/60 backdrop-blur-sm rounded-3xl px-5 py-4 border border-stone-200/20">
                        <p className="text-stone-700 text-base font-medium">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-2xl mr-16">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-stone-200/30">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 mr-4 flex items-center justify-center border border-stone-300/20">
                          <div className="text-xl text-stone-700">👤</div>
                        </div>
                        <div>
                          <div className="font-serif text-lg font-medium text-stone-800">Marcus Aurelius</div>
                          <div className="text-sm text-stone-500">is thinking...</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.div 
                          className="w-2 h-2 bg-stone-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-stone-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-stone-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <motion.div 
          className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-stone-200/40 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send a message..."
                className="w-full rounded-2xl border-stone-200/40 bg-white/70 backdrop-blur-sm px-6 py-4 text-base focus:border-stone-300 focus:ring-stone-300/20 shadow-sm hover:shadow-md transition-all duration-200 font-inter"
                disabled={isTyping}
              />
              {!inputValue && !isTyping && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                  <motion.div 
                    className="w-1 h-1 bg-stone-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-stone-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-1 h-1 bg-stone-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Marcus;
