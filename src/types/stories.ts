
// Remove the import of UserProfile from AuthContext and define it here instead
export type StoryFilter = 'none' | 'sepia' | 'grayscale' | 'blur' | 'vintage' | 'neon' | 'vibrant' | 'minimal';

// Use the same interface structure but defined here rather than imported
export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
}

export interface Story {
  id: string;
  creator_id: string;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  filter_used?: StoryFilter;
  format: '16:9' | '9:16' | '1:1';
  duration: number;
  created_at: string;
  expires_at: string;
  view_count: number;
  is_highlighted: boolean;
  creator_name?: string;
  creator_avatar?: string;
  metadata?: {
    location?: {
      latitude: number;
      longitude: number;
      name?: string;
    };
    mentions?: string[];
    hashtags?: string[];
    music?: {
      title: string;
      artist: string;
      url?: string;
    };
    interactive?: {
      poll?: {
        question: string;
        options: string[];
        votes: Record<string, number>;
      };
      quiz?: {
        question: string;
        options: string[];
        correct_option: number;
      };
    };
  };
  creator?: UserProfile;
  tags?: StoryTag[];
  viewed?: boolean;
}

export interface StoryTag {
  id: string;
  story_id: string;
  tag_name: string;
  created_at: string;
}

export interface StoryView {
  id: string;
  story_id: string;
  viewer_id: string;
  viewed_at: string;
  view_duration: number;
  viewer?: UserProfile;
}

export interface StoryUploadParams {
  file: File;
  caption?: string;
  onProgress?: (progress: number) => void;
}

export interface StoryGroup {
  creator: UserProfile;
  stories: Story[];
  lastUpdated: string;
  hasUnviewed: boolean;
}

export interface UseStoriesHookReturn {
  stories: Story[];
  loadingStories: boolean;
  uploadStory: (params: StoryUploadParams) => Promise<boolean>;
  markStoryAsViewed: (storyId: string) => Promise<void>;
  error: string | null;
}
