
export interface VideoData {
  id: string;
  title: string;
  description: string;  // Make description required
  creatorId: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  uploadStatus?: 'pending' | 'processing' | 'complete' | 'error';
  format?: string;
  duration?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: string | Date;
  publishedAt?: string | Date;
  revenueGenerated?: number;
  type?: ContentType;
  views?: number;
  watchHours?: number;
  likes?: number;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  type?: ContentType;
  videoFile?: File; 
  thumbnailUrl?: string;
  video_url?: string;
  url?: string;
  format?: string;
  isPremium?: boolean;
  tokenPrice?: number;
}

export type ContentType = 'standard' | 'premium' | 'teaser' | 'vip';

export interface VideoUploadProgress {
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}
