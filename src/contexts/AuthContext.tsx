
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/firebase'; // Importation de la config Firebase

console.log("AuthContext: Script loaded"); // Log au chargement du script

// Définition du type pour le profil utilisateur stocké dans Firestore
export type UserProfile = {
  uid: string; // ID de l'utilisateur Firebase
  email: string | null;
  username: string; // Assurez-vous que le username est défini lors de l'inscription
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
  createdAt: any; // Utiliser serverTimestamp pour la date de création
  updatedAt?: any; // Utiliser serverTimestamp pour la date de mise à jour
};

interface AuthContextType {
  user: User | null; 
  profile: UserProfile | null; 
  isLoading: boolean; 
  isCreator: boolean;
  firebaseSignOut: () => Promise<void>; 
  refreshProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) => Promise<void>;
  becomeCreator: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("AuthProvider: Component rendering/mounting");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: useEffect for onAuthStateChanged running");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AuthProvider: onAuthStateChanged callback triggered. User:", firebaseUser?.uid || 'null');
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log("AuthProvider: User is logged in, fetching profile...");
        await fetchOrCreateUserProfile(firebaseUser);
      } else {
        console.log("AuthProvider: User is logged out.");
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      console.log("AuthProvider: Unsubscribing from onAuthStateChanged");
      unsubscribe();
    }
  }, []);

  const fetchOrCreateUserProfile = async (firebaseUser: User) => {
    if (!firebaseUser) {
      console.log("fetchOrCreateUserProfile: firebaseUser is null, returning.");
      return;
    }
    console.log(`fetchOrCreateUserProfile: Attempting to fetch profile for UID: ${firebaseUser.uid}`);
    setIsLoading(true); // Assurez-vous que isLoading est vrai pendant le fetch
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userProfileData = docSnap.data() as UserProfile;
        console.log("fetchOrCreateUserProfile: Profile found in Firestore:", userProfileData);
        setProfile(userProfileData);
      } else {
        console.warn(`fetchOrCreateUserProfile: Profile NOT found in Firestore for UID: ${firebaseUser.uid}. User might need to complete sign-up or profile creation.`);
        setProfile(null); 
      }
    } catch (error) {
      console.error("fetchOrCreateUserProfile: Error fetching user profile from Firestore:", error);
      setProfile(null);
    } finally {
      console.log("fetchOrCreateUserProfile: Finished fetching profile, setting isLoading to false.");
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log("refreshProfile: Refreshing profile for user:", user.uid);
      await fetchOrCreateUserProfile(user);
    } else {
      console.log("refreshProfile: No user to refresh profile for.");
    }
  };

  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt'>>) => {
    if (!user) throw new Error("Utilisateur non authentifié pour mettre à jour le profil.");
    console.log("updateUserProfile: Updating profile for user:", user.uid, "with updates:", updates);
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
      await refreshProfile(); 
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  };

  const becomeCreator = async () => {
    if (!user || !profile) throw new Error("Utilisateur ou profil non disponible pour devenir créateur.");
    if (profile.role === 'creator') {
        console.log("becomeCreator: User is already a creator.");
        return;
    }
    console.log("becomeCreator: Attempting to make user a creator:", user.uid);
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { role: 'creator', updatedAt: serverTimestamp() });
      await refreshProfile();
    } catch (error) {
      console.error("Erreur lors du passage au rôle créateur:", error);
      throw error;
    }
  };

  const handleFirebaseSignOut = async () => {
    console.log("handleFirebaseSignOut: Attempting to sign out...");
    try {
      await firebaseSignOut(auth);
      console.log("handleFirebaseSignOut: Sign out successful.");
    } catch (error) {
      console.error("Erreur de déconnexion Firebase:", error);
      throw error; 
    }
  };

  console.log("AuthProvider: Preparing context value. User:", user?.uid, "Profile:", profile, "isLoading:", isLoading);
  const value = {
    user,
    profile,
    isLoading,
    isCreator: profile?.role === 'creator',
    firebaseSignOut: handleFirebaseSignOut,
    refreshProfile,
    updateUserProfile,
    becomeCreator
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return context;
};
