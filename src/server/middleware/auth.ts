
import { Request, Response, NextFunction } from 'express';
import { auth } from '@/integrations/firebase/firebase';

// Extend Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
      };
    }
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

    // In production, use Firebase Admin to verify the token
    // For development, we'll just mock it
    if (process.env.NODE_ENV === 'production') {
      try {
        // This requires firebase-admin to be set up correctly
        // const decodedToken = await auth.verifyIdToken(token);
        // req.user = { uid: decodedToken.uid, email: decodedToken.email };
        
        // Temporary mock for development until firebase-admin is set up
        req.user = { uid: 'mock-user-id', email: 'mock@example.com' };
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    } else {
      // For development, accept any token and use a mock user
      req.user = { uid: 'mock-user-id', email: 'mock@example.com' };
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export a simpler function for client-side use
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
