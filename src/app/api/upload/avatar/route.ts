import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

// Initialize Firebase Admin
const adminApp = initializeFirebaseAdmin();

export async function POST(request: Request) {
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

      // Check if the request contains form data
      const formData = await request.formData();
      const file = formData.get('avatar') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size is 5MB.' },
          { status: 400 }
        );
      }

      // Generate a unique filename
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `avatars/${userId}/avatar-${Date.now()}.${fileExtension}`;

      // Upload the file to Vercel Blob Storage
      const blob = await put(filename, file, {
        access: 'public',
      });

      // Get the public URL of the uploaded file
      const fileUrl = blob.url;

      // Update the user's avatar URL in the database
      const result = await sql`
        UPDATE users 
        SET avatar_url = ${fileUrl}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING avatar_url as "avatarUrl"
      `;

      return NextResponse.json({ url: fileUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return NextResponse.json(
        { error: 'Error uploading avatar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/upload/avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
