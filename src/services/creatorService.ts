
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Interface for creator profile data
 */
export interface CreatorProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  metrics?: {
    followers: number;
    following: number;
  };
  isOnline?: boolean;
}

/**
 * Fetch a creator by ID
 */
export const getCreatorById = async (creatorId: string) => {
  try {
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', creatorId)
      .maybeSingle();

    if (userProfileError) {
      console.error('Error fetching creator profile:', userProfileError);
      throw userProfileError;
    }

    if (!userProfileData) {
      // Try to fetch from creators table as fallback
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', creatorId)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator data:', creatorError);
        throw creatorError;
      }

      if (!creatorData) {
        return null;
      }

      // Return creator data with metrics
      return {
        id: creatorData.user_id || String(creatorData.id),
        username: creatorData.username || 'creator',
        display_name: creatorData.name || 'Creator',
        avatar_url: creatorData.avatar || null,
        bio: creatorData.bio || 'Pas de biographie disponible',
        metrics: {
          followers: await getFollowersCount(creatorId),
          following: 0
        }
      };
    }

    // Return user profile data with metrics
    return {
      ...userProfileData,
      metrics: {
        followers: await getFollowersCount(creatorId),
        following: await getFollowingCount(creatorId)
      }
    };
  } catch (error) {
    console.error('Error in getCreatorById:', error);
    toast.error('Erreur lors du chargement du profil créateur');
    return null;
  }
};

/**
 * Fetch creator videos
 */
export const getCreatorVideos = async (creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', creatorId)
      .order('uploadedat', { ascending: false });

    if (error) {
      console.error('Error fetching creator videos:', error);
      throw error;
    }

    // For each video, enrich with additional data like stats if available
    const enrichedVideos = await Promise.all(
      data.map(async (video) => {
        try {
          // Try to get video stats
          const { data: statsData } = await supabase
            .from('video_stats')
            .select('*')
            .eq('video_id', video.id)
            .maybeSingle();

          return {
            ...video,
            stats: statsData || {
              views: 0,
              likes: 0,
              comments_count: 0,
              avg_watch_time_seconds: 0
            }
          };
        } catch (err) {
          console.error(`Error fetching stats for video ${video.id}:`, err);
          return video;
        }
      })
    );

    return enrichedVideos;
  } catch (error) {
    console.error('Error in getCreatorVideos:', error);
    toast.error('Erreur lors du chargement des vidéos');
    return [];
  }
};

/**
 * Get followers count for a creator
 */
export const getFollowersCount = async (creatorId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creatorId);

    if (error) {
      console.error('Error fetching followers count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getFollowersCount:', error);
    return 0;
  }
};

/**
 * Get following count for a user
 */
export const getFollowingCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getFollowingCount:', error);
    return 0;
  }
};

/**
 * Follow a creator
 */
export const followCreator = async (userId: string, creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .insert([{ follower_id: userId, creator_id: creatorId }]);

    if (error) {
      console.error('Error following creator:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in followCreator:', error);
    toast.error('Erreur lors de l\'abonnement au créateur');
    return null;
  }
};

/**
 * Unfollow a creator
 */
export const unfollowCreator = async (userId: string, creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', userId)
      .eq('creator_id', creatorId);

    if (error) {
      console.error('Error unfollowing creator:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in unfollowCreator:', error);
    toast.error('Erreur lors du désabonnement au créateur');
    return null;
  }
};

/**
 * Get all creators
 */
export const getAllCreators = async (): Promise<CreatorProfile[]> => {
  try {
    // First try to get from user_profiles
    const { data: userProfileCreators, error: userProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'creator');

    if (userProfileError) {
      console.error('Error fetching creators from user_profiles:', userProfileError);
      
      // Fall back to creators table
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('creators')
        .select('*');
      
      if (creatorsError) {
        console.error('Error fetching creators from creators table:', creatorsError);
        throw creatorsError;
      }
      
      // Ensure all IDs are strings
      return creatorsData.map(creator => ({
        id: (creator.user_id || creator.id).toString(),
        username: creator.username || 'creator',
        display_name: creator.name || 'Creator',
        avatar_url: creator.avatar || null,
        bio: creator.bio || 'Pas de biographie disponible',
      }));
    }

    // Convert any non-string IDs to strings
    return userProfileCreators.map(creator => ({
      ...creator,
      id: creator.id.toString()
    }));
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    toast.error('Erreur lors du chargement des créateurs');
    return [];
  }
};

/**
 * Check if a user follows a creator
 * @param userId The user ID
 * @param creatorId The creator ID
 * @returns Boolean indicating if the user follows the creator
 */
export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', userId)
      .eq('creator_id', creatorId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data; // Convert to boolean (true if data exists, false otherwise)
  } catch (error) {
    console.error('Error in checkUserFollowsCreator:', error);
    return false;
  }
};
