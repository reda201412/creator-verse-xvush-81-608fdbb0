
// Utility functions for messaging
import { FirestoreMessage, FirestoreMessageThread } from './create-conversation-utils';

/**
 * Format a timestamp for display
 * @param timestamp - The timestamp to format
 * @returns Formatted timestamp string
 */
export const formatMessageTimestamp = (timestamp: any): string => {
  if (!timestamp) return '';
  
  let date;
  if (typeof timestamp === 'object' && timestamp.seconds) {
    // Firebase Timestamp
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    return '';
  }
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) {
    // Today - show time only
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Hier';
  } else if (diffInDays < 7) {
    // Within a week - show day name
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  } else {
    // More than a week ago - show date
    return date.toLocaleDateString();
  }
};

/**
 * Convert Firestore message thread to app message thread format
 * @param firestoreThread - The Firestore message thread
 * @returns Converted message thread
 */
export const convertFirestoreThreadToAppThread = (firestoreThread: FirestoreMessageThread): any => {
  return {
    id: firestoreThread.id,
    participants: firestoreThread.participantIds || [],
    name: firestoreThread.name || '',
    lastActivity: firestoreThread.lastActivity || new Date(),
    messages: (firestoreThread.messages || []).map(convertFirestoreMessageToAppMessage),
    isEncrypted: false, // Default value, should be determined based on actual data
    createdAt: firestoreThread.createdAt || new Date(),
  };
};

/**
 * Convert Firestore message to app message format
 * @param firestoreMessage - The Firestore message
 * @returns Converted message
 */
export const convertFirestoreMessageToAppMessage = (firestoreMessage: FirestoreMessage): any => {
  return {
    id: firestoreMessage.id,
    senderId: firestoreMessage.senderId,
    senderName: firestoreMessage.sender_name || '',
    content: firestoreMessage.content,
    timestamp: firestoreMessage.createdAt || new Date(),
    status: firestoreMessage.status || 'sent',
    isEncrypted: firestoreMessage.isEncrypted || false,
    monetization: firestoreMessage.monetization || null,
  };
};
