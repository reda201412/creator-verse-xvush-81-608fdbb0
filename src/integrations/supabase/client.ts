
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ryuczcsiiyghdnxanofq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWN6Y3NpaXlnaGRueGFub2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDA3MTMsImV4cCI6MjA2MjAxNjcxM30.Cpn4lRh0GZheCACpT6ULlOiQ1h_ZjhggFxyP_Hhuh4c";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper functions to access promotional videos (for Xvush app)
export const getPromotionalVideos = async () => {
  return supabase
    .from('videos')
    .select('*')
    .in('type', ['standard', 'teaser'])
    .order('uploadedat', { ascending: false });
};

// Helper function to get creator videos
export const getCreatorVideos = async (creatorId: string) => {
  return supabase
    .from('videos')
    .select('*')
    .eq('user_id', creatorId)
    .order('uploadedat', { ascending: false });
};

// Function to get video by ID
export const getVideoById = async (videoId: string | number) => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  return supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
};

// Helper functions for user follows since they're not in the generated types yet
export const checkUserFollowStatus = async (followerId: string, creatorId: string) => {
  // TypeScript thinks this table doesn't exist, so we need to use a workaround
  const { data, error } = await supabase
    .from('user_follows' as any)
    .select('*')
    .eq('follower_id', followerId)
    .eq('creator_id', creatorId)
    .single();
  
  return { data, error };
};

export const unfollowCreator = async (followerId: string, creatorId: string) => {
  const { data, error } = await supabase
    .from('user_follows' as any)
    .delete()
    .eq('follower_id', followerId)
    .eq('creator_id', creatorId);
    
  return { data, error };
};

export const followCreator = async (followerId: string, creatorId: string) => {
  const { data, error } = await supabase
    .from('user_follows' as any)
    .insert([
      { follower_id: followerId, creator_id: creatorId }
    ]);
    
  return { data, error };
};

export const getUserFollows = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_follows' as any)
    .select('creator_id')
    .eq('follower_id', userId);
    
  return { data, error };
};
