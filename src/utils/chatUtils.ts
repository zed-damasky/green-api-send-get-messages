import type { ApiNotification } from "../types";

export const normalizeChatId = (id: string): string => {
  return id
    .replace(/@c\.us$/i, "")
    .replace(/@g\.us$/i, "")
    .replace(/@s\.whatsapp\.net$/i, "")
    .replace(/\D/g, "");
};

export const getPhoneNumberFromNotification = (
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
