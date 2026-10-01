import type { Credentials } from "../types";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import NewChatModal from "./NewChatModal";
import { useChatPolling, useChatActions} from "../hooks";

interface ChatWindowProps {
  credentials: Credentials;
  onLogout: () => void;
}

export default function ChatWindow({ credentials, onLogout }: ChatWindowProps) {
  const {
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
  } = useChatActions(credentials);

  useChatPolling({
    credentials,
    activeChatId,
    knownChatIds,
    onIncomingMessage: handleIncomingMessage,
  });

  return (
    <div className="flex h-screen w-screen mx-auto bg-background shadow-2xl border-x border-border overflow-hidden">
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onOpenNewChat={openModal}
        onLogout={onLogout}
      />

      <ChatArea
        activeChatId={activeChatId}
        messages={activeChatId ? messagesByChatId[activeChatId] || [] : []}
        onSendMessage={handleSendMessage}
      />

      <NewChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onStartChat={handleStartNewChat}
      />
    </div>
  );
}
