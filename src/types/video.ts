// Add this to the existing video.ts file if it exists, or create a new one
export interface VideoMetadata {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  type?: string;
  format?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  restrictions?: {
    tier?: string;
    sharingAllowed?: boolean;
    downloadsAllowed?: boolean;
  };
  videoFile?: File;
  errorMessage?: string;
  status?: 'processing' | 'ready' | 'pending' | 'error' | 'failed';
}

export interface VideoData extends VideoMetadata {
  viewCount?: number;
  duration?: number;
  publishedAt?: string;
  uploadId?: string;
  playbackId?: string;
}
