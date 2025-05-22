
import { VideoData as VideoDataType } from '@/types/video';

// Re-export the VideoData type for compatibility
export type { VideoData } from '@/types/video';

// Create a mock service that returns videos for development
export const getCreatorVideos = async (creatorId: string): Promise<VideoDataType[]> => {
  try {
    // Make API request to get creator videos
    const response = await fetch(`/api/videos?userId=${creatorId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch creator videos');
    }
    
    const videos = await response.json();
    
    // Map the API response to the VideoData format with normalized property names
    return videos.map((video: any) => ({
      id: video.id,
      userId: video.userId || video.user_id || creatorId,
      creatorId: video.userId || video.user_id || creatorId, // Add camelCase variant
      title: video.title || "Untitled",
      description: video.description || "",
      type: video.type || "standard",
      thumbnailUrl: video.thumbnailUrl || video.thumbnail_url,
      thumbnail_url: video.thumbnailUrl || video.thumbnail_url, // Add snake_case variant
      isPremium: video.isPremium || video.is_premium || false,
      is_premium: video.isPremium || video.is_premium || false, // Add snake_case variant
      playbackId: video.playbackId || video.mux_playback_id,
      mux_playback_id: video.playbackId || video.mux_playback_id, // Add snake_case variant
      status: video.status || "processing",
      viewCount: video.viewCount || 0,
      likeCount: video.likeCount || 0,
      commentCount: video.commentCount || 0,
      tokenPrice: video.price || video.tokenPrice || 0,
      price: video.price || video.tokenPrice || 0, // Add price property
      // Add creator_id for backward compatibility
      creator_id: video.userId || video.user_id || creatorId
    }));
  } catch (error) {
    console.error("Error fetching creator videos:", error);
    return [];
  }
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
export const getVideoById = async (videoId: number | string): Promise<VideoDataType | null> => {
  try {
    // Mock implementation for now
    const response = await fetch(`/api/videos/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }
    
    const video = await response.json();
    return {
      id: video.id,
      creator_id: video.userId || video.user_id,
      creatorId: video.userId || video.user_id,
      title: video.title || "Untitled",
      description: video.description || "",
      type: video.type || "standard",
      thumbnailUrl: video.thumbnailUrl || video.thumbnail_url,
      thumbnail_url: video.thumbnailUrl || video.thumbnail_url,
      isPremium: video.isPremium || video.is_premium || false,
      is_premium: video.isPremium || video.is_premium || false,
      tokenPrice: video.price || video.tokenPrice || 0,
      price: video.price || video.tokenPrice || 0,
      playbackId: video.playbackId || video.mux_playback_id,
      mux_playback_id: video.playbackId || video.mux_playback_id,
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
