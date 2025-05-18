export type UploadStage = 
  | 'idle' 
  | 'selecting' 
  | 'uploading' 
  | 'processing' 
  | 'metadata' 
  | 'complete' 
  | 'error';

export type ShieldStatus = 'inactive' | 'active' | 'warning' | 'error';

export interface UploadMetadata {
  title: string;
  description: string;
  type: 'standard' | 'teaser' | 'premium' | 'vip';
  isPremium: boolean;
  tokenPrice: number;
  tags?: string[];
  category?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  schedulePublish?: Date | null;
}

export interface ShieldStatusState {
  encryption: ShieldStatus;
  watermark: ShieldStatus;
  drm: ShieldStatus;
}

export interface UploadState {
  stage: UploadStage;
  progress: number;
  file: File | null;
  thumbnail: File | null;
  error: string | null;
  metadata: UploadMetadata;
  shieldStatus: ShieldStatusState;
}

export type UploadAction =
  | { type: 'SET_STAGE'; payload: UploadStage }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_FILE'; payload: File | null }
  | { type: 'SET_THUMBNAIL'; payload: File | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_METADATA'; payload: Partial<UploadMetadata> }
  | { type: 'SET_SHIELD_STATUS'; payload: Partial<ShieldStatusState> }
  | { type: 'RESET' };

export interface UploaderContextType extends UploadState {
  setStage: (stage: UploadStage) => void;
  setProgress: (progress: number) => void;
  setFile: (file: File | null) => void;
  setThumbnail: (thumbnail: File | null) => void;
  setError: (error: string | null) => void;
  setMetadata: (metadata: Partial<UploadMetadata>) => void;
  setShieldStatus: (status: Partial<ShieldStatusState>) => void;
  reset: () => void;
}

export interface VideoUploaderProps {
  onUploadComplete: (metadata?: any) => void;
  isCreator: boolean;
  className?: string;
}
