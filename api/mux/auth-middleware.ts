import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

interface AuthenticatedRequest extends VercelRequest {
  user?: DecodedIdToken;
}

/**
 * Middleware pour authentifier les requêtes utilisateur via Firebase
 */
export const withAuth = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    try {
      // Récupérer le token d'authentification depuis l'en-tête
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
      }
      
      const token = authHeader.split('Bearer ')[1];
      
      try {
        // Vérifier et décoder le token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Attacher l'utilisateur à la requête
        req.user = decodedToken;
        
        // Passer au gestionnaire suivant
        return handler(req, res);
      } catch (firebaseError) {
        console.error('Firebase auth error:', firebaseError);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

/**
 * Vérifier si l'utilisateur est un créateur
 */
export const isCreator = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await admin.firestore().collection('user_profiles').doc(userId).get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    const userData = userDoc.data();
    return userData?.role === 'creator';
  } catch (error) {
    console.error('Error checking creator status:', error);
    return false;
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est un créateur
 */
export const withCreatorAuth = (handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void>) => {
  return withAuth(async (req: AuthenticatedRequest, res: VercelResponse) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const isUserCreator = await isCreator(req.user.uid);
      
      if (!isUserCreator) {
        return res.status(403).json({ error: 'Forbidden: Creator access required' });
      }
      
      return handler(req, res);
    } catch (error) {
      console.error('Creator auth middleware error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}; 