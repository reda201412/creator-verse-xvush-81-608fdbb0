export interface VideoData {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: string;
  type?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  muxUploadId?: string;
  muxAssetId?: string;
  muxPlaybackId?: string;
  errorDetails?: string | object;
}
