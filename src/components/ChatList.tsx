import { Plus, LogOut } from "lucide-react";
import type { ChatPreview } from "../types";
import { Button, Avatar, AvatarFallback, ScrollArea } from "./ui";

interface ChatListProps {
  chats: Record<string, ChatPreview>;
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
  onLogout: () => void;
}

export default function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onOpenNewChat,
  onLogout,
}: ChatListProps) {
  const chatList = Object.values(chats).sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0),
  );

  return (
    <div className="w-1/3 min-w-75 border-r border-border bg-card/50 flex flex-col h-full">
      <div className="p-4 border-b border-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Чаты</h2>
          <Button variant="ghost" size="icon" onClick={onLogout} title="Выйти">
            <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
        <Button onClick={onOpenNewChat} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Начать новый чат
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {chatList.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Нет активных чатов
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {chatList.map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                        {chat.name.slice(-2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && !isActive && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={`font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}
                      >
                        +{chat.name}
                      </h3>
                      {chat.timestamp && (
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {new Date(chat.timestamp * 1000).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {chat.lastMessage || "Нет сообщений"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
