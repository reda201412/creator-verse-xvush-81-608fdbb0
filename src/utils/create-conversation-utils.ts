
// Export the types for use in other modules
export interface FirestoreMessage {
  id: string;
  senderId: string;
  content: string | any;
  type: string;
  createdAt: any; // Firebase Timestamp
  isEncrypted?: boolean;
  monetization?: any;
  status?: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface FirestoreMessageThread {
  id: string;
  participantIds: string[];
  participantInfo: Record<string, any>;
  lastActivity: any; // Firebase Timestamp
  createdAt: any; // Firebase Timestamp
  isGated: boolean;
  messages?: FirestoreMessage[];
  readStatus?: Record<string, any>;
  lastMessageText?: string;
  lastMessageCreatedAt?: any;
  lastMessageSenderId?: string;
  name?: string;
}

// Export the function with the correct signature
export const createNewConversationWithCreator = async (
  params: {
    userId: string,
    userName: string,
    userAvatar: string,
    creatorId: string,
    creatorName: string,
    creatorAvatar: string | null,
    initialMessage?: string
  }
): Promise<{ success: boolean, threadId?: string }> => {
  // Mock implementation
  const { userId, creatorId, initialMessage = "Hello!" } = params;
  
  try {
    const thread = {
      id: `conversation_${Date.now()}`,
      participantIds: [userId, creatorId],
      participantInfo: {
        [userId]: { displayName: params.userName, photoURL: params.userAvatar },
        [creatorId]: { displayName: params.creatorName, photoURL: params.creatorAvatar },
      },
      lastActivity: new Date(),
      createdAt: new Date(),
      isGated: false,
    };
    
    return { success: true, threadId: thread.id };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false };
  }
};
