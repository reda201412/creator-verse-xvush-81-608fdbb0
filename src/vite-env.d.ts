/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MUX_TOKEN_ID: string;
  readonly VITE_MUX_TOKEN_SECRET: string;
  // Ajoutez d'autres variables d'environnement ici au besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface User {
  id?: string;
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
}

interface FirestoreMessage {
  id: string;
  senderId: string;
  content: string | {
    text?: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file';
    metadata?: Record<string, unknown>;
  };
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  isEncrypted?: boolean;
  monetization?: {
    type: 'premium' | 'pay_per_view' | 'subscription';
    price?: number;
    currency?: string;
    isPaid?: boolean;
  };
  status?: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface FirestoreMessageThread {
  id: string;
  participantIds: string[];
  participantInfo: Record<string, {
    username: string;
    avatarUrl?: string;
    isOnline?: boolean;
  }>;
  lastActivity: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  isGated: boolean;
  messages?: FirestoreMessage[];
  readStatus?: Record<string, {
    lastRead: {
      seconds: number;
      nanoseconds: number;
    } | Date;
  }>;
  lastMessageText?: string;
  lastMessageCreatedAt?: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  lastMessageSenderId?: string;
  name?: string;
}

interface ExtendedFirestoreMessageThread extends Omit<FirestoreMessageThread, 'readStatus' | 'lastMessageCreatedAt'> {
  messages: FirestoreMessage[];
  readStatus?: Record<string, {
    read: boolean;
    lastRead: {
      seconds: number;
      nanoseconds: number;
    } | Date;
  }>;
  name?: string;
  participants?: string[]; // Added for compatibility with ConversationView
  lastMessageCreatedAt?: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  lastMessageSenderId?: string;
  lastVisibleDoc?: {
    id: string;
    [key: string]: unknown;
  };
  lastVisible?: {
    id: string;
    [key: string]: unknown;
  };
}

interface FirestoreStory {
  id: string;
  creatorId: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: string;
  format: string;
  duration: number;
  createdAt: string;
  expiresAt: string;
  viewCount: number;
  isHighlighted: boolean;
  metadata?: Record<string, unknown>;
  viewed?: boolean;
}

// Type to bridge FirestoreStory and Story
type StoryMapper = {
  id: string;
  creator_id: string;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  filter_used?: string;
  format: '16:9' | '9:16' | '1:1';
  duration: number;
  created_at: string;
  expires_at: string;
  view_count: number;
  is_highlighted: boolean;
  metadata?: Record<string, unknown>;
  viewed?: boolean;
};

interface TrendingContentItem {
  id?: string;
  title?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  videoUrl?: string;
  video_url?: string;
  type?: string;
  format?: string;
  isPremium?: boolean;
  is_premium?: boolean;
  userId?: string; // Added for compatibility
}

interface CreatorProfileData {
  id: string;
  user_id?: string; 
  userId?: string;
  uid: string;
  username: string;
  name?: string;
  displayName: string;
  bio?: string;
  avatarUrl: string;
  profileImageUrl?: string; // Added for compatibility
  coverImageUrl?: string;
  isPremium?: boolean;
  isOnline?: boolean;
  metrics?: {
    followers?: number;
    likes?: number;
    rating?: number;
  };
}

// Add VideoData to align with creatorService
// Will keep as reference but main type is in types/video.ts
interface VideoData {
  id: number | string;
  userId: string;
  title: string;
  description?: string;
  assetId?: string;
  uploadId?: string;
  playbackId?: string;
  status?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  isPremium?: boolean;
  is_premium?: boolean;
  price?: number;
  duration?: number;
  aspectRatio?: string;
  videoUrl?: string;
  video_url?: string;
  format?: '16:9' | '9:16' | '1:1';
  type: 'standard' | 'teaser' | 'premium' | 'vip';
  isPublished?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Add WalletResponse type to fix wallet hook errors
interface WalletResponse {
  wallet?: {
    tron_address: string;
    balance_usdt: number;
    is_verified: boolean;
  };
  error?: string;
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    timestamp: Date | string;
    metadata?: Record<string, unknown>;
  }>;
  subscription?: {
    status: string;
    expiry: string;
    expires_at?: string;
    level: string;
    subscription_tiers?: Array<{
      id: string;
      name: string;
      price: number;
      benefits: string[];
    }>;
  };
}

// Enhanced tron-wallet hook interface
interface TronWalletHook {
  walletInfo: WalletResponse;
  isLoading: boolean;
  loading: boolean; // Added for backward compatibility
  error?: string;
  getWalletInfo: () => void;
  createWallet: () => Promise<{
    success: boolean;
    wallet?: {
      tron_address: string;
      mnemonic: string[];
      privateKey: string;
    };
    error?: string;
  }>;
  requestWithdrawal: (amount: number | { amount: number; destinationAddress: string }) => Promise<{
    success: boolean;
    transaction?: {
      txID: string;
      raw_data: Record<string, unknown>;
    };
    error?: string;
  }>;
  checkContentAccess: (contentId: string, requiredLevel: string) => Promise<{
    hasAccess: boolean;
    message?: string;
    requiredPayment?: number;
    requiredLevel?: string;
    currentLevel?: string;
  }>;
  verifyTransaction: (txData: {
    txID: string;
    raw_data: {
      contract: {
        parameter: {
          value: {
            amount: number;
            owner_address: string;
            to_address: string;
          };
        };
      }[];
    };
  }) => Promise<{
    success: boolean;
    transaction?: {
      txID: string;
      raw_data: Record<string, unknown>;
    };
    error?: string;
  }>;
}

