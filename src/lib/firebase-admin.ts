import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin SDK configuration
const firebaseAdminConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n'),
};

let adminApp: App | null = null;

/**
 * Initializes the Firebase Admin SDK
 * @returns Initialized Firebase Admin app instance
 */
export function initializeFirebaseAdmin(): App {
  if (!adminApp) {
    // Check if Firebase Admin is already initialized
    const [existingApp] = getApps();
    
    if (existingApp) {
      adminApp = existingApp;
    } else {
      // Initialize Firebase Admin
      adminApp = initializeApp({
        credential: cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        }),
      });
    }
  }
  
  return adminApp;
}

/**
 * Gets the Firebase Admin Auth instance
 * @returns Firebase Admin Auth instance
 */
export function getFirebaseAdminAuth() {
  const app = initializeFirebaseAdmin();
  return getAuth(app);
}

export default initializeFirebaseAdmin;
