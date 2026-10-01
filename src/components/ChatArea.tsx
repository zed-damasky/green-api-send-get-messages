import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type { ChatMessageInterface } from "../types";
import {
  Avatar,
  AvatarFallback,
  Button,
  CHAT_PATTERN_CONFIG,
  ScrollArea,
  Separator,
  Textarea,
} from "./ui";
import { SeamlessPatternBackground } from "./ui";
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
  activeChatId: string | null;
  messages: ChatMessageInterface[];
  onSendMessage: (text: string) => Promise<void>;
}

export default function ChatArea({
  activeChatId,
  messages,
  onSendMessage,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  if (!activeChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 relative overflow-hidden">
        <SeamlessPatternBackground
          gradient={CHAT_PATTERN_CONFIG.gradient}
          tileSize={CHAT_PATTERN_CONFIG.tileSize}
          svgs={CHAT_PATTERN_CONFIG.svgs}
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
        />

        <div className="text-center text-muted-foreground z-10 relative">
          <p className="text-lg font-medium">
            Создайте или выберите чат, чтобы начать общение
          </p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await onSendMessage(inputText);
    setInputText("");
  };

  const displayChatId = activeChatId.replace("@c.us", "");

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      <div className="bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-4 shadow-sm border-b border-border z-20 relative shrink-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {displayChatId.slice(-2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">+{displayChatId}</h3>
            <p className="text-xs text-green-600 font-medium">в сети</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col">
        <SeamlessPatternBackground
          gradient={CHAT_PATTERN_CONFIG.gradient}
          tileSize={CHAT_PATTERN_CONFIG.tileSize}
          svgs={CHAT_PATTERN_CONFIG.svgs}
          className="pointer-events-none absolute inset-0 z-0"
        />
        <ScrollArea className="relative flex-1 h-full w-full p-4 z-10 bg-transparent">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full text-muted-foreground text-sm shadow-sm border">
                История сообщений пуста. Напишите первое сообщение!
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      <Separator className="z-20 relative shrink-0" />

      <div className="bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-3 flex items-end gap-2 border-t border-border z-20 relative shrink-0">
        <Textarea
          className="flex-1 min-h-10 max-h-32 resize-none bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary transition-all rounded-2xl py-3"
          placeholder="Сообщение"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="rounded-full h-10 w-10 shrink-0 transition-all"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
