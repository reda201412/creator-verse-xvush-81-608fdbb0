
// Types for messaging functionality

export type MonetizationTier = 'free' | 'basic' | 'premium' | 'vip' | 'exclusive';

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string | string[];
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string | Date;
  status?: 'sent' | 'delivered' | 'read';
  isEncrypted?: boolean;
  type?: 'text' | 'media' | 'image' | 'video' | 'audio' | 'file';
  emotional?: {
    sentiment?: string;
    intensity?: number;
  };
  monetization?: {
    tier: MonetizationTier;
    price?: number;
    currency?: string;
    instantPayoutEnabled?: boolean;
    accessControl?: {
      isGated?: boolean;
      requiredTier?: MonetizationTier;
    };
    analytics?: {
      views?: number;
      revenue?: number;
      conversionRate?: number;
      engagementTime?: number;
    };
  };
  attachment?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name?: string;
    size?: number;
  };
  mediaUrl?: string;
}

export interface MessageThread {
  id: string;
  participants: string[];
  name?: string;
  avatar?: string;
  lastActivity: string | Date;
  messages: Message[];
  isEncrypted?: boolean;
  isGated?: boolean;
  monetization?: {
    tier: MonetizationTier;
    price: number;
  };
  createdAt: string | Date;
  requiredTier?: MonetizationTier;
  emotionalMap?: {
    dominantEmotion?: string;
    volatility?: number;
    affinity?: number;
  };
}
