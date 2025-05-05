
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
  videoFile: File;
  thumbnailUrl?: string;
  video_url?: string; // Ajout du champ video_url
  format: '16:9' | '9:16' | '1:1' | 'other';
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: VideoRestrictions;
}
