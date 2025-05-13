
import { ref, onValue, off } from 'firebase/database';
import { useState, useEffect } from 'react';
import { realtimeDb } from '@/integrations/firebase/firebase';

const usePresence = (userId: string | undefined) => {
  const [presence, setPresence] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !realtimeDb) {
      setPresence(null);
      return;
    }

    const userStatusRef = ref(realtimeDb, `status/${userId}/state`);

    const updatePresence = (snapshot: any) => {
      const status = snapshot.val();
      setPresence(status || 'offline');
    };

    // Set up the listener
    onValue(userStatusRef, updatePresence);

    // Clean up the listener when the component unmounts or userId changes
    return () => {
      off(userStatusRef);
    };
  }, [userId]);

  return presence;
};

export default usePresence;
