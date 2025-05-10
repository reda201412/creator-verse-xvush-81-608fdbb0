
import { supabase } from '@/integrations/supabase/client';

export interface CreatorProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  metrics?: {
    followers?: number;
    following?: number;
    videos?: number;
    revenue?: number;
  };
  isOnline?: boolean;
}

export const getCreatorById = async (id: string): Promise<CreatorProfile | null> => {
  try {
    // Récupérer le profil du créateur depuis la table user_profiles
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'creator')
      .maybeSingle();
    
    if (userError || !userData) {
      console.error('Error fetching creator profile:', userError);
      return null;
    }

    // Compter les abonnés du créateur
    const { count: followersCount, error: followersError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', id);

    // Compter les personnes suivies par le créateur
    const { count: followingCount, error: followingError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    // Compter les vidéos du créateur
    const { count: videosCount, error: videosError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    // Construire le profil complet
    const creatorProfile: CreatorProfile = {
      id: userData.id,
      username: userData.username,
      display_name: userData.display_name,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      metrics: {
        followers: followersCount || 0,
        following: followingCount || 0,
        videos: videosCount || 0,
      },
      isOnline: Math.random() > 0.5, // Simuler le statut en ligne pour le moment
    };

    return creatorProfile;
  } catch (error) {
    console.error('Error in getCreatorById:', error);
    return null;
  }
};

export const getAllCreators = async (): Promise<CreatorProfile[]> => {
  try {
    // Récupérer tous les profils de créateurs
    const { data: creatorsData, error: creatorsError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'creator');
    
    if (creatorsError || !creatorsData) {
      console.error('Error fetching creators:', creatorsError);
      return [];
    }

    // Transformer les données en profils de créateurs
    return creatorsData.map(creator => ({
      id: creator.id,
      username: creator.username,
      display_name: creator.display_name,
      avatar_url: creator.avatar_url,
      bio: creator.bio,
      isOnline: Math.random() > 0.5, // Simuler le statut en ligne pour le moment
    }));
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    return [];
  }
};

// Obtenir les vidéos d'un créateur
export const getCreatorVideos = async (creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', creatorId)
      .order('uploadedat', { ascending: false });
    
    if (error) {
      console.error('Error fetching creator videos:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getCreatorVideos:', error);
    return [];
  }
};

// Service pour vérifier si l'utilisateur suit un créateur
export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId)
      .eq('creator_id', creatorId);
    
    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserFollowsCreator:', error);
    return false;
  }
};

// Service pour suivre un créateur
export const followCreator = async (userId: string, creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .insert([
        { follower_id: userId, creator_id: creatorId }
      ]);
    
    if (error) {
      console.error('Error following creator:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in followCreator:', error);
    return false;
  }
};

// Service pour ne plus suivre un créateur
export const unfollowCreator = async (userId: string, creatorId: string) => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', userId)
      .eq('creator_id', creatorId);
    
    if (error) {
      console.error('Error unfollowing creator:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowCreator:', error);
    return false;
  }
};
