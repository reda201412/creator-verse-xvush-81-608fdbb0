
// Add or update this file if it doesn't exist already
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'system' | 'payment';

export type MonetizationTier = 'free' | 'basic' | 'premium' | 'vip' | 'exclusive';

export interface MessageMonetization {
  tier: MonetizationTier;
  price: number;
  currency: string;
  instantPayoutEnabled?: boolean;
  accessControl?: {
    isGated: boolean;
    requiredTier: MonetizationTier;
  };
  analytics?: {
    views: number;
    revenue: number;
    conversionRate: number;
    engagementTime: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  recipientId: string | string[];
  content: string;
  type: MessageType;
  timestamp: string;
  isEncrypted?: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  monetization?: MessageMonetization;
  emotional?: {
    primaryEmotion: string;
    intensity: number;
    threadMapping: any[];
  };
}

export interface MessageThread {
  id: string;
  participants: string[];
  name?: string;
  isGated?: boolean;
  messages: Message[];
  lastActivity: string;
  readStatus?: Record<string, any>;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  metadata?: {
    category?: string;
    tags?: string[];
    isPinned?: boolean;
  };
}

// Extend the FirestoreMessageThread with the fields used in the app
export interface ExtendedFirestoreMessageThread {
  id?: string;
  participantIds: string[];
  participantNames?: Record<string, string>;
  participantAvatars?: Record<string, string | null>;
  name?: string;
  isGated?: boolean;
  messages: any[];
  lastActivity?: any;
  readStatus?: Record<string, any>;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  metadata?: {
    category?: string;
    tags?: string[];
    isPinned?: boolean;
  };
}
