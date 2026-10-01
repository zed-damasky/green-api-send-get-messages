export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface ChatMessageInterface {
  id: string | number;
  text: string;
  timestamp: number;
  isIncoming: boolean;
  sender?: string;
  senderName?: string;
}

export interface ChatPreview {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount: number;
  timestamp?: number;
}

interface BaseWebhookBody {
  instanceData: { idInstance: number; wid: string; typeInstance: string };
  timestamp: number;
  idMessage: string;
}

export interface IncomingMessageWebhook extends BaseWebhookBody {
  typeWebhook: "incomingMessageReceived";
  senderData: {
    chatId: string;
    chatName?: string;
    sender: string;
    senderName?: string;
    senderPhoneNumber?: number | string; 
  };
  messageData: {
    typeMessage: string;
    textMessageData?: { textMessage: string };
  };
}

export interface OutgoingStatusWebhook extends BaseWebhookBody {
  typeWebhook: "outgoingMessageStatus";
  chatId: string;
  status: string;
}

export type WebhookBody = IncomingMessageWebhook | OutgoingStatusWebhook;
export interface ApiNotification {
  receiptId: number;
  body: WebhookBody;
}
