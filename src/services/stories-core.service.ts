
import { supabase } from '@/integrations/supabase/client';
import { Story, StoryFilter } from '@/types/stories';
import { MediaCacheService } from '@/services/media-cache.service';

export const StoriesCoreService = {
  // Récupérer les stories actives (non expirées)
  async getActiveStories(): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        user_profiles:creator_id(*)
      `)
      .lt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
    
    const stories = (data || []).map(item => ({
      ...item,
      filter_used: (item.filter_used || 'none') as StoryFilter,
      creator: item.user_profiles as any // Cast to the correct type
    })) as Story[];
    
    // Pre-cache thumbnails for better performance
    MediaCacheService.preCacheStoryMedia(stories);
    
    return stories;
  },
  
  // Récupérer les stories d'un créateur spécifique
  async getCreatorStories(creatorId: string): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags(*)
      `)
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching creator stories:', error);
      throw error;
    }
    
    const stories = (data || []).map(item => ({
      ...item,
      filter_used: (item.filter_used || 'none') as StoryFilter,
      tags: item.story_tags as any // Cast to the correct type
    })) as Story[];
    
    // Pre-cache thumbnails for better performance
    MediaCacheService.preCacheStoryMedia(stories);
    
    return stories;
  },
  
  // Récupérer les stories par tag
  async getStoriesByTag(tagName: string): Promise<Story[]> {
    const { data, error } = await supabase
      .from('story_tags')
      .select(`
        stories:story_id(
          *,
          user_profiles:creator_id(*)
        )
      `)
      .eq('tag_name', tagName.toLowerCase())
      .lt('stories.expires_at', new Date().toISOString());
    
    if (error) {
      console.error('Error fetching stories by tag:', error);
      throw error;
    }
    
    // Extract stories from nested structure and ensure filter_used is a valid StoryFilter
    const stories = (data || [])
      .map(item => item.stories)
      .filter(Boolean)
      .map(story => ({
        ...story,
        filter_used: (story.filter_used || 'none') as StoryFilter,
        creator: story.user_profiles as any
      })) as Story[];
    
    // Pre-cache thumbnails for better performance
    MediaCacheService.preCacheStoryMedia(stories);
    
    return stories;
  },
  
  // Supprimer une story
  async deleteStory(storyId: string): Promise<void> {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);
    
    if (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }
};
