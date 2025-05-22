
import { Request, Response, NextFunction } from 'express';

// Define our own interface extending Request rather than augmenting Express
interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
}

// Helper function to get auth headers for API requests
export const getAuthHeaders = () => {
  // This is a mock implementation
  return {
    'Authorization': 'Bearer mock-token'
  };
};

// Firebase admin verification middleware
export const verifyFirebaseToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Example token verification logic
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // In production, verify the token with Firebase Admin SDK
    // For development, we'll use a mock verification
    if (token === 'mock-token' || token === 'development-token') {
      req.user = {
        uid: 'mock-user-id',
        email: 'mock@example.com'
      };
      return next();
    }
    
    // Mock token verification failure
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
