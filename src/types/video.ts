
// Define the video content types
export type ContentType = 'standard' | 'premium' | 'teaser' | 'vip';

export interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoFile?: File;
  video_url?: string;
  url?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  type?: ContentType;
  format?: string;
  tags?: string[];
}
