import type { ChatMessageInterface } from "../types";

interface ChatMessageProps {
  message: ChatMessageInterface;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { isIncoming, text, timestamp } = message;

  return (
    <div className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow-sm text-sm backdrop-blur-sm wrap-break-word ${
          isIncoming
            ? "bg-card/90 border border-border rounded-tl-none"
            : "bg-primary text-primary-foreground border border-primary rounded-tr-none"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        
        <p className="text-[10px] text-right mt-1.5 flex items-center justify-end gap-1">
          {new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          
          {!isIncoming && (
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
            </svg>
          )}
        </p>
      </div>
    </div>
  );
}