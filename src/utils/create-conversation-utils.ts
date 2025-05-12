import { db } from '@/integrations/firebase/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp, // Importer Timestamp pour typer les champs de date
  writeBatch,
  doc, // Importer doc pour créer une référence de document pour le message
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { toast } from 'sonner';
import { MessageType } from '@/types/messaging'; // Assurez-vous que ce type est toujours pertinent

// Types pour la messagerie Firestore (vous pouvez les déplacer dans un fichier types/messaging.ts dédié)
export interface FirestoreMessageThread {
  id?: string; // ID du document Firestore
  participantIds: string[];
  participantInfo: {
    [uid: string]: {
      displayName: string;
      avatarUrl: string | null;
    };
  };
  lastMessageText?: string;
  lastMessageSenderId?: string;
  lastMessageCreatedAt?: Timestamp;
  lastActivity: Timestamp;
  createdAt: Timestamp;
  isGated: boolean;
  name?: string;
  normalizedParticipantIds?: string; // New field for optimized queries
}

export interface FirestoreMessage {
  id?: string; // ID du document Firestore
  senderId: string;
  content: string;
  type: MessageType | 'system_notification'; // Étendre si nécessaire
  createdAt: Timestamp;
  isEncrypted: boolean;
}

/**
 * Crée une nouvelle conversation (fil de discussion et premier message) entre un utilisateur et un créateur.
 * Vérifie d'abord si un fil de discussion entre ces deux utilisateurs existe déjà.
 *
 * @param {object} params - Object containing the parameters for creating the conversation.
 * @param {string} params.userId - UID de l'utilisateur qui initie (fan).
 * @param {string} params.userName - Nom d'affichage de l'utilisateur qui initie.
 * @param {string} params.userAvatar - URL de l'avatar de l'utilisateur qui initie.
 * @param {string} params.creatorId - UID du créateur.
 * @param {string} params.creatorName - Nom d'affichage du créateur.
 * @param {string} params.creatorAvatar - URL de l'avatar du créateur.
 * @param {string} [params.initialMessageText="Bonjour, j'aimerais discuter avec vous!"] - Texte du premier message.
 * @param {boolean} [params.isGated=false] - Indique si le fil de discussion est gated.
 *
 * @returns {Promise<object>} - Object containing the result of the operation.
 * @returns {boolean} result.success - True si l'opération a réussi, false sinon.
 * @returns {string} [result.threadId] - ID du fil de discussion créé.
 * @returns {FirestoreMessage} [result.message] - Le premier message créé.
 * @returns {object} [result.error] - Object contenant l'erreur si l'opération a échoué.
 * @returns {string} [result.existingThreadId] - ID du fil de discussion existant s'il en existe un.
 *
 * @security - This function does not directly implement security measures.
 *             Ensure that the calling code has proper authentication and authorization checks.
 *             Consider implementing server-side validation to prevent malicious input.
 *
 * @performance - The function performs one query to check for existing threads using normalizedParticipantIds.
 *                Ensure that there is a single index on the `normalizedParticipantIds` field to improve query performance.
 */
export const createNewConversationWithCreator = async ({
  userId,        // UID de l'utilisateur qui initie (fan)
  userName,      // Nom d'affichage de l'utilisateur qui initie
  userAvatar,    // URL de l'avatar de l'utilisateur qui initie
  creatorId,     // UID du créateur
  creatorName,   // Nom d'affichage du créateur
  creatorAvatar, // URL de l'avatar du créateur
  initialMessageText = "Bonjour, j'aimerais discuter avec vous!",
  isGated = false
}: {
  userId: string;
  userName: string;
  userAvatar: string | null;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string | null;
  initialMessageText?: string;
  isGated?: boolean;
}): Promise<{ success: boolean; threadId?: string; message?: FirestoreMessage; error?: any; existingThreadId?: string }> => {
  if (userId === creatorId) {
    toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même.");
    return { success: false, error: "Self-conversation attempt" };
  }

  try {
    // 1. Vérifier si un fil de discussion existe déjà entre ces deux utilisateurs
    const participantIds = [userId, creatorId].sort();
    const normalizedParticipantIds = participantIds.join("_");

    const q = query(
      collection(db, 'messageThreads'),
      where('normalizedParticipantIds', '==', normalizedParticipantIds),
      limit(1)
    );

    const snapshot = await getDocs(q);
    let existingThread: FirestoreMessageThread | null = null;
    let existingThreadId: string | undefined = undefined;

    if (!snapshot.empty) {
      existingThreadId = snapshot.docs[0].id;
      existingThread = snapshot.docs[0].data() as FirestoreMessageThread;
    }

    if (existingThread && existingThreadId) {
      console.log("Un fil de discussion existe déjà:", existingThreadId);
      toast.info("Une conversation avec ce créateur existe déjà.");
      return { success: true, threadId: existingThreadId, existingThreadId: existingThreadId };
    }

    // 2. Si aucun fil existant, créer un nouveau fil de discussion et le premier message dans un batch
    const batch = writeBatch(db);
    const now = serverTimestamp() as Timestamp; // Correctement typé pour Firestore

    // Créer la référence pour le nouveau fil de discussion
    const newThreadRef = doc(collection(db, 'messageThreads'));

    const threadData: Omit<FirestoreMessageThread, 'id'> = {
      participantIds: [userId, creatorId].sort(), // Toujours trier pour des requêtes cohérentes
      participantInfo: {
        [userId]: { displayName: userName, avatarUrl: userAvatar },
        [creatorId]: { displayName: creatorName, avatarUrl: creatorAvatar },
      },
      lastMessageText: initialMessageText,
      lastMessageSenderId: userId,
      lastMessageCreatedAt: now,
      lastActivity: now,
      createdAt: now,
      isGated: isGated,
      name: creatorName, // Le nom du fil pourrait être le nom du créateur pour le fan
      normalizedParticipantIds: normalizedParticipantIds, // Store normalized ID
    };
    batch.set(newThreadRef, threadData);

    // Créer la référence pour le nouveau message dans la sous-collection du fil
    const newMessageRef = doc(collection(newThreadRef, 'messages'));
    const messageData: Omit<FirestoreMessage, 'id'> = {
      senderId: userId,
      content: initialMessageText,
      type: 'text' as MessageType, // S'assurer que MessageType inclut 'text'
      createdAt: now,
      isEncrypted: false, // Gérer le chiffrement si nécessaire
    };
    batch.set(newMessageRef, messageData);

    await batch.commit();

    toast.success("Conversation démarrée avec succès!");
    return {
      success: true,
      threadId: newThreadRef.id,
      message: { id: newMessageRef.id, ...messageData }
    };
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    toast.error("Impossible de démarrer une conversation. Veuillez réessayer.");
    return { success: false, error };
  }
};

// La fonction fetchAvailableCreators a été supprimée car sa fonctionnalité
// est maintenant couverte par getAllCreators dans src/services/creatorService.ts
// Si vous avez besoin d'une logique spécifique de récupération de créateurs pour la messagerie
// qui diffère de getAllCreators, vous pouvez la réimplémenter ici.
