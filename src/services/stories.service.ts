
import { Story, StoryTag, StoryView, StoryUploadParams, StoryFilter } from '@/types/stories';
import { StoriesCoreService } from '@/services/stories-core.service';
import { StoryUploadService } from '@/services/story-upload.service';
import { StoryViewService } from '@/services/story-view.service';
import { StoryCacheService } from '@/services/story-cache.service';

// Provide a unified facade to the original StoriesService API
export const StoriesService = {
  // Core story fetching methods
  getActiveStories: StoriesCoreService.getActiveStories,
  getCreatorStories: StoriesCoreService.getCreatorStories,
  getStoriesByTag: StoriesCoreService.getStoriesByTag,
  deleteStory: StoriesCoreService.deleteStory,
  
  // Upload and creation methods
  uploadStoryMedia: StoryUploadService.uploadStoryMedia,
  createStory: StoryUploadService.createStory,
  
  // View-related methods
  markStoryAsViewed: StoryViewService.markStoryAsViewed,
  getStoryViews: StoryViewService.getStoryViews,
  
  // Pre-caching
  preCacheStoryMedia: StoryCacheService.preCacheStoryMedia
};
