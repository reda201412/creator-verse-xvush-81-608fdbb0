export type ContentType = 'standard' | 'teaser' | 'premium' | 'vip' | 'tutorial' | 'vlog' | 'review';

// Alias VideoType to ContentType for compatibility
export type VideoType = ContentType;

export interface VideoRestrictions {
  tier?: 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';
  sharingAllowed?: boolean;
  downloadsAllowed?: boolean;
  expiresAt?: Date;
}

export interface VideoMetadata {
  id: number;
  userId: string;
  user_id?: string; // Pour la rétrocompatibilité
  title: string;
  description: string | null;
  assetId: string | null;
  mux_asset_id?: string | null; // Pour la rétrocompatibilité
  uploadId: string | null;
  mux_upload_id?: string | null; // Pour la rétrocompatibilité
  playbackId: string | null;
  mux_playback_id?: string | null; // Pour la rétrocompatibilité
  status: VideoStatus;
  duration: number | null;
  aspectRatio: string | null;
  aspect_ratio?: string | null; // Pour la rétrocompatibilité
  thumbnailUrl: string | null;
  thumbnail_url?: string | null; // Pour la rétrocompatibilité
  videoUrl: string | null;
  video_url?: string | null; // Pour la rétrocompatibilité
  isPublished: boolean;
  isPremium: boolean;
  is_premium?: boolean; // Pour la rétrocompatibilité
  price: number | null;
  tokenPrice?: number | null; // Pour la rétrocompatibilité
  viewCount: number;
  view_count?: number; // Pour la rétrocompatibilité
  likeCount: number;
  like_count?: number; // Pour la rétrocompatibilité
  commentCount: number;
  comment_count?: number; // Pour la rétrocompatibilité
  type?: ContentType; // Type de vidéo
  format?: string | {
    duration?: number;
    width?: number;
    height?: number;
    aspect_ratio?: string;
    [key: string]: unknown;
  };
  error_details?: Record<string, unknown>; // Détails d'erreur éventuels
  createdAt: Date | string;
  updatedAt: Date | string;
  metadata?: Record<string, unknown> | null;
}

// Define VideoStatus type
export type VideoStatus = 'pending' | 'processing' | 'ready' | 'error';

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
  status?: "error" | "pending" | "processing" | "ready";
  thumbnailUrl?: string;
  thumbnail_url?: string; // Alternative property name
  isPremium?: boolean;
  is_premium?: boolean; // Alternative property name
  price?: number;
  tokenPrice?: number; // Add tokenPrice field for compatibility
  duration?: string | number;
  aspectRatio?: string;
  videoUrl?: string;
  video_url?: string; // Alternative property name
  format?: '16:9' | '9:16' | '1:1' | string;
  type: ContentType;
  isPublished?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  uploadDate?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  mux_playback_id?: string;
  mux_asset_id?: string;
  mux_upload_id?: string;
  error?: string;
  status_message?: string;
  restrictions?: VideoRestrictions;
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

// Type for partial video data that might come from different sources
type PartialVideoData = Partial<VideoData> & {
  id: string | number;
  [key: string]: unknown;
};

// Function to normalize video data across different sources
export function ensureVideoDataCompatibility(videoData: PartialVideoData): VideoData {
  return {
    ...videoData,
    id: typeof videoData.id === 'string' ? parseInt(videoData.id, 10) : videoData.id,
  } as VideoData;
}

// Helper function to convert VideoMetadata to VideoData
export function convertMetadataToVideoData(metadata: VideoMetadata): VideoData {
  return {
    id: metadata.id,
    userId: metadata.userId || metadata.user_id,
    title: metadata.title,
    description: metadata.description || undefined,
    assetId: metadata.assetId || metadata.mux_asset_id || undefined,
    uploadId: metadata.uploadId || metadata.mux_upload_id || undefined,
    playbackId: metadata.playbackId || metadata.mux_playback_id || undefined,
    status: metadata.status,
    thumbnailUrl: metadata.thumbnailUrl || metadata.thumbnail_url || undefined,
    isPremium: metadata.isPremium || metadata.is_premium || false,
    price: metadata.price || metadata.tokenPrice || null,
    tokenPrice: metadata.tokenPrice || metadata.price || undefined,
    duration: metadata.duration || undefined,
    aspectRatio: metadata.aspectRatio || metadata.aspect_ratio || undefined,
    videoUrl: metadata.videoUrl || metadata.video_url || undefined,
    format: typeof metadata.format === 'string' ? metadata.format : '16:9',
    type: metadata.type || 'standard',
    isPublished: metadata.isPublished,
    viewCount: metadata.viewCount || metadata.view_count || 0,
    likeCount: metadata.likeCount || metadata.like_count || 0,
    commentCount: metadata.commentCount || metadata.comment_count || 0,
    createdAt: metadata.createdAt?.toString(),
    updatedAt: metadata.updatedAt?.toString()
  };
}

// Helper function to convert VideoData array to VideoMetadata array
export function convertVideoDataToMetadata(videoData: VideoData[]): VideoMetadata[] {
  return videoData.map(video => ({
    id: video.id,
    userId: video.userId || video.creator_id || '',
    title: video.title,
    description: video.description || null,
    assetId: video.assetId || video.mux_asset_id || null,
    uploadId: video.uploadId || video.mux_upload_id || null,
    playbackId: video.playbackId || video.mux_playback_id || null,
    status: video.status as VideoStatus || 'pending',
    duration: typeof video.duration === 'string' ? parseFloat(video.duration) : video.duration || null,
    aspectRatio: video.aspectRatio || null,
    thumbnailUrl: video.thumbnailUrl || video.thumbnail_url || null,
    videoUrl: video.videoUrl || video.video_url || null,
    isPublished: video.isPublished || false,
    isPremium: video.isPremium || video.is_premium || false,
    price: video.price || video.tokenPrice || null,
    viewCount: video.viewCount || 0,
    likeCount: video.likeCount || 0,
    commentCount: video.commentCount || 0,
    type: video.type || 'standard',
    format: typeof video.format === 'string' ? { aspect_ratio: video.format } : { aspect_ratio: '16:9' },
    createdAt: video.createdAt || new Date().toISOString(),
    updatedAt: video.updatedAt || new Date().toISOString()
  }));
}
