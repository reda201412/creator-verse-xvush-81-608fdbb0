// Import the types
import { FirestoreMessageThread } from '@/vite-env';

// Create a type that includes the lastMessageText field
interface EnhancedFirestoreThreadData extends Omit<FirestoreMessageThread, "id"> {
  lastMessageText?: string;
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to create participant info
function createParticipantInfo(userId: string, userName: string, userAvatar: string | null): any {
  return {
    [userId]: {
      name: userName,
      avatar: userAvatar,
      lastRead: null,
      isOnline: false,
    },
  };
}

// Function to construct the initial message
function createInitialMessage(senderId: string, senderName: string, senderAvatar: string, content: string): any {
  return {
    id: generateId(),
    senderId: senderId,
    senderName: senderName,
    senderAvatar: senderAvatar,
    content: content,
    type: 'text',
    timestamp: new Date().toISOString(),
    status: 'sent',
    isEncrypted: false,
  };
}

// Function to update the thread's last activity
function updateLastActivity(): string {
  return new Date().toISOString();
}

// Function to create a new conversation thread
export async function createConversation(data: any) {
  try {
    // Create thread object with properly typed fields
    const threadData: EnhancedFirestoreThreadData = {
      participantIds: data.participantIds,
      participantInfo: data.participantInfo,
      lastActivity: data.lastActivity,
      createdAt: data.createdAt,
      isGated: !!data.isGated,
      messages: [],
      lastMessageText: data.initialMessage, // Now this property is allowed
    };

    // Simulate success
    console.log("Simulating conversation creation with data:", threadData);
    
    return { success: true, threadId: "new-thread-id" }; // Replace with actual return value
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { success: false, error };
  }
}

// Function to fetch an existing conversation thread
export async function getConversation(threadId: string) {
  try {
    // Simulate fetching the conversation
    console.log("Simulating fetching conversation with ID:", threadId);
    
    return { success: true, thread: { id: threadId, messages: [] } }; // Replace with actual return value
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { success: false, error };
  }
}

// Function to send a message to a conversation thread
export async function sendMessage(threadId: string, message: any) {
  try {
    // Simulate sending the message
    console.log("Simulating sending message to thread ID:", threadId, "with message:", message);
    
    return { success: true, messageId: "new-message-id" }; // Replace with actual return value
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error };
  }
}
