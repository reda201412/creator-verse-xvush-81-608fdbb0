
export type ContentType = 'standard' | 'teaser' | 'premium' | 'vip';

export interface VideoRestrictions {
  tier?: 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';
  sharingAllowed?: boolean;
  downloadsAllowed?: boolean;
  expiresAt?: Date;
  ephemeralMode?: boolean;
  maxViews?: number;
  notifyOnScreenshot?: boolean;
}

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  videoFile: File;
  thumbnailUrl?: string;
  video_url?: string;
  url?: string; // Alias for video_url for backward compatibility
  format: '16:9' | '9:16' | '1:1' | 'other';
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: VideoRestrictions;
  ephemeralOptions?: {
    ephemeral_mode: boolean;
    expires_after: number | null;
    max_views: number | null;
    notify_on_screenshot: boolean;
    current_views: number;
  } | null;
}
