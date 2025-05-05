
/**
 * MediaCacheService - Handles video caching for improved performance
 * using the Cache API for modern browsers
 */

const CACHE_NAME = 'xvush-media-cache-v1';
const MAX_CACHE_SIZE = 500 * 1024 * 1024; // 500MB cache limit
const MEDIA_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'image/jpeg', 'image/png'];

export const MediaCacheService = {
  /**
   * Check if the Cache API is available
   */
  isCacheAvailable(): boolean {
    return 'caches' in window;
  },

  /**
   * Cache a video URL for future use
   * @param url Video URL to cache
   * @returns Promise resolving to true if caching succeeded
   */
  async cacheVideo(url: string): Promise<boolean> {
    if (!this.isCacheAvailable()) {
      console.warn('Cache API not available, cannot cache media');
      return false;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(url);
      console.log(`Cached media: ${url}`);
      return true;
    } catch (error) {
      console.error('Error caching media:', error);
      return false;
    }
  },

  /**
   * Pre-cache multiple videos (e.g., for a playlist)
   * @param urls Array of video URLs to cache
   * @returns Promise resolving to array of successfully cached URLs
   */
  async preCacheVideos(urls: string[]): Promise<string[]> {
    if (!this.isCacheAvailable()) return [];
    
    const successfulUrls: string[] = [];
    
    for (const url of urls) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.add(url);
        successfulUrls.push(url);
      } catch (error) {
        console.error(`Failed to cache ${url}:`, error);
      }
    }
    
    return successfulUrls;
  },

  /**
   * Get a video from cache
   * @param url Video URL to retrieve
   * @returns Promise resolving to the cached Response or null
   */
  async getCachedVideo(url: string): Promise<Response | null> {
    if (!this.isCacheAvailable()) return null;
    
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(url);
      return response;
    } catch (error) {
      console.error('Error retrieving cached media:', error);
      return null;
    }
  },

  /**
   * Clear all cached videos
   * @returns Promise resolving to true if cache was cleared
   */
  async clearCache(): Promise<boolean> {
    if (!this.isCacheAvailable()) return false;
    
    try {
      await caches.delete(CACHE_NAME);
      console.log('Media cache cleared');
      return true;
    } catch (error) {
      console.error('Error clearing media cache:', error);
      return false;
    }
  },

  /**
   * Delete a specific video from cache
   * @param url Video URL to delete
   * @returns Promise resolving to true if video was deleted
   */
  async deleteFromCache(url: string): Promise<boolean> {
    if (!this.isCacheAvailable()) return false;
    
    try {
      const cache = await caches.open(CACHE_NAME);
      const result = await cache.delete(url);
      return result;
    } catch (error) {
      console.error('Error deleting from cache:', error);
      return false;
    }
  },

  /**
   * Estimate the current cache size
   * @returns Promise resolving to the estimated cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    if (!this.isCacheAvailable()) return 0;
    
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      let size = 0;
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.clone().blob();
          size += blob.size;
        }
      }
      
      return size;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  },

  /**
   * Check if cache is getting too large and clean up if needed
   * @returns Promise resolving to true if cleanup was performed
   */
  async performCacheCleanup(): Promise<boolean> {
    if (!this.isCacheAvailable()) return false;
    
    try {
      const currentSize = await this.getCacheSize();
      
      if (currentSize > MAX_CACHE_SIZE) {
        console.log('Cache exceeds size limit, cleaning up...');
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        // Sort by oldest requests first (assuming they were added in order)
        const oldestFirst = keys.slice(0, Math.ceil(keys.length / 4)); // Remove oldest 25%
        
        for (const request of oldestFirst) {
          await cache.delete(request);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during cache cleanup:', error);
      return false;
    }
  }
};
