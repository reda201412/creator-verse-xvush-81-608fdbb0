import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { User } from '@supabase/supabase-js'; // Import Supabase User type

console.log("AuthContext: Script loaded"); // Log on script load

// Define the type for the user profile stored in a Supabase 'profiles' table
export type UserProfile = {
  id: string; // Supabase User ID (UUID)
  username: string | null; // Assuming username is nullable in Supabase profile table
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
  createdAt: string; // Supabase timestamp is string
  updatedAt?: string; // Supabase timestamp is string
};

interface AuthContextType {
  user: User | null; 
  profile: UserProfile | null; 
  isLoading: boolean; 
  isCreator: boolean;
  signOut: () => Promise<void>; 
  refreshProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => Promise<void>;
  becomeCreator: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("AuthProvider: Component rendering/mounting");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: useEffect for onAuthStateChange running");
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: onAuthStateChange callback triggered. Event:", event, "Session:", session);
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        console.log("AuthProvider: User is logged in, fetching/creating profile...");
        await fetchOrCreateUserProfile(currentUser);
      } else {
        console.log("AuthProvider: User is logged out.");
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Initial check for the user session
    const getInitialUser = async () => {
        console.log("AuthProvider: Getting initial user session...");
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        setUser(initialUser);
        if (initialUser) {
            console.log("AuthProvider: Initial user found, fetching/creating profile...");
            await fetchOrCreateUserProfile(initialUser);
        } else {
            console.log("AuthProvider: No initial user found.");
            setIsLoading(false);
        }
    };

    getInitialUser();

    return () => {
      console.log("AuthProvider: Unsubscribing from onAuthStateChange");
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const fetchOrCreateUserProfile = async (supabaseUser: User) => {
    if (!supabaseUser) {
      console.log("fetchOrCreateUserProfile: supabaseUser is null, returning.");
      setIsLoading(false);
      return;
    }
    console.log(`fetchOrCreateUserProfile: Attempting to fetch profile for UID: ${supabaseUser.id}`);
    setIsLoading(true); // Ensure isLoading is true during fetch
    
    try {
      const { data, error, status } = await supabase
        .from('profiles') // Assuming a 'profiles' table in Supabase
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && status !== 406) { // 406 means no row found with single()
        console.error("fetchOrCreateUserProfile: Error fetching user profile from Supabase:", error);
        setProfile(null);
      } else if (data) {
        console.log("fetchOrCreateUserProfile: Profile found in Supabase:", data);
        setProfile(data as UserProfile);
      } else { // Profile not found, create it
        console.warn(`fetchOrCreateUserProfile: Profile NOT found in Supabase for UID: ${supabaseUser.id}. Creating a new profile.`);
        const newProfile: Omit<UserProfile, 'updatedAt'> = {
            id: supabaseUser.id,
            username: supabaseUser.user_metadata.username || null, // Assuming username might be in metadata
            displayName: supabaseUser.user_metadata.displayName || supabaseUser.email?.split('@')[0] || null, // Or from email
            avatarUrl: supabaseUser.user_metadata.avatarUrl || null, // Assuming avatarUrl might be in metadata
            bio: null,
            role: 'fan', // Default role
            createdAt: new Date().toISOString(),
        };

        const { data: newProfileData, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

        if (createError) {
            console.error("fetchOrCreateUserProfile: Error creating new user profile in Supabase:", createError);
            setProfile(null);
        } else if (newProfileData) {
             console.log("fetchOrCreateUserProfile: New profile created:", newProfileData);
            setProfile(newProfileData as UserProfile);
        } else {
             console.error("fetchOrCreateUserProfile: Profile creation returned no data.");
             setProfile(null);
        }
      }
    } catch (error) {
      console.error("fetchOrCreateUserProfile: Unexpected error:", error);
      setProfile(null);
    } finally {
      console.log("fetchOrCreateUserProfile: Finished fetching/creating profile, setting isLoading to false.");
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log("refreshProfile: Refreshing profile for user:", user.id);
      await fetchOrCreateUserProfile(user);
    } else {
      console.log("refreshProfile: No user to refresh profile for.");
    }
  };

  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error("User not authenticated to update profile.");
    console.log("updateUserProfile: Updating profile for user:", user.id, "with updates:", updates);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('id', user.id) // Update the profile linked to the Supabase user ID
        .select()
        .single();

      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      } else if (data) {
        console.log("Profile updated successfully:", data);
        setProfile(data as UserProfile); // Update context with the new profile data
      } else {
           console.warn("updateUserProfile: Update successful but no data returned.");
      }
    } catch (error) {
      console.error("Caught error during profile update:", error);
      throw error; 
    }
  };

  const becomeCreator = async () => {
    if (!user || !profile) throw new Error("User or profile not available to become creator.");
    if (profile.role === 'creator') {
        console.log("becomeCreator: User is already a creator.");
        return;
    }
    console.log("becomeCreator: Attempting to make user a creator:", user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'creator', updatedAt: new Date().toISOString() })
        .eq('id', user.id) // Update the profile linked to the Supabase user ID
        .select()
        .single();

      if (error) {
        console.error("Error changing role to creator:", error);
        throw error;
      } else if (data) {
        console.log("Role updated to creator:", data);
        setProfile(data as UserProfile); // Update context with the new profile data
      } else {
           console.warn("becomeCreator: Role update successful but no data returned.");
      }

    } catch (error) {
      console.error("Caught error during becomeCreator:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    console.log("handleSignOut: Attempting to sign out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign out error:", error);
        throw error;
      } else {
         console.log("handleSignOut: Sign out successful.");
         // onAuthStateChange listener will handle setting user and profile to null
      }
    } catch (error) {
      console.error("Caught error during sign out:", error);
      throw error; 
    }
  };

  console.log("AuthProvider: Preparing context value. User:", user?.id, "Profile:", profile, "isLoading:", isLoading);
  const value = {
    user,
    profile,
    isLoading,
    isCreator: profile?.role === 'creator',
    signOut: handleSignOut,
    refreshProfile,
    updateUserProfile,
    becomeCreator
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
