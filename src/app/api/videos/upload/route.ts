import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { createDirectUpload, getAsset } from '@/lib/mux-utils';

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
      await getAuth(adminApp).verifyIdToken(token);
      
      // Create a direct upload URL for Mux
      const upload = await createDirectUpload();
      
      return NextResponse.json({
        id: upload.id,
        url: upload.url,
        assetId: upload.assetId,
        status: upload.status,
        timeout: upload.timeout,
        asset: upload.asset
      });
    } catch (error) {
      console.error('Error verifying token or creating upload:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/videos/upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    
    if (!assetId) {
      return NextResponse.json(
        { error: 'Missing assetId parameter' },
        { status: 400 }
      );
    }
    
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
      await getAuth(adminApp).verifyIdToken(token);
      
      // Get the asset details from Mux
      const asset = await getAsset(assetId);
      
      return NextResponse.json(asset);
    } catch (error) {
      console.error('Error verifying token or fetching asset:', error);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token or asset not found' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/videos/upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
