
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

// Creator following functionality
export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    // This would normally call an API endpoint
    console.log(`User ${userId} is now following creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
};

export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    // This would normally call an API endpoint
    console.log(`User ${userId} has unfollowed creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
};

export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    // This would normally call an API endpoint
    // For now, we'll randomly determine if a user follows a creator
    const follows = Math.random() > 0.5;
    return follows;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

// Video management functions
export const getCreatorVideos = async (creatorId: string): Promise<VideoData[]> => {
  try {
    // This would normally call an API endpoint
    return [
      {
        id: '1',
        title: 'Introduction Video',
        description: 'Welcome to my channel!',
        thumbnailUrl: 'https://example.com/thumbnail1.jpg',
        status: 'ready',
        type: 'standard',
        isPremium: false
      },
      {
        id: '2',
        title: 'Premium Content',
        description: 'Exclusive content for subscribers',
        thumbnailUrl: 'https://example.com/thumbnail2.jpg',
        status: 'ready',
        type: 'premium',
        isPremium: true,
        tokenPrice: 5
      }
    ];
  } catch (error) {
    console.error('Error fetching creator videos:', error);
    return [];
  }
};

export const getVideoById = async (videoId: string): Promise<VideoData | null> => {
  try {
    // This would normally call an API endpoint
    return {
      id: videoId,
      title: 'Sample Video',
      description: 'This is a sample video',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      status: 'ready',
      type: 'standard',
      isPremium: false
    };
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
};
