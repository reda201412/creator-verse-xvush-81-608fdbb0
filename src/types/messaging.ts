
// Types for messaging functionality

export type MonetizationTier = 'free' | 'basic' | 'premium' | 'vip';

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: string | Date;
  status?: 'sent' | 'delivered' | 'read';
  isEncrypted?: boolean;
  monetization?: {
    tier: MonetizationTier;
    price?: number;
  };
  attachment?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name?: string;
    size?: number;
  };
}

export interface MessageThread {
  id: string;
  participants: string[];
  name?: string;
  avatar?: string;
  lastActivity: string | Date;
  messages: Message[];
  isEncrypted?: boolean;
  monetization?: {
    tier: MonetizationTier;
    price: number;
  };
  createdAt: string | Date;
}
