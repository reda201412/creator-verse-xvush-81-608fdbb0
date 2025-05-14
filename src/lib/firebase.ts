// Import Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADhb8pRzJlpHu708EZYAnCnJGzKerdZ_8",
  authDomain: "xdose-4f508.firebaseapp.com",
  projectId: "xdose-4f508",
  storageBucket: "xdose-4f508.appspot.com",
  messagingSenderId: "281334715737",
  appId: "1:281334715737:web:d3abf66b3594a8f827a848",
  measurementId: "G-W84D72MQPB"
};

// Initialiser Firebase avec configuration personnalisée
const app = initializeApp(firebaseConfig);

// Initialiser Firestore avec des paramètres personnalisés
const firestoreSettings = {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: true, // Meilleure stabilité sur certains réseaux
};

// Services Firebase avec configuration améliorée
export const auth = getAuth(app);
export const db = initializeFirestore(app, firestoreSettings);
export const storage = getStorage(app);

// Configurer la persistance d'authentification locale
// pour éviter les problèmes de déconnexion sur instabilité réseau
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Firebase auth persistence set to local");
  } catch (error) {
    console.error("Failed to set auth persistence:", error);
  }
})();

// Analytics (seulement dans l'environnement navigateur)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Analytics initialization failed:", error);
  }
}
export { analytics };

// Connecter aux émulateurs en mode développement
if (import.meta.env.DEV) {
  try {
    console.log("🔥 Using Firebase emulators in development");
    // Décommentez ces lignes si vous utilisez les émulateurs Firebase localement
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.error("❌ Firebase emulator connection error:", error);
  }
}

// Exporter la configuration pour le débogage
export const firebaseEnv = {
  config: firebaseConfig,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
};

export default app; 