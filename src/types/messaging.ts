
export type MessageType = 'text' | 'voice' | 'media' | 'call' | 'whisper' | 'roar';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'monetized';
export type EmotionType = 'joy' | 'excitement' | 'curiosity' | 'admiration' | 'gratitude' | 'neutral';
export type MonetizationTier = 'free' | 'basic' | 'premium' | 'vip' | 'exclusive';

export interface MessageEmotionalData {
  primaryEmotion: EmotionType;
  intensity: number; // 0-100
  threadMapping: Array<{
    messageId: string;
    relationStrength: number; // 0-100
    emotionalShift?: EmotionType;
  }>;
}

export interface MessageMonetizationData {
  tier: MonetizationTier;
  price: number;
  currency: string;
  instantPayoutEnabled: boolean;
  accessControl: {
    isGated: boolean;
    requiredTier?: MonetizationTier;
    individualAccess?: string[]; // User IDs with special access
  };
  analytics: {
    views: number;
    revenue: number;
    conversionRate: number;
    engagementTime: number; // seconds
  };
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string | string[]; // Can be a user or a group
  content: string;
  type: MessageType;
  timestamp: string;
  status: MessageStatus;
  emotional?: MessageEmotionalData;
  monetization?: MessageMonetizationData;
  mediaUrl?: string;
  replyToId?: string;
  isEncrypted: boolean;
  visualEffects?: {
    synesthesia?: string;
    animation?: string;
    interactionStyle?: string;
  };
}

export interface MessageThread {
  id: string;
  participants: string[];
  messages: Message[];
  name?: string; // For group chats
  isGated: boolean;
  requiredTier?: MonetizationTier;
  lastActivity: string;
  emotionalMap?: {
    dominantEmotion: EmotionType;
    volatility: number; // 0-100
    affinity: number; // 0-100
  };
}

export interface MessagingState {
  threads: MessageThread[];
  activeThreadId?: string;
  userWallet: {
    balance: number;
    currency: string;
    transactions: Array<{
      id: string;
      amount: number;
      type: 'incoming' | 'outgoing';
      relatedMessageId?: string;
      timestamp: string;
      status: 'pending' | 'completed' | 'failed';
    }>;
  };
  notifications: {
    unreadCount: number;
    priorityMessages: string[]; // Message IDs
  };
}
