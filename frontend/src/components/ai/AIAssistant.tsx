import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageCircle, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI flight assistant. I can help you find flights, manage bookings, and answer travel questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I understand you're looking for assistance. While my AI capabilities are being enhanced, I can help you navigate our platform. Would you like me to help you search for flights or manage your bookings?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-sky shadow-sky hover:scale-105 transition-transform"
        size="lg"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
    );
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 shadow-elevation border-border/50 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-sky rounded-full">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-sm font-medium">Flight Assistant</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about flights, bookings, or travel..."
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                size="sm"
                className="bg-gradient-sky hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIAssistant;