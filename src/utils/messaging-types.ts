
import { Timestamp } from 'firebase/firestore';

// Enhanced FirestoreMessage type with additional properties for compatibility
export interface FirestoreMessage {
  id: string; // id is required, not optional
  senderId: string;
  content: string;
  createdAt: Timestamp;
  type: string;
  isEncrypted?: boolean;
  monetization?: any;
  // Additional properties needed for compatibility
  sender_name?: string;
  sender_avatar?: string;
  recipientId?: string;
}

export interface FirestoreMessageThread {
  id?: string;
  participantIds: string[];
  name?: string;
  messages?: FirestoreMessage[]; // Making messages explicitly optional
  readStatus?: Record<string, Timestamp>;
  participants?: string[]; 
  lastActivity?: Timestamp;
  isGated?: boolean;
  createdAt: Timestamp;
  participantInfo?: Record<string, {
    displayName: string;
    avatarUrl: string;
  }>;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  lastMessageCreatedAt?: Timestamp;
}

// Convert Firebase Timestamp objects to ISO strings for React components
export function timestampToISOString(timestamp?: Timestamp): string {
  if (!timestamp || !timestamp.toDate) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

// Extended types for adapting Firestore data to MessageThread format
export interface ExtendedFirestoreMessage extends FirestoreMessage {
  sender_name: string;
  sender_avatar: string;
  recipientId: string;
}

export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: ExtendedFirestoreMessage[];
}

// Helper function to convert FirestoreMessage to ExtendedFirestoreMessage
export function convertToExtendedMessage(message: FirestoreMessage): ExtendedFirestoreMessage {
  return {
    ...message,
    sender_name: message.sender_name || '',
    sender_avatar: message.sender_avatar || '',
    recipientId: message.recipientId || '',
  };
}

// Function to adapt Firestore threads to MessageThread format
export function adaptExtendedFirestoreThreadsToMessageThreads(
  firebaseThreads: ExtendedFirestoreMessageThread[]
) {
  // Implementation would go here
  return firebaseThreads.map(thread => ({
    id: thread.id || '',
    participants: thread.participantIds || [],
    name: thread.name || '',
    lastActivity: timestampToISOString(thread.lastActivity),
    messages: (thread.messages || []).map(m => ({
      id: m.id || '',
      senderId: m.senderId || '',
      content: m.content || '',
      timestamp: timestampToISOString(m.createdAt),
      type: m.type || 'text',
      status: 'sent',
      senderName: m.sender_name || '',
      senderAvatar: m.sender_avatar || '',
      isEncrypted: !!m.isEncrypted
    })),
    isGated: !!thread.isGated
  }));
}
