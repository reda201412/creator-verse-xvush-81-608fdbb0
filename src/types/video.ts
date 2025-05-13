
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
  views?: number;
  likes?: number;
  watchHours?: number;
  revenueGenerated?: number;
}

// Additional types for video restrictions
export interface VideoRestrictions {
  ageRestricted?: boolean;
  minimumAge?: number;
  geoblocked?: boolean;
  allowedCountries?: string[];
  tokenGated?: boolean;
  requiredTokens?: number;
}

// Extended VideoMetadata with restrictions
export interface EnhancedVideoMetadata extends VideoMetadata {
  restrictions?: VideoRestrictions;
}
