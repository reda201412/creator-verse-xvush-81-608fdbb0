
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
  };

  // Alias for firebaseSignOut
  const firebaseSignOut = signOut;

  // Mock implementation for login
  const login = async (email: string, password: string): Promise<void> => {
    // Implementation would go here
    console.log('User logged in', email);
    setUser({ uid: 'user123', id: 'user123', email });
    setProfile({
      id: 'user123',
      uid: 'user123',
      username: 'testuser',
      displayName: 'Test User',
      role: 'fan'
    });
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
    setTimeout(() => {
      setUser({ uid: 'user123', id: 'user123', email: 'user@example.com' });
      setProfile({
        id: 'user123',
        uid: 'user123',
        username: 'testuser',
        displayName: 'Test User',
        role: 'fan'
      });
      setIsLoading(false);
    }, 1000);
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
