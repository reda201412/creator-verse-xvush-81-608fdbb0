// Import ainitializeApp from firebase/app
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // Décommentez si vous avez besoin de Firebase Storage pour d'autres fichiers que les vidéos MUX

// TODO: Remplacez ceci par la configuration de VOTRE projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2ALHxTRrLiF8AQFIjx8vDQvfrcnHDpnI",
  authDomain: "xdose-7478c.firebaseapp.com",
  projectId: "xdose-7478c",
  storageBucket: "xdose-7478c.firebasestorage.app", // Peut être utile pour les avatars, miniatures non-MUX, etc.
  messagingSenderId: "226217319866",
  appId: "1:226217319866:web:c05e3ba0ad319e95679183",
  measurementId: "G-MD4S36SM6K" // Optionnel, pour Google Analytics
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // Décommentez si nécessaire

export { app, auth, db /*, storage */ };
