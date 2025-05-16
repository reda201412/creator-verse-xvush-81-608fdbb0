
export type Video = {
  id: string;
  muxUploadId: string;
  muxAssetId: string | null;
  muxPlaybackId: string | null;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type VideoCreateInput = {
  muxUploadId: string;
  status: string;
  userId: string;
};

export type VideoUpdateInput = {
  muxAssetId?: string | null;
  muxPlaybackId?: string | null;
  status?: string;
}; 
