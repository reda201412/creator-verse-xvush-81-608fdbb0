
import { FirestoreMessage, FirestoreMessageThread } from '@/utils/create-conversation-utils';
import { Message, MessageThread } from '@/types/messaging';
import { Timestamp } from 'firebase/firestore';

// Updated ExtendedFirestoreMessageThread to fix inheritance issues
export interface ExtendedFirestoreMessageThread extends Omit<FirestoreMessageThread, "lastActivity"> {
  id?: string;
  name?: string;
  lastActivity?: Timestamp;
  messages?: ExtendedFirestoreMessage[];
  readStatus?: Record<string, any>;
  participants?: string[]; 
  participantIds: string[];
  isGated?: boolean;
  createdAt: Timestamp; // Required
  participantInfo?: Record<string, {
    displayName: string;
    avatarUrl: string;
  }>;
}

// Extended FirestoreMessage with additional properties
export interface ExtendedFirestoreMessage extends FirestoreMessage {
  status?: 'sent' | 'delivered' | 'read' | 'monetized';
  monetization?: any;
  sender_name?: string;
  sender_avatar?: string;
  recipientId?: string;
}

// Helper function to safely convert a Timestamp to an ISO string
export function timestampToISOString(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  // If it's a number or string, try to create a new Date
  try {
    return new Date(timestamp).toISOString();
  } catch (error) {
    console.error('Error converting timestamp:', error);
    return new Date().toISOString();
  }
}

// Adapter functions to convert between types
export function adaptFirestoreThreadToMessageThread(thread: ExtendedFirestoreMessageThread): MessageThread {
  return {
    id: thread.id || '',
    participants: thread.participantIds || thread.participants || [],
    name: thread.name || '',
    lastActivity: timestampToISOString(thread.lastActivity),
    messages: thread.messages ? thread.messages.map(adaptFirestoreMessageToMessage) : [],
    isGated: !!thread.isGated || false,
    lastSeen: timestampToISOString(thread.createdAt)
  };
}

export function adaptFirestoreMessageToMessage(message: ExtendedFirestoreMessage): Message {
  return {
    id: message.id || '',
    senderId: message.senderId || '',
    senderName: message.sender_name || '',
    senderAvatar: message.sender_avatar || '',
    recipientId: message.recipientId || '',
    content: message.content || '',
    type: (message.type as any) || 'text',
    timestamp: timestampToISOString(message.createdAt),
    status: message.status || 'sent',
    isEncrypted: !!message.isEncrypted,
    monetization: message.monetization,
  };
}

export function adaptExtendedFirestoreThreadsToMessageThreads(
  threads: ExtendedFirestoreMessageThread[]
): MessageThread[] {
  return threads.map(adaptFirestoreThreadToMessageThread);
}
