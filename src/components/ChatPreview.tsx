
import { useState, FormEvent } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";

const ChatPreview = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "What should I focus on today?",
      sender: "user",
    },
    {
      id: 2,
      content: "Your task is to practice discipline — not to wait for motivation. Focus on what is within your control: your thoughts, your actions, your responses to what befalls you. The rest is merely noise.",
      sender: "ai",
    },
    {
      id: 3,
      content: "How do I handle difficult people?",
      sender: "user",
    },
    {
      id: 4,
      content: "Remember that their actions reflect their character, not yours. Meet their weakness with your strength, their anger with your patience. You cannot control their behavior, only your response to it.",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: input,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "The universe is change; life is opinion. Focus on controlling your judgments, not your circumstances.",
        "What stands in the way becomes the way. Every obstacle is an opportunity to practice virtue.",
        "You have power over your mind — not outside events. Realize this, and you will find strength.",
        "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.",
      ];
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: "ai",
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleAttachFile = () => {
    // Placeholder for file attachment
  };

  const handleMicrophoneClick = () => {
    // Placeholder for voice input
  };

  return (
    <section className="bg-gray-50 py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-inter font-bold text-4xl lg:text-5xl text-black mb-6 tracking-tight uppercase">
              Wisdom on Demand
            </h2>
            <p className="font-inter text-xl text-gray-600">
              Get personalized Stoic guidance from Marcus Aurelius himself
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gray-900 px-6 py-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="font-inter font-medium text-white ml-4">MarcusGPT</div>
            </div>
            
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-hidden">
                <ChatMessageList>
                  {messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      <ChatBubbleAvatar
                        className="h-8 w-8 shrink-0"
                        src={
                          message.sender === "user"
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&q=80&crop=faces&fit=crop"
                        }
                        fallback={message.sender === "user" ? "You" : "MA"}
                      />
                      <ChatBubbleMessage
                        variant={message.sender === "user" ? "sent" : "received"}
                        className={message.sender === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-800"}
                      >
                        {message.content}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}

                  {isLoading && (
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar
                        className="h-8 w-8 shrink-0"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&q=80&crop=faces&fit=crop"
                        fallback="MA"
                      />
                      <ChatBubbleMessage isLoading className="bg-gray-100" />
                    </ChatBubble>
                  )}
                </ChatMessageList>
              </div>

              <div className="p-4 border-t">
                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                >
                  <ChatInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Marcus Aurelius for wisdom..."
                    className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                  />
                  <div className="flex items-center p-3 pt-0 justify-between">
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleAttachFile}
                      >
                        <Paperclip className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleMicrophoneClick}
                      >
                        <Mic className="size-4" />
                      </Button>
                    </div>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-black hover:bg-gray-800">
                      Send Message
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;
