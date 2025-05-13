
// Define the expected shape based on error messages
export interface CreatorProfileData {
  id?: string;
  uid?: string;
  user_id?: string;
  username?: string;
  name?: string;
  displayName?: string;
  avatar?: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  isPremium?: boolean;
  followersCount?: number;
  isOnline?: boolean;
  avatarUrl?: string;
}

export interface StandardizedCreatorProfile {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  name: string;
  avatarUrl: string;
  bio: string;
  isPremium?: boolean;
  followersCount?: number;
  isOnline?: boolean;
}

export function adaptCreatorProfile(profile: CreatorProfileData): StandardizedCreatorProfile {
  return {
    id: profile.id || profile.uid || profile.user_id || '',
    uid: profile.uid || profile.id || profile.user_id || '',
    username: profile.username || '',
    displayName: profile.display_name || profile.displayName || profile.name || profile.username || '',
    name: profile.name || profile.display_name || profile.displayName || '',
    avatarUrl: profile.avatar_url || profile.avatar || profile.avatarUrl || '',
    bio: profile.bio || '',
    isPremium: profile.isPremium || false,
    followersCount: profile.followersCount || 0,
    isOnline: profile.isOnline || false
  };
}
