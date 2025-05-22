
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
