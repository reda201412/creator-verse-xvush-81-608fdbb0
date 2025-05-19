import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { prisma } from '@/lib/prisma';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  username?: string;
  is_creator: boolean;
  profile_image_url?: string;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export const signUp = async (email: string, password: string, userData: Partial<UserData>): Promise<UserData> => {
  try {
    // 1. Créer l'utilisateur dans Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Créer l'utilisateur dans la base de données PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        email: email,
        name: userData.name,
        username: userData.username,
        is_creator: userData.is_creator || false,
        profile_image_url: userData.profile_image_url,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
      username: newUser.username || undefined,
      is_creator: newUser.is_creator,
      profile_image_url: newUser.profile_image_url || undefined,
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Connexion d'un utilisateur
 */
export const signIn = async (email: string, password: string): Promise<UserData> => {
  try {
    // 1. Authentifier avec Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Récupérer les données utilisateur depuis PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: firebaseUser.uid },
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      username: user.username || undefined,
      is_creator: user.is_creator,
      profile_image_url: user.profile_image_url || undefined,
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export const getCurrentUser = async (userId: string): Promise<UserData | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      username: user.username || undefined,
      is_creator: user.is_creator,
      profile_image_url: user.profile_image_url || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
