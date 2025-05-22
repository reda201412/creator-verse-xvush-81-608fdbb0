
// Add this to the existing video.ts file if it exists, or create a new one
export interface VideoMetadata {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  type?: string;
  format?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  restrictions?: {
    tier?: string;
    sharingAllowed?: boolean;
    downloadsAllowed?: boolean;
  };
  videoFile?: File;
  errorMessage?: string;
  status?: 'processing' | 'ready' | 'pending' | 'error' | 'failed';
}

export interface VideoData extends VideoMetadata {
  viewCount?: number;
  duration?: number;
  publishedAt?: string;
  uploadId?: string;
  playbackId?: string;
  userId?: string; // Creator ID
  creatorId?: string; // Alias for userId
  // Adding backward compatibility fields for snake_case props
  thumbnail_url?: string;
  is_premium?: boolean;
  mux_playback_id?: string;
  creator_id?: string;
}

// Adding missing User interface
export interface User {
  uid?: string;
  id?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  username?: string;
  profileImageUrl?: string;
}

// Adding CreatorProfileData interface that was missing
export interface CreatorProfileData {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  profileImageUrl?: string; // Alias for avatarUrl
  isPremium?: boolean;
  isOnline?: boolean;
  metrics?: {
    followers: number;
    likes: number;
    rating: number;
  };
}
