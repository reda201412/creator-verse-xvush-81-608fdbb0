
export interface Message {
  id: string;
  content: string | any;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string | number;
  status?: 'sent' | 'delivered' | 'read';
  isEncrypted?: boolean;
  monetization?: {
    tier: string;
    price: number;
    currency?: string;
  };
}

export type MonetizationTier = 'free' | 'basic' | 'premium' | 'vip' | 'exclusive';

export interface MessageThread {
  id: string;
  participants: string[];
  participantInfo?: Record<string, {
    displayName: string;
    avatarUrl?: string;
  }>;
  messages: Message[];
  isSecure?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  isGated?: boolean; // Added isGated property
  lastActivity: string | Date; // Changed from string | number to string | Date
  unreadCount?: number;
  sessionKey?: string;
  name?: string;
}

export interface FirestoreMessage {
  id: string;
  content: any;
  senderId: string;
  createdAt: any; // Timestamp
  status?: string;
  isEncrypted?: boolean;
  monetization?: {
    tier: string;
    price: number;
    currency?: string;
  };
}

export interface FirestoreMessageThread {
  id: string;
  participantIds: string[];
  participantInfo?: Record<string, {
    displayName: string;
    avatarUrl?: string;
  }>;
  isSecure?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  isGated?: boolean; // Added isGated property
  lastActivity?: any; // Timestamp
  name?: string;
}

// Updated ExtendedFirestoreMessageThread interface to include name property
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: Message[];
  unreadCount?: number;
  sessionKey?: string;
  name: string; // Made required to fix the type error
  readStatus?: Record<string, any>; // Added for ConversationView
}

export interface EncryptedContent {
  data: string;
  iv: string;
  salt: string;
}
