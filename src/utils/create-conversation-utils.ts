
import {
  FirestoreMessageThread,
  FirestoreMessage,
} from "@/vite-env";

// Export the function with the correct signature
export const createNewConversationWithCreator = async (
  userId: string,
  creatorId: string,
  initialMessage: string
): Promise<FirestoreMessageThread> => {
  // Mock implementation
  return {
    id: `conversation_${Date.now()}`,
    participantIds: [userId, creatorId],
    participantInfo: {
      [userId]: { displayName: 'User', photoURL: null },
      [creatorId]: { displayName: 'Creator', photoURL: null },
    },
    lastActivity: new Date(),
    createdAt: new Date(),
    isGated: false,
  };
};
