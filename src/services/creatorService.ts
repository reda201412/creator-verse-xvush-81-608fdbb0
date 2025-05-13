
import { UserProfile } from '@/types/auth';

export interface CreatorProfile {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  isPremium?: boolean;
  followersCount?: number;
  isOnline?: boolean;
}

// Example video data
export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  views: number;
  likes: number;
  isPremium: boolean;
  tokenPrice?: number;
  uploadedAt: Date;
}

/**
 * Get all videos
 */
export const getAllVideos = async (): Promise<VideoData[]> => {
  // In a real implementation, this would fetch videos from an API
  return Promise.resolve([]);
};

/**
 * Get creators
 */
export const getCreators = async (filter?: string): Promise<CreatorProfile[]> => {
  // In a real implementation, this would fetch creators from an API
  return Promise.resolve([]);
};
