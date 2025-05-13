
import { UserProfile } from '@/types/auth';
import { VideoMetadata, ContentType } from '@/types/video';

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
  type?: ContentType;
  format?: string; 
}

export interface VideoFirestoreData {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  uploadStatus?: 'pending' | 'processing' | 'complete' | 'error';
  uploadProgress?: number;
  userId: string;
  uploadedAt: Date;
  videoUrl?: string;
  format?: string;
  type?: string;
  views?: number;
  likes?: number;
  watchHours?: number;
  revenueGenerated?: number;
}

/**
 * Get all videos
 */
export const getAllVideos = async (): Promise<VideoData[]> => {
  // Mock implementation - return sample videos
  return Promise.resolve([
    {
      id: "video1",
      title: "Morning Coffee Routine",
      description: "How to make the perfect morning coffee",
      thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
      videoUrl: "https://example.com/video1.mp4",
      creatorId: "creator1",
      creatorName: "Coffee Lover",
      creatorAvatar: "https://avatars.githubusercontent.com/u/124599?v=4",
      views: 5600,
      likes: 1200,
      isPremium: true,
      uploadedAt: new Date(),
      type: "premium",
      format: "16:9"
    },
    {
      id: "video2",
      title: "Sunset at the Mountain",
      description: "Beautiful sunset time-lapse",
      thumbnailUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
      videoUrl: "https://example.com/video2.mp4",
      creatorId: "creator2",
      creatorName: "Nature Explorer",
      creatorAvatar: "https://i.pravatar.cc/150?img=11",
      views: 12400,
      likes: 2300,
      isPremium: false,
      uploadedAt: new Date(),
      type: "standard",
      format: "16:9"
    }
  ]);
};

/**
 * Get videos by creator ID
 */
export const getCreatorVideos = async (creatorId: string): Promise<VideoFirestoreData[]> => {
  // Mock implementation - return sample videos for specific creator
  return Promise.resolve([
    {
      id: "video1",
      title: "Morning Coffee Routine",
      description: "How to make the perfect morning coffee",
      thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
      isPremium: true,
      userId: creatorId,
      uploadedAt: new Date(),
      videoUrl: "https://example.com/video1.mp4",
      format: "16:9",
      type: "premium",
      views: 5600,
      likes: 1200,
      watchHours: 450,
      revenueGenerated: 350
    },
    {
      id: "video2",
      title: "Sunset at the Mountain",
      description: "Beautiful sunset time-lapse",
      thumbnailUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
      isPremium: false,
      userId: creatorId,
      uploadedAt: new Date(),
      videoUrl: "https://example.com/video2.mp4",
      format: "16:9",
      type: "standard",
      views: 12400,
      likes: 2300,
      watchHours: 950,
      revenueGenerated: 0
    }
  ]);
};

/**
 * Get video by ID
 */
export const getVideoByIdFromFirestore = async (videoId: string): Promise<VideoFirestoreData | null> => {
  // Mock implementation - return a sample video with the given ID
  return Promise.resolve({
    id: videoId,
    title: "Sample Video",
    description: "This is a sample video description",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    isPremium: true,
    userId: "creator1",
    uploadedAt: new Date(),
    videoUrl: "https://example.com/sample.mp4",
    format: "16:9",
    type: "premium",
    views: 5600,
    likes: 1200,
    watchHours: 450,
    revenueGenerated: 350
  });
};

/**
 * Get creators
 */
export const getCreators = async (filter?: string): Promise<CreatorProfile[]> => {
  // Mock implementation - return sample creators
  return Promise.resolve([
    {
      id: "creator1",
      uid: "creator1_uid",
      username: "sarahk.creative",
      displayName: "Sarah K.",
      avatarUrl: "https://avatars.githubusercontent.com/u/124599?v=4",
      bio: "Digital artist and photographer",
      isPremium: true,
      followersCount: 21500,
      isOnline: true
    },
    {
      id: "creator2",
      uid: "creator2_uid",
      username: "thomas.photo",
      displayName: "Thomas R.",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
      bio: "Travel photographer and filmmaker",
      isPremium: false,
      followersCount: 14200,
      isOnline: false
    }
  ]);
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
  return Promise.resolve(Math.random() > 0.5);
};

/**
 * Follow a creator
 */
export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  // In a real implementation, this would add a follow relationship in a database
  console.log(`User ${userId} is following creator ${creatorId}`);
  return Promise.resolve(true);
};

/**
 * Unfollow a creator
 */
export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  // In a real implementation, this would remove a follow relationship from a database
  console.log(`User ${userId} is unfollowing creator ${creatorId}`);
  return Promise.resolve(true);
};

/**
 * Get user followed creator IDs
 */
export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  // In a real implementation, this would fetch the creator IDs a user follows
  return Promise.resolve(["creator1_uid", "creator3_uid"]);
};
