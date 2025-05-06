
import { supabase } from '@/integrations/supabase/client';
import { Story, StoryUploadParams } from '@/types/stories';

export const StoryUploadService = {
  // Télécharger un fichier média pour une story
  async uploadStoryMedia(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/stories/${Date.now()}.${fileExt}`;
    
    // Add optimized upload for video files
    let compressedFile = file;
    
    // If it's a video and larger than 10MB, we could implement compression here
    if (file.type.includes('video/') && file.size > 10 * 1024 * 1024) {
      // This is a placeholder for video compression
      // In a real implementation, you'd compress the video before upload
      console.log('Large video file detected, compression would be applied here');
    }
    
    const { error, data } = await supabase.storage
      .from('media')
      .upload(filePath, compressedFile);
    
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
        metadata: params.metadata || {},
        format: params.mediaFile.type.includes('video/') ? 'video' : 'image'
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
  }
};
