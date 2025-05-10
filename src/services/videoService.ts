import { supabase } from '@/integrations/supabase/client';
import { incrementEphemeralView, checkEphemeralAccess } from './ephemeralVideoService';

/**
 * Interface pour les statistiques vidéo
 */
export interface VideoStats {
  video_id: number;
  views: number;
  likes: number;
  comments_count: number;
  avg_watch_time_seconds: number;
  last_updated_at: string;
}

/**
 * Increment the view count for a video
 * @param videoId The ID of the video
 */
export const incrementVideoViews = async (videoId: string | number) => {
  try {
    // Convert string ID to number if necessary
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // First get the current views
    const { data, error } = await supabase
      .from('video_stats')
      .select('views')
      .eq('video_id', numericId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video stats:', error);
      return;
    }

    // Si la vidéo a des options éphémères, incrémenter également le compteur éphémère
    const { data: videoData } = await supabase
      .from('videos')
      .select('ephemeral_options')
      .eq('id', numericId)
      .maybeSingle();
      
    if (videoData?.ephemeral_options?.ephemeral_mode) {
      await incrementEphemeralView(numericId);
    }

    if (data) {
      // Update existing stats
      await supabase
        .from('video_stats')
        .update({ 
          views: (data.views || 0) + 1,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', numericId);
    } else {
      // Create new stats
      await supabase
        .from('video_stats')
        .insert([
          { 
            video_id: numericId, 
            views: 1,
            likes: 0,
            comments_count: 0,
            avg_watch_time_seconds: 0,
            last_updated_at: new Date().toISOString()
          }
        ]);
    }
  } catch (error) {
    console.error('Error incrementing video views:', error);
  }
};

/**
 * Track video watch time
 * @param videoId The ID of the video
 * @param seconds The number of seconds watched
 */
export const trackVideoWatchTime = async (videoId: string | number, seconds: number) => {
  try {
    // Ensure seconds is a positive number
    if (seconds <= 0) return;
    
    // Convert string ID to number if necessary
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // First get the current stats
    const { data, error } = await supabase
      .from('video_stats')
      .select('views, avg_watch_time_seconds')
      .eq('video_id', numericId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video stats for watch time:', error);
      return;
    }

    if (data) {
      // Calculate new average watch time
      const totalViews = data.views || 1;
      const currentAvgSeconds = data.avg_watch_time_seconds || 0;
      const newAvgSeconds = ((currentAvgSeconds * (totalViews - 1)) + seconds) / totalViews;
      
      // Update stats
      await supabase
        .from('video_stats')
        .update({ 
          avg_watch_time_seconds: newAvgSeconds,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', numericId);
    } else {
      // Create new stats record
      await supabase
        .from('video_stats')
        .insert([
          { 
            video_id: numericId, 
            views: 1,
            likes: 0,
            comments_count: 0,
            avg_watch_time_seconds: seconds,
            last_updated_at: new Date().toISOString()
          }
        ]);
    }
  } catch (error) {
    console.error('Error tracking video watch time:', error);
  }
};

/**
 * Toggle like state for a video
 * @param videoId The ID of the video
 * @param isLiked Whether the video is being liked (true) or unliked (false)
 */
export const toggleVideoLike = async (videoId: string | number, isLiked: boolean) => {
  try {
    // Convert string ID to number if necessary
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // First get the current likes
    const { data, error } = await supabase
      .from('video_stats')
      .select('likes')
      .eq('video_id', numericId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video likes:', error);
      return;
    }

    const likesChange = isLiked ? 1 : -1;

    if (data) {
      // Calculate new likes count (ensure it doesn't go below 0)
      const currentLikes = data.likes || 0;
      const newLikes = Math.max(0, currentLikes + likesChange);
      
      // Update existing stats
      await supabase
        .from('video_stats')
        .update({ 
          likes: newLikes,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', numericId);
    } else if (isLiked) {
      // Only create new record if liking (not unliking a non-existent record)
      await supabase
        .from('video_stats')
        .insert([
          { 
            video_id: numericId,
            views: 0,
            likes: 1,
            comments_count: 0,
            avg_watch_time_seconds: 0,
            last_updated_at: new Date().toISOString()
          }
        ]);
    }
  } catch (error) {
    console.error('Error toggling video like:', error);
  }
};

/**
 * Get video by ID
 * @param videoId The ID of the video
 */
export const getVideoById = async (videoId: string | number) => {
  try {
    // Convert string ID to number if necessary
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // Vérifier si la vidéo est accessible selon les contraintes éphémères
    const ephemeralAccess = await checkEphemeralAccess(numericId);
    if (!ephemeralAccess.canAccess) {
      return {
        error: true,
        reason: ephemeralAccess.reason,
        message: 
          ephemeralAccess.reason === 'expired' 
            ? 'Cette vidéo a expiré et n\'est plus disponible.' 
            : ephemeralAccess.reason === 'max_views_reached'
            ? 'Cette vidéo a atteint son nombre maximum de vues.'
            : 'Cette vidéo n\'est pas accessible.'
      };
    }
    
    // Fetch video data
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Get video stats if available
    const { data: statsData } = await supabase
      .from('video_stats')
      .select('*')
      .eq('video_id', numericId)
      .maybeSingle();

    // Combine video data with stats
    return {
      ...data,
      stats: statsData || {
        views: 0,
        likes: 0,
        comments_count: 0,
        avg_watch_time_seconds: 0
      }
    };
  } catch (error) {
    console.error('Error in getVideoById:', error);
    return null;
  }
};

/**
 * Get video statistics
 * @param videoId The ID of the video
 */
export const getVideoStats = async (videoId: string | number): Promise<VideoStats | null> => {
  try {
    // Convert string ID to number if necessary
    const numericId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
    
    // Fetch video stats
    const { data, error } = await supabase
      .from('video_stats')
      .select('*')
      .eq('video_id', numericId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video stats:', error);
      return null;
    }

    if (!data) {
      return {
        video_id: numericId,
        views: 0,
        likes: 0,
        comments_count: 0,
        avg_watch_time_seconds: 0,
        last_updated_at: new Date().toISOString()
      };
    }

    return data as VideoStats;
  } catch (error) {
    console.error('Error in getVideoStats:', error);
    return null;
  }
};
