
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { User } from '@supabase/supabase-js'; // Import Supabase User type

console.log("AuthContext: Script loaded"); // Log on script load

// Define the type for the user profile stored in a Supabase 'profiles' table
export type UserProfile = {
  id: string; // Supabase User ID (UUID)
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null; // Corresponds to avatar_url in DB
  bio: string | null;
  role: 'fan' | 'creator';
  createdAt: string; // Corresponds to created_at in DB
  updatedAt?: string; // Corresponds to updated_at in DB
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
        // Defer Supabase calls inside onAuthStateChange
        setTimeout(async () => {
            await fetchOrCreateUserProfile(currentUser);
        }, 0);
      } else {
        console.log("AuthProvider: User is logged out.");
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Initial check for the user session
    const getInitialUser = async () => {
        console.log("AuthProvider: Getting initial user session...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        const initialUser = initialSession?.user || null;
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
    setIsLoading(true); 

    try {
      // Use 'user_profiles' table instead of 'profiles'
      // Assume Supabase client handles camelCase/snake_case for select if 'data as UserProfile' is used.
      const { data, error, status } = await supabase
        .from('user_profiles') 
        .select('id, username, display_name, avatar_url, bio, role, created_at, updated_at')
        .eq('id', supabaseUser.id)
        .single();

      if (error && status !== 406) { 
        console.error("fetchOrCreateUserProfile: Error fetching user profile from Supabase:", error);
        setProfile(null);
      } else if (data) {
        console.log("fetchOrCreateUserProfile: Profile found in Supabase:", data);
        // Map snake_case to camelCase for UserProfile type
        setProfile({
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } else { 
        // Profile not found, it should have been created by the DB trigger 'handle_new_user'.
        // If it's not found, it might indicate an issue with the trigger or a race condition.
        // For robustness, we can still attempt to create it here if the trigger somehow failed or if we want client-side creation as a fallback.
        // However, the primary expectation is that the trigger handles creation.
        // For now, let's log a warning if the profile is not found, assuming the trigger is the source of truth for creation.
        console.warn(`fetchOrCreateUserProfile: Profile NOT found in user_profiles for UID: ${supabaseUser.id}. This might indicate an issue if the DB trigger 'handle_new_user' was expected to create it. The trigger should be inserting into 'user_profiles'.`);
        // Optionally, you could try to create it here as a fallback:
        // const newProfileForDb = {
        //     id: supabaseUser.id,
        //     username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || null,
        //     display_name: supabaseUser.user_metadata?.displayName || supabaseUser.email?.split('@')[0] || null,
        //     avatar_url: supabaseUser.user_metadata?.avatarUrl || null,
        //     bio: null,
        //     role: (supabaseUser.user_metadata?.role as 'fan' | 'creator') || 'fan',
        //     // created_at and updated_at will be set by DB defaults
        // };
        // const { data: newProfileData, error: createError } = await supabase
        //     .from('user_profiles')
        //     .insert([newProfileForDb])
        //     .select('id, username, display_name, avatar_url, bio, role, created_at, updated_at')
        //     .single();
        // if (createError) { /* ... handle error ... */ } else if (newProfileData) { /* ... set profile ... */ }
        setProfile(null); // If not found and not creating as fallback.
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
    
    // Map camelCase updates to snake_case for DB
    const updatesForDb: any = { updated_at: new Date().toISOString() };
    if (updates.username !== undefined) updatesForDb.username = updates.username;
    if (updates.displayName !== undefined) updatesForDb.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) updatesForDb.avatar_url = updates.avatarUrl;
    if (updates.bio !== undefined) updatesForDb.bio = updates.bio;
    if (updates.role !== undefined) updatesForDb.role = updates.role;

    try {
      const { data, error } = await supabase
        .from('user_profiles') // Use 'user_profiles' table
        .update(updatesForDb)
        .eq('id', user.id)
        .select('id, username, display_name, avatar_url, bio, role, created_at, updated_at')
        .single();

      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      } else if (data) {
        console.log("Profile updated successfully:", data);
        // Map snake_case to camelCase for UserProfile type
        setProfile({
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
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
    
    const updatesForDb = { role: 'creator', updated_at: new Date().toISOString() };

    try {
      const { data, error } = await supabase
        .from('user_profiles') // Use 'user_profiles' table
        .update(updatesForDb)
        .eq('id', user.id)
        .select('id, username, display_name, avatar_url, bio, role, created_at, updated_at')
        .single();

      if (error) {
        console.error("Error changing role to creator:", error);
        throw error;
      } else if (data) {
        console.log("Role updated to creator:", data);
         // Map snake_case to camelCase for UserProfile type
        setProfile({
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
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
      }
    } catch (error) {
      console.error("Caught error during sign out:", error);
      throw error; 
    }
  };

  console.log("AuthProvider: Preparing context value. User:", user?.id, "Profile role:", profile?.role, "isLoading:", isLoading);
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
