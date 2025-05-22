import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

declare module 'express' {
  interface Request {
    user?: {
      uid: string;
      email?: string;
    };
  }
}

// Middleware to verify Firebase token
export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }

    // Verify token with Firebase Admin
    try {
      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(token);
      req.user = { 
        uid: decodedToken.uid, 
        email: decodedToken.email 
      };
      next();
    } catch (error) {
      console.error('Firebase token verification error:', error);
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export a simpler function for client-side use
export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
};
