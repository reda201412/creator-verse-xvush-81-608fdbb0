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
import { CreateConversationParams } from '@/types/navigation';

// Types pour la messagerie Firestore (vous pouvez les déplacer dans un fichier types/messaging.ts dédié)
export interface FirestoreMessageThread {
  id?: string; // ID du document Firestore
  participantIds: string[];
  participantInfo: Record<string, any>;
  lastActivity: any; // Firebase Timestamp
  createdAt: any; // Firebase Timestamp
  isGated: boolean;
}

export interface FirestoreMessage {
  id?: string; // ID du document Firestore
  senderId: string;
  content: string | any;
  type: string;
  createdAt: any; // Firebase Timestamp
  isEncrypted?: boolean;
  monetization?: any;
}

/**
 * Crée une nouvelle conversation (fil de discussion et premier message) entre un utilisateur et un créateur.
 * Vérifie d'abord si un fil de discussion entre ces deux utilisateurs existe déjà.
 */
export const createNewConversationWithCreator = async ({
  userId,        // UID de l'utilisateur qui initie (fan)
  userName,      // Nom d'affichage de l'utilisateur qui initie
  userAvatar,    // URL de l'avatar de l'utilisateur qui initie
  creatorId,     // UID du créateur
  creatorName,   // Nom d'affichage du créateur
  creatorAvatar, // URL de l'avatar du créateur
  initialMessageText = "Bonjour, j'aimerais discuter avec vous !",
  isGated = false
}: CreateConversationParams): Promise<{ success: boolean; threadId?: string; message?: FirestoreMessage; error?: any; existingThreadId?: string }> => {
  if (userId === creatorId) {
    toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même.");
    return { success: false, error: "Self-conversation attempt" };
  }

  try {
    // 1. Vérifier si un fil de discussion existe déjà entre ces deux utilisateurs
    // On cherche un fil où participantIds contient à la fois userId et creatorId
    // Pour les tableaux, Firestore nécessite des requêtes `array-contains-all` ou des astuces.
    // Une manière plus simple pour deux participants est de vérifier les deux ordres possibles:
    const q1 = query(
      collection(db, 'messageThreads'),
      where('participantIds', '==', [userId, creatorId]),
      limit(1)
    );
    const q2 = query(
      collection(db, 'messageThreads'),
      where('participantIds', '==', [creatorId, userId]),
      limit(1)
    );

    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    let existingThread: FirestoreMessageThread | null = null;
    let existingThreadId: string | undefined = undefined;

    if (!snapshot1.empty) {
      existingThreadId = snapshot1.docs[0].id;
      existingThread = snapshot1.docs[0].data() as FirestoreMessageThread;
    } else if (!snapshot2.empty) {
      existingThreadId = snapshot2.docs[0].id;
      existingThread = snapshot2.docs[0].data() as FirestoreMessageThread;
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
