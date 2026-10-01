import { useEffect, useRef } from "react";
import type {
  Credentials,
  ChatMessageInterface,
  ApiNotification,
} from "../types";
import { receiveNotification, deleteNotification } from "../api/api";
import { getPhoneNumberFromNotification } from "../utils/chatUtils";

interface UseChatPollingOptions {
  credentials: Credentials;
  activeChatId: string | null;
  knownChatIds: Set<string>;
  onIncomingMessage: (chatId: string, message: ChatMessageInterface) => void;
}

export function useChatPolling({
  credentials,
  activeChatId,
  knownChatIds,
  onIncomingMessage,
}: UseChatPollingOptions) {
  const activeChatIdRef = useRef(activeChatId);
  const knownChatIdsRef = useRef(knownChatIds);
  const onIncomingMessageRef = useRef(onIncomingMessage);
  const processedReceiptIds = useRef<Set<number>>(new Set());

  activeChatIdRef.current = activeChatId;
  knownChatIdsRef.current = knownChatIds;
  onIncomingMessageRef.current = onIncomingMessage;

  useEffect(() => {
    let isPolling = false;
    let isMounted = true;

    const poll = async () => {
      if (isPolling || !isMounted) return;
      isPolling = true;

      try {
        const notification: ApiNotification | null =
          await receiveNotification(credentials);

        if (!isMounted) return;

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

            if (knownChatIdsRef.current.has(phoneNumber)) {
              onIncomingMessageRef.current(phoneNumber, newMessage);
            } else {
              console.log(
                `[useChatPolling] Входящее от неизвестного чата ${phoneNumber}.`,
              );
            }
          }

          processedReceiptIds.current.add(notification.receiptId);

          if (processedReceiptIds.current.size > 500) {
            const arr = Array.from(processedReceiptIds.current);
            processedReceiptIds.current = new Set(arr.slice(-250));
          }

          await deleteNotification(credentials, notification.receiptId);
        }
      } catch (error) {
        console.error("[useChatPolling] Ошибка опроса:", error);
      } finally {
        isPolling = false;
      }
    };

    const pollInterval = setInterval(poll, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [credentials]);
}
