
// Define the necessary types for the Stories feature
export type StoryFilter = 'none' | 'sepia' | 'grayscale' | 'blur' | 'vintage' | 'neon' | 'vibrant' | 'minimal';

export interface StoryData {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  mediaUrl: string;
  caption?: string;
  filter?: StoryFilter;
  duration: number;
  createdAt: number | string;
  expiresAt: number | string;
  viewCount: number;
  tags?: string[];
  reactions?: Record<string, number>;
  metadata?: Record<string, any>;
  isExpired?: boolean;
}

export interface StoryUploadParams {
  mediaFile: File;
  caption?: string;
  filter?: StoryFilter;
  duration: number;
  expiresIn: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  stories: StoryData[];
  hasNewStories: boolean;
  lastActive: number | string;
}

export interface StoriesResponse {
  data: StoryData[];
  meta: {
    hasMore: boolean;
    cursor: string | null;
    total: number;
  };
}

export interface StoryReactionPayload {
  storyId: string;
  reaction: string;
  userId: string;
}
