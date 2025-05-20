/// <reference types="vite/client" />

interface User {
  id: string;
  uid?: string; // Adding uid as optional for backward compatibility
  email: string;
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
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
}

interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
  name?: string;
  lastMessageCreatedAt?: any;
  lastMessageSenderId?: string;
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
  videoUrl?: string;
  type?: string;
  format?: string;
  isPremium?: boolean;
}

interface CreatorProfileData {
  id: string;
  user_id: string; 
  userId?: string; // Adding userId as an alternative
  uid?: string; // Adding uid for backward compatibility
  username: string;
  name: string;
  displayName?: string; // Adding displayName as an alternative to name
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  isPremium?: boolean;
  metrics?: {
    followers?: number;
    likes?: number;
    rating?: number;
  };
}
