
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
  videoFile?: File;
  thumbnailUrl?: string;
  video_url?: string; // URL MUX ou Firebase
  url?: string; // Alias pour video_url pour compatibilité
  playbackId?: string; // ID de lecture MUX
  format: '16:9' | '9:16' | '1:1' | 'other';
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: VideoRestrictions;
}
