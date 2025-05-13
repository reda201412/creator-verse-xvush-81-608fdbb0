
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

// Interface pour gérer les types JSON de Supabase avec flexibilité
export interface JsonData {
  [key: string]: any;
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
  emotional?: MessageEmotionalData | JsonData | null;
  monetization?: MessageMonetizationData | JsonData | null;
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
  lastSeen?: string; // Add this property
  emotionalMap?: {
    dominantEmotion: EmotionType;
    volatility: number; // 0-100
    affinity: number; // 0-100
  } | null | JsonData; // Support pour les types JSON flexibles de Supabase
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

// Interface pour mapper les données de Supabase aux interfaces du modèle
export interface SupabaseMessageThreadData {
  id: string | number;
  participants: string[];
  name?: string;
  is_gated: boolean;
  required_tier?: MonetizationTier;
  last_activity: string;
  emotional_map?: JsonData;
  creator_id?: string;
}

export interface SupabaseMessageData {
  id: string | number;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  recipient_id: string | string[];
  content: string;
  type: MessageType;
  created_at: string;
  status: MessageStatus;
  emotional_data?: JsonData;
  monetization_data?: JsonData;
  media_url?: string;
  is_encrypted: boolean;
  thread_id: string | number;
}

// Fonctions d'assistance pour convertir entre les formats
export function convertSupabaseThreadToLocal(thread: SupabaseMessageThreadData, messages: SupabaseMessageData[]): MessageThread {
  return {
    id: String(thread.id),
    participants: thread.participants,
    name: thread.name,
    isGated: thread.is_gated,
    requiredTier: thread.required_tier,
    lastActivity: thread.last_activity,
    emotionalMap: thread.emotional_map,
    messages: messages.map(convertSupabaseMessageToLocal)
  };
}

export function convertSupabaseMessageToLocal(message: SupabaseMessageData): Message {
  return {
    id: String(message.id),
    senderId: message.sender_id,
    senderName: message.sender_name,
    senderAvatar: message.sender_avatar,
    recipientId: message.recipient_id,
    content: message.content,
    type: message.type,
    timestamp: message.created_at,
    status: message.status,
    emotional: message.emotional_data,
    monetization: message.monetization_data,
    mediaUrl: message.media_url,
    isEncrypted: message.is_encrypted
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
