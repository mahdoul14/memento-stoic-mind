
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Settings, ChevronDown, Check, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
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
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    messages: chatHistory, 
    loading: messagesLoading, 
    showAll, 
    sendMessage, 
    toggleShowAll 
  } = useChatMessages({ userId: user?.id });

  // Convert chat history to message format
  const messages: Message[] = chatHistory.flatMap(chat => [
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
      virtue: "Wisdom"
    }
  ]).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

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
    if (!inputValue.trim() || isTyping) return;

    setInputValue("");
    setIsTyping(true);

    try {
      await sendMessage(inputValue);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
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
          
          <div className="flex items-center gap-2">
            {chatHistory.length > 0 && (
              <Button
                onClick={toggleShowAll}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-stone-100/60 rounded-xl transition-all duration-200 text-xs"
              >
                {showAll ? (
                  <>
                    Recent <ChevronUp size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    All <ChevronDown size={16} className="ml-1" />
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-stone-100/60 rounded-xl transition-all duration-200"
            >
              <Settings size={20} className="text-stone-600" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 relative z-10">
        <ScrollArea className="flex-1 py-8" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && !messagesLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="text-center text-stone-500 py-8">
                  <h3 className="text-lg font-medium mb-2">Welcome to MarcusGPT</h3>
                  <p>Ask Marcus Aurelius for Stoic wisdom and guidance</p>
                </div>
              </motion.div>
            )}

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

      {/* Memento Mori AI Accordion Section */}
      <motion.div 
        className="bg-white border-t border-stone-200/40 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between py-8 text-left hover:bg-stone-50/40 transition-colors duration-200 group"
            whileHover={{ scale: 1.001 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-stone-800 group-hover:text-stone-900 transition-colors">
              What is Memento Mori AI?
            </h2>
            <motion.div
              animate={{ rotate: isAccordionOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown size={24} className="text-stone-600 group-hover:text-stone-800 transition-colors" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isAccordionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pb-12 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                  >
                    <h3 className="text-3xl font-bold text-stone-900 mb-6 font-serif">
                      Built with AI. Trained on Wisdom.
                    </h3>
                    <motion.p 
                      className="text-lg text-stone-700 leading-relaxed mb-8 font-inter"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Memento isn't just another app — it's a quiet thinking partner, trained on the writings of Marcus Aurelius, Seneca, and Epictetus.<br />
                      Powered by GPT-4, it helps you reflect deeply, respond wisely, and move through life with intention.<br />
                      No fluff. No noise. Just timeless clarity — when you need it most.
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="grid gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {[
                      "Ask better questions, get Stoic answers",
                      "Stay calm and focused in modern chaos", 
                      "Turn reflection into a daily habit",
                      "AI-powered clarity, grounded in ancient wisdom"
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check size={14} className="text-emerald-600" />
                        </div>
                        <span className="text-stone-700 font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Marcus;
