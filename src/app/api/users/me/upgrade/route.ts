import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { sql } from '@vercel/postgres';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin();

const upgradeUserToCreator = async (req: Request, res: Response) => {
  try {
    // Get the ID token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth(adminApp).verifyIdToken(token);
      const userId = decodedToken.uid;

      // Start a transaction to ensure data consistency
      const client = await sql.connect();
      try {
        await client.query('BEGIN');

        // Check if user exists and get current role
        const userResult = await client.query(
          'SELECT role FROM users WHERE id = $1 FOR UPDATE',
          [userId]
        );

        if (userResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'User not found' });
        }

        const currentRole = userResult.rows[0].role;
        
        // Check if already a creator
        if (currentRole === 'creator') {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'User is already a creator' });
        }

        // Update user role to creator
        await client.query(
          'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2',
          ['creator', userId]
        );

        // Commit the transaction
        await client.query('COMMIT');

        return res.status(200).json({ 
          message: 'Successfully upgraded to creator', 
          role: 'creator' 
        });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in transaction:', error);
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } catch (error) {
    console.error('Error in POST /api/users/me/upgrade:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default upgradeUserToCreator;
