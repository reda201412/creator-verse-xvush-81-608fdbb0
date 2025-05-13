
// Create this file if it doesn't exist
export interface UserProfile {
  id?: string;
  uid?: string;
  username?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  avatarUrl?: string;
  bio?: string;
  role?: 'creator' | 'fan' | 'admin';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
