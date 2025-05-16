import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/auth'; // Import our extended User type

console.log("AuthContext: Script loaded"); // Log on script load

// Type pour le profil utilisateur
export type UserProfile = {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: 'fan' | 'creator';
  createdAt: string;
  updatedAt: string;
};

// Interface du contexte d'authentification
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isCreator: boolean;
  signUp: (email: string, password: string, username: string, userRole: 'fan' | 'creator') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => Promise<void>;
  becomeCreator: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // S'inscrire (création de compte)
  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    userRole: 'fan' | 'creator'
  ): Promise<{ error: Error | null }> => {
    try {
      console.log("Starting signup process for:", email, "with role:", userRole);
      
      // 1. Inscrire l'utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      console.log("User created successfully:", newUser.uid);
      
      // 2. Mettre à jour le profil Firebase Auth
      await updateProfile(newUser, {
        displayName: username
      });
      console.log("Profile updated in Firebase Auth");
      
      try {
        // 3. Vérifier si le nom d'utilisateur est déjà pris
        // Dans un bloc try séparé pour isoler les erreurs Firestore
        console.log("Checking if username exists:", username);
        const usersRef = doc(db, 'usernames', username);
        const usernameDoc = await getDoc(usersRef);
        
        if (usernameDoc.exists()) {
          console.log("Username already exists, deleting auth user...");
          // Si le nom d'utilisateur existe déjà, supprimer l'utilisateur créé
          // Note: Firebase auth n'a pas de méthode directe pour supprimer un utilisateur côté client
          // L'utilisateur devra se déconnecter et utiliser un autre nom d'utilisateur
          await firebaseSignOut(auth);
          return { error: new Error("Ce nom d'utilisateur est déjà utilisé.") };
        }
        
        // 4. Créer le document de profil dans Firestore
        console.log("Creating user profile in Firestore with role:", userRole);
        const now = new Date().toISOString();
        const userProfile: UserProfile = {
          id: newUser.uid,
          username,
          displayName: username,
          avatarUrl: null,
          bio: null,
          role: userRole,
          createdAt: now,
          updatedAt: now
        };
        
        await setDoc(doc(db, 'user_profiles', newUser.uid), userProfile);
        console.log("User profile created successfully with role:", userRole);
        
        // 5. Réserver le nom d'utilisateur
        console.log("Reserving username:", username);
        await setDoc(doc(db, 'usernames', username), {
          uid: newUser.uid
        });
        console.log("Username reserved successfully");
        
      } catch (firestoreError) {
        console.error("Firestore error during signup:", firestoreError);
        // En cas d'erreur Firestore, nous gardons quand même l'utilisateur authentifié
        // Le profil sera créé lors de la première connexion
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Error in signUp:", error);
      return { error: error as Error };
    }
  };
  
  // Se connecter
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      console.log("Attempting sign in for:", email);
      
      // Essayer de se connecter avec un délai de 10 secondes maximum
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout d'authentification: vérifiez votre connexion internet")), 10000);
      });
      
      // Procéder à la connexion avec timeout
      const authPromise = signInWithEmailAndPassword(auth, email, password);
      await Promise.race([authPromise, timeoutPromise]);
      
      console.log("Sign in successful");
      return { error: null };
    } catch (error) {
      console.error("Error in signIn:", error);
      
      // Améliorer les messages d'erreur
      const firebaseError = error as { code?: string, message: string };
      if (firebaseError.code === 'auth/network-request-failed') {
        return { 
          error: new Error("Problème de connexion internet. Vérifiez votre connexion et réessayez.") 
        };
      }
      
      if (firebaseError.code === 'auth/too-many-requests') {
        return { 
          error: new Error("Trop de tentatives de connexion. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.") 
        };
      }
      
      if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/user-not-found') {
        return { 
          error: new Error("Email ou mot de passe incorrect.") 
        };
      }
      
      return { error: error as Error };
    }
  };

  // Récupérer le profil d'un utilisateur
  const fetchUserProfile = async (firebaseUser: FirebaseUser): Promise<void> => {
    if (!firebaseUser) return;
    
    try {
      console.log("Fetching user profile for:", firebaseUser.uid);
      // Récupérer le document de profil dans Firestore
      const profileDoc = await getDoc(doc(db, 'user_profiles', firebaseUser.uid));
      
      if (profileDoc.exists()) {
        // Profil trouvé
        const profileData = profileDoc.data();
        console.log("User profile found");
        setProfile({
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.displayName,
          avatarUrl: profileData.avatarUrl,
          bio: profileData.bio,
          role: profileData.role as 'fan' | 'creator',
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        });
      } else {
        // Profil non trouvé, le créer si on a des informations
        console.log("User profile not found, creating profile");
        const username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.substring(0, 8)}`;
        const now = new Date().toISOString();
        
        // Vérifier si le nom d'utilisateur est déjà pris
        const usernameDoc = await getDoc(doc(db, 'usernames', username));
        
        const finalUsername = usernameDoc.exists() 
          ? `${username}_${Date.now().toString().substring(-5)}`
          : username;
          
        // Créer le profil
        const newProfile: UserProfile = {
          id: firebaseUser.uid,
          username: finalUsername,
          displayName: firebaseUser.displayName || finalUsername,
          avatarUrl: firebaseUser.photoURL,
          bio: null,
          role: 'fan',
          createdAt: now,
          updatedAt: now
        };
        
        await setDoc(doc(db, 'user_profiles', firebaseUser.uid), newProfile);
        console.log("User profile created");
        
        // Réserver le nom d'utilisateur
        await setDoc(doc(db, 'usernames', finalUsername), {
          uid: firebaseUser.uid
        });
        console.log("Username reserved");
        
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  // Rafraîchir le profil
  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  // Mettre à jour le profil utilisateur
  const updateUserProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    
    // Préparer les mises à jour
    const profileUpdates: any = { 
      updatedAt: new Date().toISOString() 
    };
    
    if (updates.username !== undefined) profileUpdates.username = updates.username;
    if (updates.displayName !== undefined) profileUpdates.displayName = updates.displayName;
    if (updates.avatarUrl !== undefined) profileUpdates.avatarUrl = updates.avatarUrl;
    if (updates.bio !== undefined) profileUpdates.bio = updates.bio;
    if (updates.role !== undefined) profileUpdates.role = updates.role;

    try {
      // Si le nom d'utilisateur change, mettre à jour la réservation
      if (updates.username && profile?.username !== updates.username) {
        // Vérifier si le nouveau nom d'utilisateur est disponible
        const usernameDoc = await getDoc(doc(db, 'usernames', updates.username));
        
        if (usernameDoc.exists()) {
          throw new Error("Ce nom d'utilisateur est déjà utilisé.");
        }
        
        // Supprimer l'ancienne réservation
        if (profile?.username) {
          // Vérifier d'abord qu'il s'agit bien de notre réservation
          const oldUsernameDoc = await getDoc(doc(db, 'usernames', profile.username));
          if (oldUsernameDoc.exists() && oldUsernameDoc.data().uid === user.uid) {
            // Supprimer seulement si c'est notre réservation
            await setDoc(doc(db, 'usernames', profile.username), {});
          }
        }
        
        // Créer la nouvelle réservation
        await setDoc(doc(db, 'usernames', updates.username), {
          uid: user.uid
        });
      }
      
      // Mettre à jour le profil dans Firestore
      await updateDoc(doc(db, 'user_profiles', user.uid), profileUpdates);
      
      // Mettre à jour le state local
      if (profile) {
        setProfile({
          ...profile,
          ...updates,
          updatedAt: profileUpdates.updatedAt
        });
      }
      
      // Si le nom d'affichage change, mettre à jour le profil Firebase Auth
      if (updates.displayName) {
        await updateProfile(user, {
          displayName: updates.displayName
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Devenir créateur
  const becomeCreator = async (): Promise<void> => {
    if (!user || !profile) throw new Error("User not authenticated");
    if (profile.role === 'creator') return;
    
    await updateUserProfile({ role: 'creator' });
  };

  // Se déconnecter avec gestion améliorée
  const handleSignOut = async (): Promise<{ error: Error | null }> => {
    console.log("Attempting to sign out");
    
    try {
      setIsLoading(true);
      
      // Nettoyer les données en mémoire avant la déconnexion effective
      setProfile(null);
      
      // Imposer un délai maximum pour la déconnexion
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout de déconnexion")), 5000);
      });
      
      // Procéder à la déconnexion avec timeout
      const signOutPromise = firebaseSignOut(auth);
      
      await Promise.race([signOutPromise, timeoutPromise])
        .catch(error => {
          console.error("Error during sign out:", error);
          // En cas d'erreur, forcer la déconnexion localement
          setUser(null);
          window.location.reload(); // Rafraîchir la page pour réinitialiser l'état
        });
      
      console.log("Sign out successful");
      return { error: null };
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      // Même en cas d'erreur, on force la déconnexion côté client
      setUser(null);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    console.log("Setting up auth state listener");
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.uid}` : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    }, error => {
      console.error("Auth state change error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Valeur du contexte
  const value = {
    user,
    profile,
    isLoading,
    isCreator: profile?.role === 'creator',
    signUp,
    signIn,
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
