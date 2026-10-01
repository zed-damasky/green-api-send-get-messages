import { useState, useEffect, useRef } from "react";
import type {
  Credentials,
  ChatMessageInterface,
  ChatPreview,
  ApiNotification,
} from "../types";
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
} from "../api/api";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import NewChatModal from "./NewChatModal";
import toast from "react-hot-toast";

interface ChatWindowProps {
  credentials: Credentials;
  onLogout: () => void;
}

const normalizeChatId = (id: string): string => {
  return id
    .replace(/@c\.us$/i, "")
    .replace(/@g\.us$/i, "")
    .replace(/@s\.whatsapp\.net$/i, "")
    .replace(/\D/g, "");
};

const getPhoneNumberFromNotification = (
  notification: ApiNotification,
): string => {
  if (notification.body.typeWebhook !== "incomingMessageReceived") {
    return "";
  }

  const { senderData } = notification.body;

  if (senderData.senderPhoneNumber && senderData.senderPhoneNumber !== 0) {
    const phone = String(senderData.senderPhoneNumber);
    if (phone.startsWith("7")) return phone;
    if (phone.length >= 10) return "7" + phone;
    return phone;
  }

  return normalizeChatId(senderData.chatId || senderData.sender);
};

export default function ChatWindow({ credentials, onLogout }: ChatWindowProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, ChatPreview>>({});
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, ChatMessageInterface[]>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processedReceiptIds = useRef<Set<number>>(new Set());
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  useEffect(() => {
    let isPolling = false;

    const pollInterval = setInterval(async () => {
      if (isPolling) return;
      isPolling = true;

      try {
        const notification: ApiNotification | null =
          await receiveNotification(credentials);

        if (notification && notification.receiptId) {
          if (processedReceiptIds.current.has(notification.receiptId)) {
            await deleteNotification(credentials, notification.receiptId);
            isPolling = false;
            return;
          }

          if (
            notification.body.typeWebhook === "incomingMessageReceived" &&
            notification.body.messageData.typeMessage === "textMessage" &&
            notification.body.messageData.textMessageData?.textMessage
          ) {
            const phoneNumber = getPhoneNumberFromNotification(notification);
            const senderName =
              notification.body.senderData.senderName || phoneNumber;

            const newMessage: ChatMessageInterface = {
              id: notification.receiptId,
              text: notification.body.messageData.textMessageData.textMessage,
              sender: notification.body.senderData.sender,
              senderName,
              timestamp: notification.body.timestamp,
              isIncoming: true,
            };

            setMessagesByChatId((prev) => {
              if (!prev[phoneNumber] && !chatsRef.current[phoneNumber]) {
                console.log(
                  `[ChatWindow] Входящее сообщение от неизвестного чата: ${phoneNumber}.`,
                );
                return prev;
              }

              const currentMessages = prev[phoneNumber] || [];
              const isDuplicate = currentMessages.some(
                (msg) => msg.id === notification.receiptId,
              );
              if (isDuplicate) return prev;

              return {
                ...prev,
                [phoneNumber]: [...currentMessages, newMessage],
              };
            });

            setChats((prev) => {
              if (!prev[phoneNumber]) return prev;

              const existing = prev[phoneNumber];
              const isUnread = activeChatId
                ? activeChatId !== phoneNumber
                : true;

              return {
                ...prev,
                [phoneNumber]: {
                  ...existing,
                  lastMessage: newMessage.text,
                  timestamp: newMessage.timestamp,
                  unreadCount: existing.unreadCount + (isUnread ? 1 : 0),
                },
              };
            });
          }

          processedReceiptIds.current.add(notification.receiptId);

          if (processedReceiptIds.current.size > 500) {
            const arr = Array.from(processedReceiptIds.current);
            processedReceiptIds.current = new Set(arr.slice(-250));
          }

          await deleteNotification(credentials, notification.receiptId);
        }
      } catch (error) {
        console.error("Ошибка опроса:", error);
      } finally {
        isPolling = false;
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [credentials, activeChatId]);

  const handleSelectChat = (chatId: string) => {
    const normalized = normalizeChatId(chatId);
    setActiveChatId(normalized);
    setChats((prev) => ({
      ...prev,
      [normalized]: { ...prev[normalized], unreadCount: 0 },
    }));
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId) return;

    const normalizedActiveId = normalizeChatId(activeChatId);

    if (normalizedActiveId.length < 10 || !normalizedActiveId.startsWith("7")) {
      toast.error(`Ошибка: Некорректный ID чата (${normalizedActiveId}).`);
      console.error(
        "[ChatWindow] Попытка отправки на невалидный normalizedActiveId:",
        normalizedActiveId,
      );
      return;
    }

    const tempId = Date.now().toString();
    const tempMessage: ChatMessageInterface = {
      id: tempId,
      text,
      timestamp: Math.floor(Date.now() / 1000),
      isIncoming: false,
    };

    setMessagesByChatId((prev) => ({
      ...prev,
      [normalizedActiveId]: [...(prev[normalizedActiveId] || []), tempMessage],
    }));

    setChats((prev) => ({
      ...prev,
      [normalizedActiveId]: {
        ...prev[normalizedActiveId],
        lastMessage: text,
        timestamp: tempMessage.timestamp,
      },
    }));

    try {
      const formattedChatId = `${normalizedActiveId}@c.us`;
      console.log("[ChatWindow] Отправка сообщения на:", formattedChatId);
      await sendMessage({ ...credentials, chatId: formattedChatId }, text);
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setMessagesByChatId((prev) => ({
        ...prev,
        [normalizedActiveId]: (prev[normalizedActiveId] || []).filter(
          (msg) => msg.id !== tempId,
        ),
      }));
      toast.error("Не удалось отправить сообщение.");
    }
  };

  const handleStartNewChat = (chatId: string) => {
    const normalized = normalizeChatId(chatId);
    console.log("[ChatWindow] Создание нового чата с номером:", normalized);

    if (!chats[normalized]) {
      setChats((prev) => ({
        ...prev,
        [normalized]: { id: normalized, name: normalized, unreadCount: 0 },
      }));
    }
    setActiveChatId(normalized);
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-background shadow-2xl border-x border-border overflow-hidden">
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onOpenNewChat={() => setIsModalOpen(true)}
        onLogout={onLogout}
      />

      <ChatArea
        activeChatId={activeChatId}
        messages={activeChatId ? messagesByChatId[activeChatId] || [] : []}
        onSendMessage={handleSendMessage}
      />

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartChat={handleStartNewChat}
      />
    </div>
  );
}
