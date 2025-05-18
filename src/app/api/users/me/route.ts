import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { db } from '@/lib/neon';
import { sql } from '@vercel/postgres';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin();

// GET /api/users/me - Get current user profile
export async function GET(request: Request) {
  try {
    // Get the ID token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth(adminApp).verifyIdToken(token);
      const userId = decodedToken.uid;

      // Query the database for the user
      const result = await sql`
        SELECT id, email, username, display_name as "displayName", 
               avatar_url as "avatarUrl", bio, role, created_at as "createdAt",
               updated_at as "updatedAt"
        FROM users
        WHERE id = ${userId}
      `;

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/me - Update user profile
export async function PATCH(request: Request) {
  try {
    // Get the ID token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const updates = await request.json();
    
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth(adminApp).verifyIdToken(token);
      const userId = decodedToken.uid;

      // Build the update query dynamically based on provided fields
      const fields = [];
      const values = [];
      let paramIndex = 1;

      // Only allow certain fields to be updated
      const allowedFields = ['username', 'displayName', 'avatarUrl', 'bio'];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }

      if (fields.length === 0) {
        return NextResponse.json(
          { error: 'No valid fields to update' },
          { status: 400 }
        );
      }

      // Add updated_at timestamp
      fields.push(`updated_at = NOW()`);
      
      // Add user ID for WHERE clause
      values.push(userId);

      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, email, username, display_name as "displayName", 
                 avatar_url as "avatarUrl", bio, role, created_at as "createdAt",
                 updated_at as "updatedAt"
      `;

      const result = await sql.query(query, values);

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Error updating profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PATCH /api/users/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await request.json();
    
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth(adminApp).verifyIdToken(token);
      
      // Check if the user ID matches the one in the token
      if (decodedToken.uid !== userData.id) {
        return NextResponse.json(
          { error: 'Unauthorized - User ID mismatch' },
          { status: 403 }
        );
      }

      // Insert the new user into the database
      const result = await sql`
        INSERT INTO users (id, email, username, display_name, avatar_url, role)
        VALUES (${userData.id}, ${userData.email}, ${userData.username || null}, 
                ${userData.displayName || null}, ${userData.avatarUrl || null}, 
                ${userData.role || 'fan'}::user_role)
        RETURNING id, email, username, display_name as "displayName", 
                 avatar_url as "avatarUrl", bio, role, created_at as "createdAt",
                 updated_at as "updatedAt"
      `;

      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
      // Handle unique constraint violation (duplicate user)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
