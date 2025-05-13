
// Define the expected shape based on error messages
export interface CreatorProfileData {
  id?: string;
  user_id?: string;
  username?: string;
  name?: string;
  avatar?: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
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
}

export function adaptCreatorProfile(profile: CreatorProfileData): StandardizedCreatorProfile {
  return {
    id: profile.id || profile.user_id || '',
    uid: profile.user_id || profile.id || '',
    username: profile.username || '',
    displayName: profile.display_name || profile.name || profile.username || '',
    name: profile.name || profile.display_name || '',
    avatarUrl: profile.avatar_url || profile.avatar || '',
    bio: profile.bio || '',
    isPremium: false,
    followersCount: 0
  };
}
