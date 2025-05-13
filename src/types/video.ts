
// Define video-related types for the application
export type ContentType = 'standard' | 'premium' | 'teaser' | 'vip';

export interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  video_url?: string;
  url?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  type?: ContentType;
  format?: string;
  videoFile?: File;
  restrictions?: any;
  tags?: string[];
}
