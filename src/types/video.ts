
export type ContentType = 'standard' | 'teaser' | 'premium' | 'vip';

export interface VideoRestrictions {
  tier?: 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';
  sharingAllowed?: boolean;
  downloadsAllowed?: boolean;
  expiresAt?: Date;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  videoFile?: File;
  thumbnailUrl?: string;
  video_url?: string; // URL MUX ou Firebase
  url?: string; // Alias pour video_url pour compatibilité
  playbackId?: string; // ID de lecture MUX
  format: '16:9' | '9:16' | '1:1' | 'other';
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: VideoRestrictions;
}

// Define VideoData interface with consistent ID type that works with both services
export interface VideoData {
  id: number;
  userId?: string;
  creator_id?: string; // For compatibility with creatorService
  title: string;
  description?: string;
  assetId?: string;
  uploadId?: string;
  playbackId?: string;
  status?: "error" | "pending" | "processing" | "ready"; // Updated to match creatorService strict types
  thumbnailUrl?: string;
  thumbnail_url?: string; // Alternative property name
  isPremium?: boolean;
  is_premium?: boolean; // Alternative property name
  price?: number;
  duration?: number;
  aspectRatio?: string;
  videoUrl?: string;
  video_url?: string; // Alternative property name
  format?: '16:9' | '9:16' | '1:1';
  type: 'standard' | 'teaser' | 'premium' | 'vip';
  isPublished?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  mux_playback_id?: string;
}

// Define User type here directly with necessary fields
export interface User {
  uid: string;
  id?: string; // Some components expect this
  email: string;
  username?: string; // Changed to optional for backward compatibility
  displayName?: string;
  profileImageUrl?: string | null; // Adding this property with null as a possible value
}

// Add CreatorProfileData type
export interface CreatorProfileData {
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

// Function to normalize video data across different sources
export function ensureVideoDataCompatibility(videoData: any): VideoData {
  return {
    ...videoData,
    id: typeof videoData.id === 'string' ? parseInt(videoData.id, 10) : videoData.id,
  };
}
