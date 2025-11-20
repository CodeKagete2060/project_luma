import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Copy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI homework assistant. I can help you understand concepts step-by-step. What would you like help with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Great question! Let me help you break this down step by step:\n\n1. First, let's identify what we know...\n2. Next, we'll apply the relevant concept...\n3. Finally, we'll solve it together!\n\nWould you like me to explain any specific part in more detail?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex items-center gap-2 p-4 border-b border-card-border">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AI Homework Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                {message.role === "user" ? "Y" : "AI"}
              </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col gap-1 max-w-[70%] ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "assistant" && (
                <Button variant="ghost" size="sm" className="h-7" data-testid="button-copy-message">
                  <Copy className="w-3 h-3" />
                  <span className="text-xs">Copy</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-card-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about your homework..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="resize-none min-h-[60px]"
            data-testid="input-chat-message"
          />
          <Button onClick={handleSend} size="icon" className="self-end" data-testid="button-send-message">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </Card>
  );
}
