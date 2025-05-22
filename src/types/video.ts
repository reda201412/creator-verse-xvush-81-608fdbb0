
export interface VideoData {
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
  tokenPrice?: number;
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
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: string;
  creator_id?: string;
  mux_playback_id?: string;
}

// Define CreatorProfileData interface which was missing
export interface CreatorProfileData {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  isPremium?: boolean;
  isOnline?: boolean;
  metrics?: {
    followers: number;
    likes: number;
    rating: number;
  };
}

// Define User interface which was missing
export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

// Create VideoMetadata interface for backward compatibility
export interface VideoMetadata {
  id: number | string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  format?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  type?: string;
  restrictions?: {
    tier?: string;
    sharingAllowed?: boolean;
    downloadsAllowed?: boolean;
  };
}
