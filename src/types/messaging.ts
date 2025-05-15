import { Timestamp } from 'firebase/firestore';

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'error';
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

// Interface pour gérer les types JSON avec flexibilité
export interface JsonData {
  [key: string]: any;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    thumbnailUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
  };
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    title?: string;
    avatarUrl?: string;
    isGroup?: boolean;
    groupName?: string;
    groupAvatar?: string;
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

// Interface pour les données de wallet utilisées dans Tron
export interface WalletData {
  balance_usdt: number;
  tron_address?: string;
  is_verified: boolean;
}

export interface TransactionData {
  id: string;
  amount_usdt: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

export interface WalletResponse {
  wallet: WalletData | null;
  transactions: TransactionData[];
  subscription?: {
    id: string;
    is_active: boolean;
    expires_at: string;
    subscription_tiers: {
      name: string;
      price_usdt: number;
    };
  } | null;
}

// Interface pour les threads de messages
export interface FirestoreMessageThread {
  id: string;
  participants: string[];
  lastMessageId?: string;
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    title?: string;
    avatarUrl?: string;
    isGroup?: boolean;
    groupName?: string;
    groupAvatar?: string;
  };
}

// Interface pour les données de message dans Firestore
export interface FirestoreMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    thumbnailUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
  };
}

// Fonctions de conversion
export function convertFirestoreThreadToLocal(thread: FirestoreMessageThread, messages: FirestoreMessage[]): MessageThread {
  return {
    ...thread,
    lastMessage: messages.length > 0 ? convertFirestoreMessageToLocal(messages[0]) : undefined,
  };
}

export function convertFirestoreMessageToLocal(message: FirestoreMessage): Message {
  return {
    ...message,
  };
}
