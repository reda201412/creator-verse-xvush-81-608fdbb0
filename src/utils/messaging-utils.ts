import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  doc, 
  writeBatch, 
  serverTimestamp, 
  Timestamp, 
  getDoc,
  limit,
  startAfter, // Ajout pour la pagination
  updateDoc   // Ajout pour markMessagesAsRead
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/firebase';
import { 
  FirestoreMessageThread, 
  FirestoreMessage 
} from './create-conversation-utils'; // Réutiliser les types définis là-bas
import { MessageType } from '@/types/messaging'; // Types existants

// Interface étendue qui inclut les propriétés utilisées dans SecureMessaging.tsx
export interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, Timestamp>;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  lastMessageCreatedAt?: Timestamp;
}

// Récupère les fils de discussion pour un utilisateur donné (métadonnées uniquement)
export const fetchUserThreads = async (userId: string): Promise<ExtendedFirestoreMessageThread[]> => {
  try {
    const q = query(
      collection(db, 'messageThreads'),
      where('participantIds', 'array-contains', userId),
      orderBy('lastActivity', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const threads: ExtendedFirestoreMessageThread[] = querySnapshot.docs.map(threadDoc => {
      const threadData = threadDoc.data() as Omit<FirestoreMessageThread, 'id'>;
      return {
        id: threadDoc.id,
        ...threadData,
        messages: [], // Initialiser avec un tableau de messages vide, seront chargés à la demande
        readStatus: {} // Initialiser avec un objet readStatus vide
      } as ExtendedFirestoreMessageThread;
    });
    return threads;
  } catch (error) {
    console.error('Error fetching user threads metadata from Firestore:', error);
    return [];
  }
};

// Récupère les messages pour un fil de discussion spécifique (avec pagination optionnelle)
export const fetchMessagesForThread = async (
  threadId: string, 
  limitCount = 20, 
  lastVisibleDoc: any = null // Le dernier document visible de la requête précédente pour la pagination
): Promise<{ messages: FirestoreMessage[], newLastVisibleDoc: any }> => {
  try {
    let messagesQuery;
    const messagesCollectionRef = collection(db, 'messageThreads', threadId, 'messages');

    if (lastVisibleDoc) {
      messagesQuery = query(
        messagesCollectionRef,
        orderBy('createdAt', 'desc'), // Récupérer les plus récents en premier pour la pagination inversée
        startAfter(lastVisibleDoc),
        limit(limitCount)
      );
    } else {
      messagesQuery = query(
        messagesCollectionRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }
    
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages: FirestoreMessage[] = messagesSnapshot.docs
      .map(msgDoc => ({
        id: msgDoc.id,
        ...(msgDoc.data() as Omit<FirestoreMessage, 'id'>)
      }))
      .reverse(); // Inverser pour avoir les plus anciens en premier dans l'UI (ordre chronologique)

    const newLastVisibleDoc = messagesSnapshot.docs[messagesSnapshot.docs.length - 1];
    return { messages, newLastVisibleDoc };

  } catch (error) {
    console.error(`Error fetching messages for thread ${threadId}:`, error);
    return { messages: [], newLastVisibleDoc: null };
  }
};

// Envoie un message et met à jour le fil de discussion parent
export const sendMessage = async ({
  threadId,
  senderId,
  // senderName, // N'est plus passé, car on suppose qu'il est dans participantInfo du thread
  // senderAvatar, // N'est plus passé
  content,
  isEncrypted = false,
  monetizationData = null,
  messageType = 'text' as MessageType,
}: {
  threadId: string;
  senderId: string;
  content: string;
  isEncrypted?: boolean;
  monetizationData?: any;
  messageType?: MessageType;
}): Promise<FirestoreMessage> => {
  try {
    const batch = writeBatch(db);
    const now = serverTimestamp() as Timestamp;
    const threadRef = doc(db, 'messageThreads', threadId);
    const newMessageRef = doc(collection(threadRef, 'messages'));

    const messageData: Omit<FirestoreMessage, 'id'> = {
      senderId,
      content,
      type: messageType,
      createdAt: now,
      isEncrypted,
      ...(monetizationData && { monetization: monetizationData }), 
    };
    batch.set(newMessageRef, messageData);

    // Mettre à jour le fil de discussion parent
    // Récupérer le displayName du sender depuis le thread pour lastMessageSenderName (optionnel)
    batch.update(threadRef, {
      lastMessageText: content.length > 100 ? content.substring(0, 97) + "..." : content,
      lastMessageSenderId: senderId,
      lastMessageCreatedAt: now,
      lastActivity: now,
      // Optionnel: mettre à jour readStatus pour que l'expéditeur ait lu son propre message
      [`readStatus.${senderId}`]: now 
    });

    await batch.commit();
    return {
      id: newMessageRef.id,
      ...messageData,
      createdAt: Timestamp.now() // Simuler le timestamp pour l'UI
    } as FirestoreMessage;

  } catch (error) {
    console.error('Error sending message to Firestore:', error);
    throw error;
  }
};

// Marque les messages comme lus dans un fil pour un utilisateur donné en mettant à jour son timestamp lastReadAt
export const markMessagesAsRead = async (threadId: string, userId: string): Promise<boolean> => {
  try {
    const threadRef = doc(db, 'messageThreads', threadId);
    
    // Mettre à jour/créer un champ lastReadAt pour l'utilisateur dans une map `readStatus`
    // readStatus: { [userId]: Timestamp }
    // Cela marque tous les messages *avant* ce timestamp comme lus par cet utilisateur.
    const updateData:any = {};
    updateData[`readStatus.${userId}`] = serverTimestamp();

    await updateDoc(threadRef, updateData);
    
    console.log(`Thread ${threadId} marked as read up to now for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error marking thread as read in Firestore:', error);
    return false;
  }
};
