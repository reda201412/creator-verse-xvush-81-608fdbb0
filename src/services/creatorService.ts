
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
    
    // Map the API response to the VideoData format
    return videos.map((video: any) => ({
      id: video.id,
      creator_id: video.userId || video.user_id || creatorId,
      title: video.title || "Untitled",
      description: video.description || "",
      type: video.type || "standard",
      thumbnail_url: video.thumbnailUrl || video.thumbnail_url,
      is_premium: video.isPremium || video.is_premium || false,
      price: video.price || video.tokenPrice || 0,
      mux_playback_id: video.playbackId || video.mux_playback_id,
      status: video.status || "processing",
      viewCount: video.viewCount || 0,
      likeCount: video.likeCount || 0,
      commentCount: video.commentCount || 0
    }));
  } catch (error) {
    console.error("Error fetching creator videos:", error);
    return [];
  }
};
