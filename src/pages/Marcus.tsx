
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  const [messages, setMessages] = useState<Message[]>([]);
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
          content: "You have power over your mind - not outside events. Realize this, and you will find strength.",
          virtue: "Discipline"
        },
        {
          content: "The best revenge is not to be like your enemy. Focus on what you can control, and let go of what you cannot.",
          virtue: "Justice"
        },
        {
          content: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
          virtue: "Temperance"
        },
        {
          content: "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.",
          virtue: "Courage"
        },
        {
          content: "Accept the things to which fate binds you, and love the people with whom fate brings you together.",
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect via useEffect)
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Ask Marcus Anything</h1>
          <p className="text-gray-500 text-lg">Speak your mind. He'll listen.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6">
        <ScrollArea className="flex-1 py-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">
                  Welcome. What weighs on your mind today?
                </p>
                <Separator className="my-8 opacity-30" />
              </div>
            )}

            {messages.map((message, index) => (
              <div key={message.id}>
                {index > 0 && (
                  <Separator className="my-6 opacity-20" />
                )}
                
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                    <div
                      className={`rounded-2xl px-6 py-4 ${
                        message.sender === 'user'
                          ? 'bg-white border border-gray-200 text-gray-900'
                          : 'bg-black text-white'
                      }`}
                    >
                      <p className={`text-base leading-relaxed ${
                        message.sender === 'marcus' ? 'font-serif' : ''
                      }`}>
                        {message.content}
                      </p>
                    </div>
                    
                    {message.virtue && (
                      <div className="mt-2 ml-2">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                          {message.virtue}
                        </span>
                      </div>
                    )}
                    
                    <div className={`mt-2 text-xs text-gray-400 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-2xl mr-12">
                  <div className="bg-black text-white rounded-2xl px-6 py-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Marcus is thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 py-4">
          <div className="flex gap-3 items-center">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask your question…"
              className="flex-1 rounded-xl border-gray-200 px-4 py-3 text-base focus:border-black focus:ring-black"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl bg-black hover:bg-gray-800 text-white p-3 transition-all duration-200 hover:scale-105"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marcus;
