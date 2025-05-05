
import { supabase } from '@/integrations/supabase/client';
import { Story, StoryTag, StoryView, StoryUploadParams, StoryFilter } from '@/types/stories';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export const StoriesService = {
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
    
    // Ensure filter_used is a valid StoryFilter
    return (data || []).map(item => ({
      ...item,
      filter_used: (item.filter_used || 'none') as StoryFilter,
      creator: item.user_profiles as any // Cast to the correct type
    })) as Story[];
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
    
    // Ensure filter_used is a valid StoryFilter
    return (data || []).map(item => ({
      ...item,
      filter_used: (item.filter_used || 'none') as StoryFilter,
      tags: item.story_tags as any // Cast to the correct type
    })) as Story[];
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
    return (data || [])
      .map(item => item.stories)
      .filter(Boolean)
      .map(story => ({
        ...story,
        filter_used: (story.filter_used || 'none') as StoryFilter,
        creator: story.user_profiles as any
      })) as Story[];
  },
  
  // Télécharger un fichier média pour une story
  async uploadStoryMedia(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/stories/${Date.now()}.${fileExt}`;
    
    const { error, data } = await supabase.storage
      .from('media')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading story media:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
      
    return publicUrl;
  },
  
  // Créer une nouvelle story
  async createStory(params: StoryUploadParams, userId: string): Promise<Story> {
    // Upload media file
    const mediaUrl = await this.uploadStoryMedia(params.mediaFile, userId);
    
    // Upload thumbnail if provided
    let thumbnailUrl = undefined;
    if (params.thumbnailFile) {
      thumbnailUrl = await this.uploadStoryMedia(params.thumbnailFile, userId);
    }
    
    // Calculate expiration date (default: 24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (params.expiresIn || 24));
    
    // Create story record
    const { data, error } = await supabase
      .from('stories')
      .insert({
        creator_id: userId,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        caption: params.caption,
        filter_used: params.filter || 'none',
        duration: params.duration || 10,
        expires_at: expiresAt.toISOString(),
        metadata: params.metadata || {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating story:', error);
      throw error;
    }
    
    // Add tags if provided
    if (params.tags && params.tags.length > 0 && data) {
      const storyTags = params.tags.map(tag => ({
        story_id: data.id,
        tag_name: tag.toLowerCase()
      }));
      
      const { error: tagsError } = await supabase
        .from('story_tags')
        .insert(storyTags);
      
      if (tagsError) {
        console.error('Error adding story tags:', tagsError);
        // We don't throw here, as the story is already created
      }
    }
    
    return data as Story;
  },
  
  // Marquer une story comme vue par l'utilisateur actuel
  async markStoryAsViewed(storyId: string, viewDuration: number = 0): Promise<void> {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      return;
    }
    
    const { error } = await supabase
      .from('story_views')
      .upsert({
        story_id: storyId,
        viewer_id: userId,
        view_duration: viewDuration,
        viewed_at: new Date().toISOString()
      }, {
        onConflict: 'story_id,viewer_id'
      });
    
    if (error) {
      console.error('Error marking story as viewed:', error);
      throw error;
    }
    
    try {
      // Call Supabase edge function to increment view count
      await supabase.functions.invoke('increment-story-views', {
        body: { storyId }
      });
    } catch (error) {
      console.error('Error incrementing story views:', error);
    }
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
  },
  
  // Récupérer les vues d'une story
  async getStoryViews(storyId: string): Promise<StoryView[]> {
    const { data, error } = await supabase
      .from('story_views')
      .select(`
        *,
        user_profiles:viewer_id(*)
      `)
      .eq('story_id', storyId)
      .order('viewed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching story views:', error);
      throw error;
    }
    
    return data || [];
  }
};
