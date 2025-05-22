
import { Request, Response, NextFunction } from 'express';

// Extend the Request type without trying to augment the express module
interface RequestWithUser extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

// Helper function to get auth headers for client-side API calls
export const getAuthHeaders = (): { Authorization?: string } => {
  // For client-side usage
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // For development/testing, allow a mock token
    if (process.env.NODE_ENV !== 'production' && token === 'mock-token') {
      (req as RequestWithUser).user = {
        uid: 'mock-user-id',
        email: 'mock@example.com',
      };
      return next();
    }

    try {
      // Normally we'd verify with Firebase Admin SDK
      // const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      // req.user = {
      //   uid: decodedToken.uid,
      //   email: decodedToken.email,
      // };

      // Mock verification for development
      (req as RequestWithUser).user = {
        uid: 'firebase-user-123',
        email: 'user@example.com',
      };
      
      return next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
