
import { Story } from '@/types/stories';
import { MediaCacheService } from '@/services/media-cache.service';

export const StoryCacheService = {
  // Pre-cache thumbnails for better performance
  async preCacheStoryMedia(stories: Story[]): Promise<void> {
    if (!MediaCacheService.isCacheAvailable()) return;
    
    // Get all thumbnail URLs
    const thumbnailUrls = stories
      .filter(s => s.thumbnail_url)
      .map(s => s.thumbnail_url as string);
    
    // Preload thumbnails in background
    if (thumbnailUrls.length > 0) {
      MediaCacheService.preCacheVideos(thumbnailUrls).catch(err => {
        console.warn('Failed to pre-cache some thumbnails:', err);
      });
    }
    
    // Preload first few video stories for instant playback
    const videoStories = stories
      .filter(s => s.media_url.includes('.mp4') || s.media_url.includes('.webm'))
      .slice(0, 3); // Only preload first 3 videos
    
    if (videoStories.length > 0) {
      videoStories.forEach(story => {
        fetch(story.media_url, { method: 'HEAD' }).catch(() => {});
      });
    }
  }
};
