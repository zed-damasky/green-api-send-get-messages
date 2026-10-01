import { useState } from "react";
import { Button, Input } from "./ui";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (chatId: string) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onStartChat,
}: NewChatModalProps) {
  const [chatId, setChatId] = useState("");
  const [chatIdError, setChatIdError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let digits = chatId.replace(/\D/g, "");
    console.log("[NewChatModal] Raw digits before submit:", digits);

    if (digits.length > 0 && digits[0] !== "7") {
      digits = "7" + digits;
    }

    console.log("[NewChatModal] Formatted digits to send:", digits);

    if (!/^\d{10,15}$/.test(digits)) {
      setChatIdError("Введите корректный номер (например, 79991234567)");
      return;
    }

    onStartChat(digits);
    onClose();
    setChatId("");
    setChatIdError("");
  };

  const handleChatIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setChatId(digits);

    if (digits.length > 0 && digits.length < 10) {
      setChatIdError(
        `Номер слишком короткий. Введено цифр: ${digits.length} (нужно 10)`,
      );
    } else {
      setChatIdError("");
    }
  };

  const isFormValid = /^\d{10}$/.test(chatId.replace(/\D/g, ""));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card p-6 rounded-2xl shadow-2xl w-full max-w-sm space-y-4 border border-border">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Новый чат</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="Номер телефона (например, 79991234567)"
              value={chatId}
              onChange={handleChatIdChange}
              className={
                chatIdError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              autoFocus
            />
            {chatIdError && (
              <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                {chatIdError}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button type="submit" className="flex-1" disabled={!isFormValid}>
              Начать чат
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
