/// <reference types="vite/client" />

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
  content: string | any;
  type: string;
  createdAt: any; // Firebase Timestamp
  isEncrypted?: boolean;
  monetization?: any;
  status?: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface FirestoreMessageThread {
  id: string;
  participantIds: string[];
  participantInfo: Record<string, any>;
  lastActivity: any; // Firebase Timestamp
  createdAt: any; // Firebase Timestamp
  isGated: boolean;
  messages?: FirestoreMessage[];
  readStatus?: Record<string, any>;
  lastMessageText?: string;
  lastMessageCreatedAt?: any;
  lastMessageSenderId?: string;
  name?: string;
}

interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
  name?: string;
  participants?: string[]; // Added for compatibility with ConversationView
  lastMessageCreatedAt?: any;
  lastMessageSenderId?: string;
  lastVisibleDoc?: any;
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
  metadata?: any;
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
  metadata?: any;
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
  transactions?: Array<any>;
  subscription?: {
    status: string;
    expiry: string;
    expires_at?: string;
    level: string;
    subscription_tiers?: any[];
  };
}

// Enhanced tron-wallet hook interface
interface TronWalletHook {
  walletInfo: WalletResponse;
  isLoading: boolean;
  loading: boolean; // Added for backward compatibility
  error?: string;
  getWalletInfo: () => void;
  createWallet: () => Promise<any>;
  requestWithdrawal: (amount: number | { amount: number; destinationAddress: string }) => Promise<any>;
  checkContentAccess: (contentId: string, requiredLevel: string) => Promise<boolean>;
  verifyTransaction: (txData: any) => Promise<any>;
}
