
import { FirestoreMessage, FirestoreMessageThread } from '@/utils/create-conversation-utils';
import { Message, MessageThread } from '@/types/messaging';
import { Timestamp } from 'firebase/firestore';

// Extended FirestoreMessageThread with messages property
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
  participants?: string[]; // Add participants property to make it compatible with MessageThread
  participantIds?: string[]; // Original property that might be in the data
}

// Extended FirestoreMessage with status property
export interface ExtendedFirestoreMessage extends FirestoreMessage {
  status?: 'sent' | 'delivered' | 'read' | 'monetized';
  monetization?: any;
}

// Adapter functions to convert between types
export function adaptFirestoreThreadToMessageThread(thread: ExtendedFirestoreMessageThread): MessageThread {
  return {
    id: thread.id || '',
    participants: thread.participantIds || thread.participants || [],
    name: thread.name || '',
    lastActivity: thread.lastActivity ? (thread.lastActivity.toDate ? thread.lastActivity.toDate().toISOString() : new Date(thread.lastActivity).toISOString()) : new Date().toISOString(),
    messages: thread.messages ? thread.messages.map(adaptFirestoreMessageToMessage) : [],
    createdAt: thread.createdAt ? (thread.createdAt.toDate ? thread.createdAt.toDate().toISOString() : new Date(thread.createdAt).toISOString()) : new Date().toISOString(),
    isGated: !!thread.is_gated || false,
  };
}

export function adaptFirestoreMessageToMessage(message: ExtendedFirestoreMessage): Message {
  const timestamp = message.createdAt 
    ? (message.createdAt.toDate ? message.createdAt.toDate().toISOString() : new Date(message.createdAt).toISOString())
    : new Date().toISOString();
  
  return {
    id: message.id || '',
    senderId: message.senderId || '',
    senderName: message.sender_name || '',
    senderAvatar: message.sender_avatar || '',
    recipientId: message.recipientId || '',
    content: message.content || '',
    type: (message.type as any) || 'text',
    timestamp: timestamp,
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
