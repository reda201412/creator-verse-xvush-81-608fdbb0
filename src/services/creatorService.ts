import { db } from '@/integrations/firebase/firebase';
import mockPrismaClient from '@/lib/mock-prisma';
import { VideoType } from '@/types/video';

export interface VideoData {
  id: number;
  title?: string;
  description?: string;
  type?: VideoType; // Using VideoType from @/types/video
  thumbnail_url?: string;
  is_premium?: boolean;
  token_price?: number;
  creator_id?: string;
  mux_playback_id?: string;
  mux_asset_id?: string;
  status?: 'pending' | 'processing' | 'ready' | 'error';
  error_details?: string | any;
  created_at?: string | Date;
  updated_at?: string | Date;
  viewCount?: number;
  playbackId?: string;
  duration?: string | number; // Updated to accept string | number like in VideoData from types/video
}

export interface CreatorProfileData {
  id: string;
  user_id?: string; 
  userId?: string;
  uid: string;
  username: string;
  name?: string;
  displayName: string;
  bio?: string;
  avatarUrl: string;
  coverImageUrl?: string;
  isPremium?: boolean;
  isOnline?: boolean;
  metrics?: {
    followers?: number;
    likes?: number;
    rating?: number;
  };
}

// User Profile CRUD operations
export const getUserProfile = async (userId: string) => {
  // Mock implementation
  return {
    id: userId,
    userId: userId,
    uid: userId,
    username: 'mockuser',
    displayName: 'Mock User',
    bio: 'This is a mock bio',
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
    isPremium: false,
    isOnline: true,
    metrics: {
      followers: 0,
      likes: 0,
      rating: 0
    }
  };
};

// Video management
export const getCreatorVideos = async (creatorId: string): Promise<VideoData[]> => {
  // Mock implementation
  return [
    {
      id: 1,
      title: "Introduction Video",
      description: "My first video",
      type: "standard",
      thumbnail_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
      is_premium: false,
      creator_id: creatorId,
      mux_playback_id: "playback_id_1",
      status: "ready",
      created_at: new Date(),
      viewCount: 120
    },
    {
      id: 2,
      title: "Premium Content",
      description: "Exclusive content for premium users",
      type: "premium",
      thumbnail_url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
      is_premium: true,
      token_price: 10,
      creator_id: creatorId,
      mux_playback_id: "playback_id_2",
      status: "ready",
      created_at: new Date(),
      viewCount: 45
    }
  ];
};

export const getVideoById = async (videoId: string | number): Promise<VideoData | null> => {
  // Mock implementation
  return {
    id: typeof videoId === 'string' ? parseInt(videoId) : videoId,
    title: "Sample Video",
    description: "This is a sample video",
    type: "standard",
    thumbnail_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
    is_premium: false,
    mux_playback_id: "sample_playback_id",
    status: "ready",
    created_at: new Date(),
    viewCount: 100
  };
};

// Creator discovery and recommendations
export const getAllCreators = async (limit: number = 10, offset: number = 0) => {
  // Mock implementation
  return Array(limit).fill(null).map((_, i) => ({
    id: `creator-${i + offset}`,
    uid: `creator-${i + offset}`,
    username: `creator${i + offset}`,
    displayName: `Creator ${i + offset}`,
    bio: `This is creator ${i + offset}'s bio.`,
    avatarUrl: `https://i.pravatar.cc/300?img=${i + offset}`,
    isPremium: i % 3 === 0,
    isOnline: i % 2 === 0,
    metrics: {
      followers: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 5000),
      rating: (Math.random() * 2 + 3).toFixed(1)
    }
  }));
};

export const getRecommendedCreators = async (userId: string, limit: number = 5) => {
  // Mock implementation
  return getAllCreators(limit, 10);
};

export const getCreatorById = async (creatorId: string): Promise<CreatorProfileData | null> => {
  try {
    // Mock implementation
    return {
      id: creatorId,
      uid: creatorId,
      username: `creator${creatorId}`,
      displayName: `Creator ${creatorId}`,
      bio: `This is creator ${creatorId}'s profile bio.`,
      avatarUrl: `https://i.pravatar.cc/300?img=${parseInt(creatorId.slice(-1)) || 1}`,
      coverImageUrl: 'https://images.unsplash.com/photo-1557682250-4b256bdf92fa',
      isPremium: true,
      isOnline: true,
      metrics: {
        followers: 450,
        likes: 2300,
        rating: 4.8
      }
    };
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    return null;
  }
};

// Follower system
export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  // Mock implementation
  return ['creator-1', 'creator-3', 'creator-5'];
};

export const getFollowedCreators = async (userId: string) => {
  // Mock implementation - Get creators followed by user
  const followedIds = await getUserFollowedCreatorIds(userId);
  const creators = [];
  
  for (const id of followedIds) {
    const creator = await getCreatorById(id);
    if (creator) creators.push(creator);
  }
  
  return creators;
};

export const followCreator = async (userId: string, creatorId: string) => {
  try {
    // Mock implementation
    console.log(`User ${userId} is now following creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
};

export const unfollowCreator = async (userId: string, creatorId: string) => {
  try {
    // Mock implementation
    console.log(`User ${userId} has unfollowed creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
};

export const checkUserFollowsCreator = async (userId: string, creatorId: string) => {
  try {
    // Mock implementation
    const followedCreatorIds = await getUserFollowedCreatorIds(userId);
    return followedCreatorIds.includes(creatorId);
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};
