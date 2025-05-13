
import { FirestoreMessage, FirestoreMessageThread } from '@/utils/create-conversation-utils';
import { Message, MessageThread } from '@/types/messaging';

// Extended FirestoreMessageThread with messages property
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, any>;
  participants?: string[]; // Add participants property to make it compatible with MessageThread
}

// Adapter functions to convert between types
export function adaptFirestoreThreadToMessageThread(thread: ExtendedFirestoreMessageThread): MessageThread {
  return {
    id: thread.id || '',
    participants: thread.participantIds || [],
    name: thread.name || '',
    lastActivity: thread.lastActivity || new Date(),
    messages: thread.messages.map(adaptFirestoreMessageToMessage),
    createdAt: thread.createdAt || new Date(),
  };
}

export function adaptFirestoreMessageToMessage(message: FirestoreMessage): Message {
  return {
    id: message.id,
    senderId: message.senderId,
    content: message.content,
    type: message.type as any,
    status: message.status as any,
    isEncrypted: message.isEncrypted,
    createdAt: message.createdAt as any,
    monetization: (message as any).monetization,
  };
}

export function adaptExtendedFirestoreThreadsToMessageThreads(
  threads: ExtendedFirestoreMessageThread[]
): MessageThread[] {
  return threads.map(adaptFirestoreThreadToMessageThread);
}
