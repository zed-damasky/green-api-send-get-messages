import toast from "react-hot-toast";
import type { Credentials, ApiNotification } from "../types";

interface SendMessagePayload extends Credentials {
  chatId: string;
}

const BASE_URL = `${import.meta.env.VITE_GREEN_API_BASE_URL}/waInstance`;

export const sendMessage = async (
  payload: SendMessagePayload,
  message: string,
): Promise<void> => {
  console.log("[DEBUG] Отправка сообщения. Payload:", {
    chatId: payload.chatId,
    messageLength: message.length,
  });

  const response = await fetch(
    `${BASE_URL}${payload.idInstance}/sendMessage/${payload.apiTokenInstance}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: payload.chatId, message }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[DEBUG] Ошибка ответа сервера:", errorText);
    toast.error(`Ошибка отправки: ${response.statusText}`);
    throw new Error(`Ошибка отправки: ${errorText}`);
  }
};

export const receiveNotification = async (
  credentials: Credentials,
): Promise<ApiNotification | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}${credentials.idInstance}/receiveNotification/${credentials.apiTokenInstance}`,
    );

    if (!response.ok) return null;

    const text = await response.text();
    if (!text || text === "null") return null;

    return JSON.parse(text);
  } catch (error) {
    console.error("Ошибка receiveNotification:", error);
    return null;
  }
};

export const deleteNotification = async (
  credentials: Credentials,
  receiptId: number,
): Promise<void> => {
  try {
    const url = `${BASE_URL}${credentials.idInstance}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`;

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.warn(
        `[Green-API] Не удалось удалить  ${receiptId}. Status: ${response.status}`,
      );
    }
  } catch (error) {
    console.error(
      `[Green-API] Ошибка при удалении  ${receiptId}:`,
      error,
    );
  }
};
