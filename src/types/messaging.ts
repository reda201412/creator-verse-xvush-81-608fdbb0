
export interface Message {
  id: string;
  content: string | any;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string | number;
  status?: 'sent' | 'delivered' | 'read';
  isEncrypted?: boolean;
  recipientId?: string | string[]; // Add the missing recipientId field
  monetization?: {
    tier: string;
    price: number;
    currency?: string;
    instantPayoutEnabled?: boolean; // Add missing field used in mockMessages
    accessControl?: {
      isGated: boolean;
      requiredTier: string;
    };
    analytics?: {
      views: number;
      revenue: number;
      conversionRate: number;
      engagementTime: number;
    };
  };
  mediaUrl?: string;
  type?: 'text' | 'media' | 'gift';
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
  isGated?: boolean;
  lastActivity: string | Date | any; // Updated to accept Timestamp
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
  isGated?: boolean;
  lastActivity: any; // Updated to accept Timestamp
  name?: string;
}

// Extended FirestoreMessageThread interface with participants field required
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  unreadCount?: number;
  sessionKey?: string;
  name: string;
  participants: string[]; // Make participants required
  readStatus?: Record<string, any>;
}

export interface EncryptedContent {
  data: string;
  iv: string;
  salt: string;
}
