export interface ExtendedUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  role?: 'fan' | 'creator';
}

export interface UserInfo {
  id: string;
  username: string | null;
  profileImageUrl: string | null;
}

export interface Participant {
  id: string;
  userId: string;
  user: UserInfo;
  lastReadAt: Date | null;
  isAdmin: boolean;
  isActive?: boolean;
  conversationId: string;
}

export interface MessageMetadata {
  [key: string]: unknown;
  attachments?: Array<{
    url: string;
    type: 'image' | 'video' | 'file';
    name?: string;
    size?: number;
  }>;
}

export interface BaseMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  type: string;
  metadata: MessageMetadata | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message extends BaseMessage {
  sender: UserInfo;
}

export interface MessageWithSender extends BaseMessage {
  sender: {
    id: string;
    username: string | null;
    profileImageUrl: string | null;
  };
}

export interface BaseConversation {
  id: string;
  title: string | null;
  isGroup: boolean;
  isGated: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date | null;
  unreadCount?: number;
}

export interface Conversation extends BaseConversation {
  participants: Participant[];
  messages: Message[];
}

export interface ConversationWithParticipants extends BaseConversation {
  messages: MessageWithSender[];
}

export interface ConversationContextType {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversation: Conversation | null;
  messages: Message[];
  messagesLoading: boolean;
  hasMoreMessages: boolean;
  loadMoreMessages: () => Promise<void>;
  setSelectedConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, metadata?: MessageMetadata) => Promise<Message>;
  createConversation: (participantIds: string[], title?: string) => Promise<Conversation>;
  markAsRead: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, loadMore?: boolean) => Promise<void>;
  addParticipant: (conversationId: string, userId: string) => Promise<void>;
  removeParticipant: (conversationId: string, userId: string) => Promise<void>;
}
