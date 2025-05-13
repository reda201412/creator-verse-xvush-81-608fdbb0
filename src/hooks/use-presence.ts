
import { ref, onValue, off, Database } from 'firebase/database';
import { doc, onSnapshot, Firestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';

// Accept either Database or Firestore
const usePresence = (userId: string | undefined, db?: Database | Firestore | null) => {
  const [presence, setPresence] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !db) {
      setPresence(null);
      return;
    }

    let cleanup: () => void;

    // Check if db is a Realtime Database or Firestore
    if ('type' in db && (db.type === 'firestore' || db.type === 'firestore-lite')) {
      // It's a Firestore database
      const userStatusRef = doc(db as Firestore, `status/${userId}`);
      
      const unsubscribe = onSnapshot(userStatusRef, (snapshot) => {
        if (snapshot.exists()) {
          setPresence(snapshot.data().state || 'offline');
        } else {
          setPresence('offline');
        }
      });
      
      cleanup = unsubscribe;
    } else {
      // It's a Realtime Database
      const userStatusRef = ref(db as Database, `status/${userId}/state`);
      
      const updatePresence = (snapshot: any) => {
        const status = snapshot.val();
        setPresence(status || 'offline');
      };
      
      onValue(userStatusRef, updatePresence);
      cleanup = () => off(userStatusRef);
    }

    return cleanup;
  }, [userId, db]);

  return presence;
};

export default usePresence;
