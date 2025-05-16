import { initializeApp, cert, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

import { getAuth } from 'firebase-admin/auth';

export async function verifyFirebaseToken(token: string) {
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return decoded; // contient l'uid, email, etc.
  } catch (err) {
    return null;
  }
} 