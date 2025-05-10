import { supabase } from '@/integrations/supabase/client';

export interface VideoStats {
  video_id: number;
  views: number;
  likes: number;
  comments_count: number;
  avg_watch_time_seconds: number;
  last_updated_at: string;
}

/**
 * Get video statistics by video ID
 */
export const getVideoStats = async (videoId: number | string): Promise<VideoStats | null> => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  try {
    const { data, error } = await supabase
      .from('video_stats')
      .select('*')
      .eq('video_id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching video statistics:', error);
      return null;
    }
    
    return data as VideoStats;
  } catch (error) {
    console.error('Error in getVideoStats:', error);
    return null;
  }
};

/**
 * Create or update video statistics
 */
export const updateVideoStats = async (
  videoId: number | string, 
  stats: Partial<Omit<VideoStats, 'video_id' | 'last_updated_at'>>
): Promise<boolean> => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  try {
    // Check if stats exist for this video
    const { data: existingStats } = await supabase
      .from('video_stats')
      .select('*')
      .eq('video_id', id)
      .maybeSingle();
    
    if (existingStats) {
      // Update existing stats
      const { error } = await supabase
        .from('video_stats')
        .update({
          ...stats,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', id);
      
      if (error) {
        console.error('Error updating video statistics:', error);
        return false;
      }
    } else {
      // Create new stats record
      const { error } = await supabase
        .from('video_stats')
        .insert({
          video_id: id,
          views: stats.views || 0,
          likes: stats.likes || 0,
          comments_count: stats.comments_count || 0,
          avg_watch_time_seconds: stats.avg_watch_time_seconds || 0,
          last_updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating video statistics:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateVideoStats:', error);
    return false;
  }
};

/**
 * Increment views count for a video
 */
export const incrementVideoViews = async (videoId: number | string): Promise<boolean> => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  try {
    const { data: currentStats } = await supabase
      .from('video_stats')
      .select('views')
      .eq('video_id', id)
      .maybeSingle();
    
    if (currentStats) {
      // Increment existing views count
      const { error } = await supabase
        .from('video_stats')
        .update({
          views: (currentStats.views || 0) + 1,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', id);
      
      if (error) {
        console.error('Error incrementing video views:', error);
        return false;
      }
    } else {
      // Create new stats record with 1 view
      const { error } = await supabase
        .from('video_stats')
        .insert({
          video_id: id,
          views: 1,
          likes: 0,
          comments_count: 0,
          avg_watch_time_seconds: 0,
          last_updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating video statistics record:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in incrementVideoViews:', error);
    return false;
  }
};

/**
 * Track video watch time
 */
export const trackVideoWatchTime = async (
  videoId: number | string, 
  watchTimeSeconds: number
): Promise<boolean> => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  try {
    const { data: currentStats } = await supabase
      .from('video_stats')
      .select('avg_watch_time_seconds, views')
      .eq('video_id', id)
      .maybeSingle();
    
    if (currentStats) {
      // Calculate new average watch time
      const totalViews = (currentStats.views || 0);
      const currentAvgTime = currentStats.avg_watch_time_seconds || 0;
      
      // If we have existing views, calculate a running average
      // Otherwise, just use this watch time as the average
      const newAvgTime = totalViews > 1 
        ? ((currentAvgTime * (totalViews - 1)) + watchTimeSeconds) / totalViews 
        : watchTimeSeconds;
      
      const { error } = await supabase
        .from('video_stats')
        .update({
          avg_watch_time_seconds: newAvgTime,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', id);
      
      if (error) {
        console.error('Error updating video watch time:', error);
        return false;
      }
    } else {
      // Create new stats record with watch time
      const { error } = await supabase
        .from('video_stats')
        .insert({
          video_id: id,
          views: 1,
          likes: 0,
          comments_count: 0,
          avg_watch_time_seconds: watchTimeSeconds,
          last_updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating video statistics record:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in trackVideoWatchTime:', error);
    return false;
  }
};

/**
 * Toggle like for a video
 */
export const toggleVideoLike = async (
  videoId: number | string, 
  isLiked: boolean
): Promise<boolean> => {
  // Convert string ID to number if necessary
  const id = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  try {
    const { data: currentStats } = await supabase
      .from('video_stats')
      .select('likes')
      .eq('video_id', id)
      .maybeSingle();
    
    // The delta to apply to the likes count
    const delta = isLiked ? 1 : -1;
    
    if (currentStats) {
      // Update existing likes count
      const newLikesCount = Math.max(0, (currentStats.likes || 0) + delta);
      
      const { error } = await supabase
        .from('video_stats')
        .update({
          likes: newLikesCount,
          last_updated_at: new Date().toISOString()
        })
        .eq('video_id', id);
      
      if (error) {
        console.error('Error updating video likes:', error);
        return false;
      }
    } else {
      // Create new stats record with like
      const { error } = await supabase
        .from('video_stats')
        .insert({
          video_id: id,
          views: 0,
          likes: isLiked ? 1 : 0,
          comments_count: 0,
          avg_watch_time_seconds: 0,
          last_updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating video statistics record:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in toggleVideoLike:', error);
    return false;
  }
};
