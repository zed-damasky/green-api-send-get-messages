import { useState, useMemo, useCallback } from "react";
import type { Credentials, ChatMessageInterface, ChatPreview } from "../types";
import { sendMessage } from "../api/api";
import toast from "react-hot-toast";
import { normalizeChatId } from "../utils/chatUtils";

interface UseChatActionsReturn {
  activeChatId: string | null;
  chats: Record<string, ChatPreview>;
  messagesByChatId: Record<string, ChatMessageInterface[]>;
  isModalOpen: boolean;
  knownChatIds: Set<string>;
  handleSelectChat: (chatId: string) => void;
  handleSendMessage: (text: string) => Promise<void>;
  handleStartNewChat: (chatId: string) => void;
  handleIncomingMessage: (
    chatId: string,
    message: ChatMessageInterface,
  ) => void;
  openModal: () => void;
  closeModal: () => void;
}

export function useChatActions(credentials: Credentials): UseChatActionsReturn {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, ChatPreview>>({});
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, ChatMessageInterface[]>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const knownChatIds = useMemo(() => new Set(Object.keys(chats)), [chats]);

  const handleIncomingMessage = useCallback(
    (chatId: string, message: ChatMessageInterface) => {
      setMessagesByChatId((prev) => {
        const currentMessages = prev[chatId] || [];
        const isDuplicate = currentMessages.some(
          (msg) => msg.id === message.id,
        );
        if (isDuplicate) return prev;
        return { ...prev, [chatId]: [...currentMessages, message] };
      });

      setChats((prev) => {
        const existing = prev[chatId];
        if (!existing) return prev;
        const isUnread = activeChatId ? activeChatId !== chatId : true;
        return {
          ...prev,
          [chatId]: {
            ...existing,
            lastMessage: message.text,
            timestamp: message.timestamp,
            unreadCount: existing.unreadCount + (isUnread ? 1 : 0),
          },
        };
      });
    },
    [activeChatId],
  );

  const handleSelectChat = useCallback((chatId: string) => {
    const normalized = normalizeChatId(chatId);
    setActiveChatId(normalized);

    setChats((prev) => ({
      ...prev,
      [normalized]: { ...prev[normalized], unreadCount: 0 },
    }));
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeChatId) return;

      const normalizedActiveId = normalizeChatId(activeChatId);

      if (
        normalizedActiveId.length < 10 ||
        !normalizedActiveId.startsWith("7")
      ) {
        toast.error(`Ошибка: Некорректный ID чата (${normalizedActiveId}).`);
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
        [normalizedActiveId]: [
          ...(prev[normalizedActiveId] || []),
          tempMessage,
        ],
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
    },
    [activeChatId, credentials],
  );

  const handleStartNewChat = useCallback((chatId: string) => {
    const normalized = normalizeChatId(chatId);
    setChats((prev) => {
      if (prev[normalized]) return prev;
      return {
        ...prev,
        [normalized]: { id: normalized, name: normalized, unreadCount: 0 },
      };
    });
    setActiveChatId(normalized);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    activeChatId,
    chats,
    messagesByChatId,
    isModalOpen,
    knownChatIds,
    handleSelectChat,
    handleSendMessage,
    handleStartNewChat,
    handleIncomingMessage,
    openModal,
    closeModal,
  };
}
