import { prisma } from '@/lib/prisma';

export interface VideoData {
  id: number;
  userId: string;
  user_id?: string; // For backward compatibility
  title: string;
  description: string | null;
  assetId: string | null;
  mux_asset_id?: string | null; // For backward compatibility
  uploadId: string | null;
  mux_upload_id?: string | null; // For backward compatibility
  playbackId: string | null;
  mux_playback_id?: string | null; // For backward compatibility
  status: 'pending' | 'processing' | 'ready' | 'error';
  duration: number | null;
  aspectRatio: string | null;
  aspect_ratio?: string | null; // For backward compatibility
  thumbnailUrl: string | null;
  thumbnail_url?: string | null; // For backward compatibility
  videoUrl: string | null;
  video_url?: string | null; // For backward compatibility
  isPublished: boolean;
  isPremium: boolean;
  is_premium?: boolean; // For backward compatibility
  price: number | null;
  token_price?: number | null; // For backward compatibility
  viewCount: number;
  view_count?: number; // For backward compatibility
  likeCount: number;
  like_count?: number; // For backward compatibility
  commentCount: number;
  comment_count?: number; // For backward compatibility
  type?: string; // Video type (standard, teaser, premium, vip)
  format?: {
    duration?: number;
    width?: number;
    height?: number;
    aspect_ratio?: string;
    [key: string]: unknown;
  };
  error_details?: Record<string, unknown>; // Error details if any
  createdAt: Date | string;
  updatedAt: Date | string;
  metadata?: Record<string, unknown> | null;
}

export interface CreatorProfileData {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  isCreator: boolean;
  isOnline?: boolean;
  isPremium?: boolean;
  metrics: {
    followers: number;
    following: number;
    videos: number;
  };
}

// Get creator by ID from Prisma
export const getCreatorById = async (id: string): Promise<CreatorProfileData | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            videos: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=random`,
      coverImageUrl: user.coverImageUrl,
      isCreator: user.isCreator,
      isOnline: Math.random() > 0.5, // Simulate online status
      metrics: {
        followers: user._count?.followers || 0,
        following: user._count?.following || 0,
        videos: user._count?.videos || 0,
      },
    };
  } catch (error) {
    console.error('Error in getCreatorById:', error);
    return null;
  }
};

// Get all creators from Prisma
export const getAllCreators = async (): Promise<CreatorProfileData[]> => {
  try {
    const creators = await prisma.user.findMany({
      where: { isCreator: true },
      include: {
        _count: {
          select: {
            videos: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    return creators.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      bio: user.bio,
      profileImageUrl: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=random`,
      coverImageUrl: user.coverImageUrl,
      isCreator: user.isCreator,
      isOnline: Math.random() > 0.5, // Simulate online status
      metrics: {
        followers: user._count?.followers || 0,
        following: user._count?.following || 0,
        videos: user._count?.videos || 0,
      },
    }));
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    return [];
  }
};

// Get creator videos from Prisma
export const getCreatorVideos = async (creatorId: string): Promise<VideoData[]> => {
  try {
    const videos = await prisma.video.findMany({
      where: {
        userId: creatorId,
        isPublished: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return videos.map(video => ({
      id: video.id,
      userId: video.userId,
      user_id: video.userId, // For backward compatibility
      title: video.title,
      description: video.description,
      assetId: video.assetId || null,
      mux_asset_id: video.assetId || null, // For backward compatibility
      uploadId: video.uploadId || null,
      mux_upload_id: video.uploadId || null, // For backward compatibility
      playbackId: video.playbackId || null,
      mux_playback_id: video.playbackId || null, // For backward compatibility
      status: video.status as 'pending' | 'processing' | 'ready' | 'error' || 'pending',
      duration: video.duration || null,
      aspectRatio: video.aspectRatio || null,
      aspect_ratio: video.aspectRatio || null, // For backward compatibility
      thumbnailUrl: video.thumbnailUrl || null,
      thumbnail_url: video.thumbnailUrl || null, // For backward compatibility
      videoUrl: video.videoUrl || null,
      video_url: video.videoUrl || null, // For backward compatibility
      isPublished: video.isPublished || false,
      isPremium: video.isPremium || false,
      is_premium: video.isPremium || false, // For backward compatibility
      price: video.price || null,
      token_price: video.price || null, // For backward compatibility
      viewCount: video.viewCount || 0,
      view_count: video.viewCount || 0, // For backward compatibility
      likeCount: video.likeCount || 0,
      like_count: video.likeCount || 0, // For backward compatibility
      commentCount: video.commentCount || 0,
      comment_count: video.commentCount || 0, // For backward compatibility
      type: video.type || 'standard',
      format: video.format ? JSON.parse(JSON.stringify(video.format)) : undefined,
      error_details: video.errorDetails ? JSON.parse(JSON.stringify(video.errorDetails)) : undefined,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      metadata: video.metadata ? JSON.parse(JSON.stringify(video.metadata)) : null,
    }));
  } catch (error) {
    console.error('Error in getCreatorVideos:', error);
    return [];
  }
};

// Get a single video by ID from Prisma
export const getVideoById = async (videoId: number): Promise<VideoData | null> => {
  try {
    if (!videoId) {
      throw new Error('Video ID is required');
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) return null;

    return {
      id: video.id,
      userId: video.userId,
      user_id: video.userId, // For backward compatibility
      title: video.title,
      description: video.description,
      assetId: video.assetId || null,
      mux_asset_id: video.assetId || null, // For backward compatibility
      uploadId: video.uploadId || null,
      mux_upload_id: video.uploadId || null, // For backward compatibility
      playbackId: video.playbackId || null,
      mux_playback_id: video.playbackId || null, // For backward compatibility
      status: video.status as 'pending' | 'processing' | 'ready' | 'error' || 'pending',
      duration: video.duration || null,
      aspectRatio: video.aspectRatio || null,
      aspect_ratio: video.aspectRatio || null, // For backward compatibility
      thumbnailUrl: video.thumbnailUrl || null,
      thumbnail_url: video.thumbnailUrl || null, // For backward compatibility
      videoUrl: video.videoUrl || null,
      video_url: video.videoUrl || null, // For backward compatibility
      isPublished: video.isPublished || false,
      isPremium: video.isPremium || false,
      is_premium: video.isPremium || false, // For backward compatibility
      price: video.price || null,
      token_price: video.price || null, // For backward compatibility
      viewCount: video.viewCount || 0,
      view_count: video.viewCount || 0, // For backward compatibility
      likeCount: video.likeCount || 0,
      like_count: video.likeCount || 0, // For backward compatibility
      commentCount: video.commentCount || 0,
      comment_count: video.commentCount || 0, // For backward compatibility
      type: video.type || 'standard',
      format: video.format ? JSON.parse(JSON.stringify(video.format)) : undefined,
      error_details: video.errorDetails ? JSON.parse(JSON.stringify(video.errorDetails)) : undefined,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      metadata: video.metadata ? JSON.parse(JSON.stringify(video.metadata)) : null,
    };
  } catch (error) {
    console.error('Error in getVideoById:', error);
    return null;
  }
};

// Check if a user follows a creator
export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        creatorId: creatorId,
      },
    });
    
    return !!follow;
  } catch (error) {
    console.error('Error in checkUserFollowsCreator:', error);
    return false;
  }
};

// Follow a creator
export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  if (userId === creatorId) {
    console.warn("User cannot follow themselves.");
    return false;
  }

  try {
    const alreadyFollowing = await checkUserFollowsCreator(userId, creatorId);
    if (alreadyFollowing) {
      console.log("User already follows this creator.");
      return true;
    }

    await prisma.follow.create({
      data: {
        followerId: userId,
        creatorId: creatorId,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error in followCreator:', error);
    return false;
  }
};

// Unfollow a creator
export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    await prisma.follow.deleteMany({
      where: {
        followerId: userId,
        creatorId: creatorId,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error in unfollowCreator:', error);
    return false;
  }
};

// Get all creator IDs that a user follows
export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  try {
    const follows = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        creatorId: true,
      },
    });
    
    return follows.map(follow => follow.creatorId);
  } catch (error) {
    console.error('Error in getUserFollowedCreatorIds:', error);
    return [];
  }
};
