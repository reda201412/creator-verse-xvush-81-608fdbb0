
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/auth';

// Define the shape of the auth context
export interface AuthContextProps {
  user: { uid: string; id: string; email: string } | null;
  profile: UserProfile | null;
  isCreator: boolean;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>; 
  firebaseSignOut: () => Promise<void>; 
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>; 
  becomeCreator: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  isCreator: false,
  isLoading: true,
  error: null,
  signOut: async () => {}, 
  firebaseSignOut: async () => {},
  updateProfile: async () => {},
  becomeCreator: async () => {},
  login: async () => {}
});

// Export the custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isCreator = profile?.role === 'creator';

  // Mock implementation for sign out
  const signOut = async (): Promise<void> => {
    // Implementation would go here
    console.log('User signed out');
    setUser(null);
    setProfile(null);
    localStorage.removeItem('userId');
  };

  // Alias for firebaseSignOut
  const firebaseSignOut = async (): Promise<void> => {
    return signOut();
  };

  // Mock implementation for login
  const login = async (email: string, password: string): Promise<void> => {
    // Implementation would go here
    console.log('User logged in', email);
    const userId = 'user123';
    setUser({ uid: userId, id: userId, email });
    setProfile({
      id: userId,
      uid: userId,
      username: 'testuser',
      displayName: 'Test User',
      role: 'fan'
    });
    localStorage.setItem('userId', userId);
  };

  // Mock implementation for update profile
  const updateProfile = async (updatedProfile: Partial<UserProfile>): Promise<void> => {
    // Implementation would go here
    console.log('Profile updated', updatedProfile);
    setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
  };

  // Mock implementation for become creator
  const becomeCreator = async (): Promise<void> => {
    // Implementation would go here
    console.log('User became a creator');
    setProfile(prev => prev ? { ...prev, role: 'creator' } : null);
  };

  // Effect to simulate loading the user on mount
  useEffect(() => {
    // Simulate fetching the user
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      setTimeout(() => {
        setUser({ uid: userId, id: userId, email: 'user@example.com' });
        setProfile({
          id: userId,
          uid: userId,
          username: 'testuser',
          displayName: 'Test User',
          role: 'fan'
        });
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Value object that will be passed to consuming components
  const value = {
    user,
    profile,
    isCreator,
    isLoading,
    error,
    signOut,
    firebaseSignOut,
    updateProfile,
    becomeCreator,
    login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
