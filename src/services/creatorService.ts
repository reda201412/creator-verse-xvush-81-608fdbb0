
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

// Alias CreatorProfileData for backward compatibility
export type CreatorProfileData = CreatorProfile;

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
  type?: string; // Add type property
  format?: string; // Add format property
}

export interface VideoFirestoreData {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  uploadStatus: 'pending' | 'processing' | 'complete' | 'error';
  uploadProgress: number;
  userId: string;
  uploadedAt: Date;
  videoUrl?: string;
  format?: string;
  type?: string;
}

/**
 * Get all videos
 */
export const getAllVideos = async (): Promise<VideoData[]> => {
  // In a real implementation, this would fetch videos from an API
  return Promise.resolve([]);
};

/**
 * Get videos by creator ID
 */
export const getCreatorVideos = async (creatorId: string): Promise<VideoFirestoreData[]> => {
  // In a real implementation, this would fetch videos from an API
  return Promise.resolve([]);
};

/**
 * Get video by ID
 */
export const getVideoByIdFromFirestore = async (videoId: string): Promise<VideoFirestoreData | null> => {
  // In a real implementation, this would fetch a video from an API
  return Promise.resolve(null);
};

/**
 * Get creators
 */
export const getCreators = async (filter?: string): Promise<CreatorProfile[]> => {
  // In a real implementation, this would fetch creators from an API
  return Promise.resolve([]);
};

/**
 * Get all creators
 */
export const getAllCreators = async (): Promise<CreatorProfile[]> => {
  // Alias for getCreators for backward compatibility
  return getCreators();
};

/**
 * Check if a user follows a creator
 */
export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  // In a real implementation, this would check the follow status in a database
  return Promise.resolve(false);
};

/**
 * Follow a creator
 */
export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  // In a real implementation, this would add a follow relationship in a database
  return Promise.resolve(true);
};

/**
 * Unfollow a creator
 */
export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  // In a real implementation, this would remove a follow relationship from a database
  return Promise.resolve(true);
};

/**
 * Get user followed creator IDs
 */
export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  // In a real implementation, this would fetch the creator IDs a user follows
  return Promise.resolve([]);
};
