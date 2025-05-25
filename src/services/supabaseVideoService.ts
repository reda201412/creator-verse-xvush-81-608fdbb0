
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Video = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];
type VideoUpdate = Database['public']['Tables']['videos']['Update'];

export const supabaseVideoService = {
  // Get all videos for the current user
  async getMyVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }

    return data || [];
  },

  // Get published videos (public feed)
  async getPublishedVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published videos:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new video
  async createVideo(videoData: VideoInsert): Promise<Video> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('videos')
      .insert({
        ...videoData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      throw error;
    }

    return data;
  },

  // Update a video
  async updateVideo(id: number, updates: VideoUpdate): Promise<Video> {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      throw error;
    }

    return data;
  },

  // Delete a video
  async deleteVideo(id: number): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Like a video
  async likeVideo(videoId: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('likes')
      .insert({
        video_id: videoId,
        user_id: user.id
      });

    if (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  },

  // Unlike a video
  async unlikeVideo(videoId: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error unliking video:', error);
      throw error;
    }
  },

  // Add a comment
  async addComment(videoId: number, content: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: user.id,
        content
      });

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get comments for a video
  async getVideoComments(videoId: number) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles!comments_user_id_fkey (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data || [];
  }
};
