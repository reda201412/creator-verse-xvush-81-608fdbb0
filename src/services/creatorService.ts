import { User } from '@/types/auth';

// Enhanced VideoData interface with all required properties
export interface VideoData {
  id: string;
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  views?: number;
  likes?: number;
  comments?: number;
  createdAt?: string;
  userId?: string;
  type?: string;
  format?: string;
  visibility?: string;
  privacy?: string;
  videoType?: string;
  status?: 'processing' | 'ready' | 'errored';
  muxPlaybackId?: string;
  muxAssetId?: string;
  isPremium?: boolean;
  tokenPrice?: number;
}

export interface CreatorProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
    videos: number;
  };
  isVerified: boolean;
  isOnline: boolean;
  category: string;
  joinedDate: string;
  socialLinks?: Record<string, string>;
  subscriptionTiers?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    benefits: string[];
  }>;
  user_id?: string;
  name?: string;
}

// Mock data and functions for creator services
export async function followCreator(userId: string, creatorId: string): Promise<boolean> {
  console.log(`User ${userId} is following creator ${creatorId}`);
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
}

export async function unfollowCreator(userId: string, creatorId: string): Promise<boolean> {
  console.log(`User ${userId} is unfollowing creator ${creatorId}`);
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
}

export async function checkUserFollowsCreator(userId: string, creatorId: string): Promise<boolean> {
  console.log(`Checking if user ${userId} follows creator ${creatorId}`);
  // Simulate API call with random result
  return new Promise(resolve => {
    setTimeout(() => resolve(Math.random() > 0.5), 500);
  });
}

export async function getAllCreators(): Promise<CreatorProfileData[]> {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: "creator1",
          username: "creator1",
          displayName: "Creator One",
          avatarUrl: "https://i.pravatar.cc/150?u=creator1",
          bio: "Digital creator and lifestyle influencer",
          stats: { followers: 15000, following: 500, posts: 320, videos: 45 },
          isVerified: true,
          isOnline: true,
          category: "Lifestyle",
          joinedDate: "2023-01-15",
          user_id: "creator1"
        },
        {
          id: "creator2",
          username: "creator2",
          displayName: "Creator Two",
          avatarUrl: "https://i.pravatar.cc/150?u=creator2",
          bio: "Fashion model and photographer",
          stats: { followers: 25000, following: 300, posts: 520, videos: 120 },
          isVerified: true,
          isOnline: false,
          category: "Fashion",
          joinedDate: "2022-10-03",
          user_id: "creator2"
        }
      ]);
    }, 1000);
  });
}

export async function getVideoById(videoId: string): Promise<VideoData> {
  console.log(`Fetching video with ID: ${videoId}`);
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: videoId,
        title: "Sample Video",
        description: "This is a sample video for testing purposes",
        url: "https://example.com/video.mp4",
        thumbnailUrl: "https://example.com/thumbnail.jpg",
        duration: 120, // seconds
        views: 1500,
        likes: 250,
        comments: 45,
        createdAt: "2023-05-15T10:30:00Z"
      });
    }, 500);
  });
}

// Add missing getCreatorVideos function
export async function getCreatorVideos(creatorId: string): Promise<VideoData[]> {
  console.log(`Fetching videos for creator with ID: ${creatorId}`);
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: "video1",
          title: "Introduction to Content Creation",
          description: "Learn the basics of content creation in this tutorial",
          thumbnailUrl: "https://i.pravatar.cc/300?img=1",
          createdAt: "2025-05-01T10:30:00Z",
          views: 1250,
          likes: 230,
          comments: 45,
          status: "ready",
          type: "standard",
          muxPlaybackId: "play_id_1",
          isPremium: false
        },
        {
          id: "video2",
          title: "Premium Content Strategy",
          description: "Advanced techniques for creating premium content",
          thumbnailUrl: "https://i.pravatar.cc/300?img=2",
          createdAt: "2025-05-05T14:20:00Z",
          views: 750,
          likes: 180,
          comments: 32,
          status: "ready",
          type: "premium",
          muxPlaybackId: "play_id_2",
          isPremium: true,
          tokenPrice: 25
        },
        {
          id: "video3",
          title: "New Upload Processing",
          description: "This video is still being processed",
          thumbnailUrl: "https://i.pravatar.cc/300?img=3",
          createdAt: "2025-05-15T08:45:00Z",
          status: "processing",
          type: "vip",
          isPremium: true,
          tokenPrice: 50
        }
      ]);
    }, 1000);
  });
}
