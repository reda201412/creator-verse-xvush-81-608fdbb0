
import { VideoData } from '../types/video';

// Re-export the VideoData type for compatibility
export type { VideoData } from '../types/video';

// Create a mock service that returns videos for development
export const getCreatorVideos = async (userId: string): Promise<VideoData[]> => {
  // Mock implementation for demonstration
  console.log(`Fetching videos for creator ${userId}`);
  
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      userId,
      title: 'Introduction to XDose',
      description: 'Learn about the platform and how to get started',
      thumbnailUrl: 'https://source.unsplash.com/random/800x450?fitness',
      isPremium: false,
      type: 'standard',
      viewCount: 1250,
      likeCount: 87,
      commentCount: 14,
      isPublished: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      userId,
      title: 'Premium Content Demo',
      description: 'This is a premium video available to subscribers only',
      thumbnailUrl: 'https://source.unsplash.com/random/800x450?workout',
      isPremium: true,
      price: 5.99,
      type: 'premium',
      viewCount: 420,
      likeCount: 38,
      commentCount: 7,
      isPublished: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: '3',
      userId,
      title: 'Coming Soon: Advanced Techniques',
      description: 'A preview of upcoming premium content',
      thumbnailUrl: 'https://source.unsplash.com/random/800x450?trainer',
      isPremium: false,
      type: 'teaser',
      viewCount: 650,
      likeCount: 42,
      commentCount: 9,
      isPublished: true,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ];
};

// Helper methods for following creators
export const followCreator = async (userId: string): Promise<boolean> => {
  try {
    // Mock implementation - in a real app, this would call an API
    console.log(`User ${userId} followed a creator`);
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
};

export const unfollowCreator = async (userId: string): Promise<boolean> => {
  try {
    // Mock implementation - in a real app, this would call an API
    console.log(`User ${userId} unfollowed a creator`);
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
};

export const checkUserFollowsCreator = async (userId: string): Promise<boolean> => {
  try {
    // Mock implementation - in a real app, this would check a database
    return Math.random() > 0.5; // Randomly return true or false for demo purposes
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

// Get a single video by ID
export const getVideoById = async (videoId: number | string): Promise<VideoData | null> => {
  try {
    // Mock implementation for now
    const response = await fetch(`/api/videos/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    
    const video = await response.json();
    return {
      id: video.id,
      userId: video.userId || video.user_id,
      title: video.title || "Untitled",
      description: video.description || "",
      type: video.type || "standard",
      thumbnailUrl: video.thumbnailUrl || video.thumbnail_url,
      isPremium: video.isPremium || video.is_premium || false,
      price: video.price || video.tokenPrice || 0,
      tokenPrice: video.price || video.tokenPrice || 0,
      playbackId: video.playbackId || video.mux_playback_id,
      status: video.status || "processing",
      viewCount: video.viewCount || 0,
      likeCount: video.likeCount || 0,
      commentCount: video.commentCount || 0
    };
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

export const uploadVideo = async (videoData: Partial<VideoData>): Promise<VideoData> => {
  console.log('Uploading video:', videoData);
  
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a new video with the provided data
  const newVideo: VideoData = {
    id: `video-${Date.now()}`,
    userId: videoData.userId || 'default-user',
    title: videoData.title || 'Untitled Video',
    description: videoData.description || '',
    thumbnailUrl: videoData.thumbnailUrl || 'https://source.unsplash.com/random/800x450?fitness',
    isPremium: videoData.isPremium || false,
    price: videoData.price || 0,
    type: videoData.type || 'standard',
    isPublished: false,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    createdAt: new Date().toISOString()
  };
  
  return newVideo;
};
