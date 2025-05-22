
export interface User {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  avatarUrl?: string | null;
  username?: string | null;
  isAnonymous: boolean;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  joinDate?: string;
  location?: string;
  tags?: string[];
  isVerified?: boolean;
  metrics?: {
    followers?: number;
    videos?: number;
    likes?: number;
    views?: number;
  };
  revenue?: {
    total?: number;
    tokens?: number;
    percentChange?: number;
  };
  tier?: {
    current: string;
    next: string;
    currentPoints: number;
    nextTierPoints: number;
  };
}
