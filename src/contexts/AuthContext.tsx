import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/firebase/config';

console.log("AuthContext: Script loaded");

// Define the type for the user profile stored in Firestore
export type UserProfile = {
  id: string; // Firebase User ID
  email: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
  createdAt: any; // Firestore timestamp
  updatedAt?: any; // Firestore timestamp
};

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isCreator: boolean;
  signIn: (email: string, password: string) => Promise<{ user: FirebaseUser | null; profile: UserProfile | null; error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ user: FirebaseUser | null; profile: UserProfile | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => Promise<{ error: string | null }>;
  becomeCreator: () => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("AuthProvider: Initializing...");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  // Fetch or create user profile in Firestore
  const fetchOrCreateUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    if (!firebaseUser) return null;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      let userData: Partial<UserProfile> = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || null,
        avatarUrl: firebaseUser.photoURL || null,
        username: null,
        bio: null,
        role: 'fan',
        createdAt: serverTimestamp()
      };
      
      if (userDoc.exists()) {
        // Merge with existing data
        userData = { ...userData, ...userDoc.data() };
      } else {
        // Create new user document
        await setDoc(userRef, userData);
      }
      
      const userProfile = userData as UserProfile;
      setProfile(userProfile);
      setIsCreator(userProfile.role === 'creator');
      return userProfile;
    } catch (error) {
      console.error("Error in fetchOrCreateUserProfile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? `User ${firebaseUser.uid} signed in` : "User signed out");
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log("User is authenticated, fetching profile...");
        await fetchOrCreateUserProfile(firebaseUser);
      } else {
        console.log("No user is authenticated");
        setProfile(null);
        setIsCreator(false);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider: Unsubscribing from auth state listener");
      unsubscribe();
    };
  }, [fetchOrCreateUserProfile]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userProfile = await fetchOrCreateUserProfile(user);
      
      return { 
        user, 
        profile: userProfile, 
        error: null 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error signing in:", errorMessage);
      return { 
        user: null, 
        profile: null, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase auth profile
      await updateFirebaseProfile(user, {
        displayName: username,
        photoURL: null
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user profile
      const userProfile = await fetchOrCreateUserProfile(user);
      
      return { 
        user, 
        profile: userProfile, 
        error: null 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error signing up:", errorMessage);
      return { 
        user: null, 
        profile: null, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out the current user
  const signOut = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error signing out:", errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      console.error("Error resetting password:", errorMessage);
      return { error: errorMessage };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return;
    await fetchOrCreateUserProfile(user);
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => {
    if (!user) {
      return { error: 'No user is currently signed in' };
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updateData);
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      // Update Firebase auth profile if displayName or photoURL changed
      if (updates.displayName || updates.avatarUrl) {
        await updateProfile(user, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.avatarUrl || user.photoURL
        });
      }
      
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      console.error("Error updating profile:", errorMessage);
      return { error: errorMessage };
    }
  };

  // Upgrade user to creator status
  const becomeCreator = async () => {
    if (!user) {
      return { error: 'No user is currently signed in' };
    }

    try {
      const response = await fetch('/api/users/me/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to upgrade to creator status');
      }
      
      const updatedProfile = await response.json();
      
      // Update local state
      setProfile(updatedProfile);
      setIsCreator(true);
      
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update to creator status';
      console.error("Error becoming creator:", errorMessage);
      return { error: errorMessage };
    }
  };

  // Upload avatar to Firebase Storage
  const uploadAvatar = async (file: File) => {
    if (!user) {
      return { url: '', error: 'No user is currently signed in' };
    }

    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user's profile with the new avatar URL
      await updateUserProfile({ avatarUrl: downloadURL });
      
      return { url: downloadURL, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
      console.error("Error uploading avatar:", errorMessage);
      return { url: '', error: errorMessage };
    }
  };

  // Context value
  const value = {
    user,
    profile,
    isLoading,
    isCreator,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
    updateUserProfile,
    becomeCreator,
    uploadAvatar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
