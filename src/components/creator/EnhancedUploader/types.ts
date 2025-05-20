
export type ShieldStatusState = 'idle' | 'checking' | 'secure' | 'warning' | 'error';

export interface ShieldStatusDetails {
  encryption: boolean;
  watermark: boolean;
  drm: boolean;
}

export type ShieldStatus = ShieldStatusState | (ShieldStatusState & ShieldStatusDetails);

export interface UploadMetadata {
  title?: string;
  description?: string;
  type?: 'standard' | 'teaser' | 'premium' | 'vip';
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  visibility?: 'public' | 'private' | 'unlisted';
  schedulePublish?: string;
}

export type UploadStage = 'idle' | 'selecting' | 'uploading' | 'processing' | 'metadata' | 'complete' | 'error';
