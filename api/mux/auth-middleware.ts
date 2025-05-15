import { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import OSS from 'ali-oss';

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
        res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
        return;
      }
      
      const token = authHeader.split('Bearer ')[1];
      
      try {
        // Vérifier et décoder le token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Attacher l'utilisateur à la requête
        req.user = decodedToken;
        
        // Passer au gestionnaire suivant
        await handler(req, res);
        return;
      } catch (firebaseError) {
        console.error('Firebase auth error:', firebaseError);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
      }
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
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
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const isUserCreator = await isCreator(req.user.uid);
      
      if (!isUserCreator) {
        res.status(403).json({ error: 'Forbidden: Creator access required' });
        return;
      }
      
      await handler(req, res);
      return;
    } catch (error) {
      console.error('Creator auth middleware error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  });
};

const client = new OSS({
  region: process.env.ALIBABA_OSS_REGION!,
  accessKeyId: process.env.ALIBABA_OSS_KEY_ID!,
  accessKeySecret: process.env.ALIBABA_OSS_KEY_SECRET!,
  bucket: process.env.ALIBABA_OSS_BUCKET!
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { filename, data } = req.body; // data = base64
  if (!filename || !data) {
    res.status(400).json({ error: 'Missing filename or data' });
    return;
  }

  const buffer = Buffer.from(data, 'base64');

  try {
    const result = await client.put(`thumbnails/${filename}`, buffer);
    res.status(200).json({ url: result.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 