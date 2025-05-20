
export type ShieldFeatureStatus = 'active' | 'pending' | 'inactive' | 'warning' | 'error';

export interface ShieldStatus {
  encryption: ShieldFeatureStatus;
  watermark: ShieldFeatureStatus;
  drm: ShieldFeatureStatus;
}

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

// Add missing types for UploaderContext
export interface UploadState {
  stage: UploadStage;
  progress: number;
  file: File | null;
  thumbnail: File | null;
  error: string | null;
  metadata: UploadMetadata;
  shieldStatus: ShieldStatus;
}

export type UploadAction =
  | { type: 'SET_STAGE'; payload: UploadStage }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_FILE'; payload: File | null }
  | { type: 'SET_THUMBNAIL'; payload: File | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_METADATA'; payload: Partial<UploadMetadata> }
  | { type: 'SET_SHIELD_STATUS'; payload: Partial<ShieldStatus> }
  | { type: 'RESET' };

export interface UploaderContextType extends UploadState {
  setStage: (stage: UploadStage) => void;
  setProgress: (progress: number) => void;
  setFile: (file: File | null) => void;
  setThumbnail: (thumbnail: File | null) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: Partial<UploadMetadata>) => void;
  setShieldStatus: (status: Partial<ShieldStatus>) => void;
  reset: () => void;
}
