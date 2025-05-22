import prisma from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface MockPrismaClient extends Partial<PrismaClient> {
  $transaction: <T>(fn: (prisma: PrismaClient) => Promise<T>) => Promise<T>;
  conversation: PrismaClient['conversation'];
  participant: PrismaClient['participant'];
  message: PrismaClient['message'];
}

// Initialize db based on environment
const db: PrismaClient | MockPrismaClient = prisma;

// Base types
interface UserInfo {
  id: string;
  username: string | null;
  profileImageUrl: string | null;
}

// Message metadata can include additional fields like attachments, mentions, etc.
type MessageMetadata = Record<string, unknown>;

interface Message {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  type: string;
  metadata: MessageMetadata | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sender: UserInfo;
}

interface Participant {
  id: string;
  userId: string;
  conversationId: string;
  lastReadAt: Date | null;
  isAdmin: boolean;
  user: UserInfo;
}

interface Conversation {
  id: string;
  title: string | null;
  isGroup: boolean;
  isGated: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date | null;
  participants: Participant[];
  messages: Message[];
}

// Method return types
interface MessageWithSender {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  type: string;
  metadata: MessageMetadata | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sender: UserInfo;
}

interface ConversationWithParticipants extends Omit<Conversation, 'participants' | 'messages'> {
  participants: Participant[];
  messages: MessageWithSender[];
}

interface PaginatedMessages {
  messages: MessageWithSender[];
  total: number;
  hasMore: boolean;
}

// Input types
interface CreateMessageInput {
  content: string;
  conversationId: string;
  senderId: string;
  type?: string;
  metadata?: Record<string, unknown>;
}

interface CreateConversationInput {
  participantIds: string[];
  title?: string;
  isGroup?: boolean;
  isGated?: boolean;
}

const messagingService = {
  // Créer une nouvelle conversation
  async createConversation({
    participantIds,
    title,
    isGroup = false,
    isGated = false,
  }: CreateConversationInput): Promise<ConversationWithParticipants> {
    if (participantIds.length < 2) {
      throw new Error('Une conversation doit avoir au moins 2 participants');
    }

    return db.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          id: uuidv4(),
          title: title || null,
          isGroup,
          isGated,
          participants: {
            create: participantIds.map((id) => ({
              id: uuidv4(),
              userId: id,
              isAdmin: false,
            })),
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profileImageUrl: true,
                },
              },
            },
          },
          messages: true,
        },
      });

      return {
        ...conversation,
        messages: [],
      };
    });
  },

  // Envoyer un message
  async sendMessage({
    content,
    conversationId,
    senderId,
    type = 'text',
    metadata,
  }: CreateMessageInput): Promise<MessageWithSender> {
    return db.$transaction(async (tx) => {
      // Vérifier que l'expéditeur fait partie de la conversation
      const participant = await tx.participant.findFirst({
        where: {
          userId: senderId,
          conversationId,
        },
      });

      if (!participant) {
        throw new Error("L'expéditeur ne fait pas partie de cette conversation");
      }

      // Créer le message
      const message = await tx.message.create({
        data: {
          id: uuidv4(),
          content,
          type,
          metadata,
          senderId,
          conversationId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
            },
          },
        },
      });

      // Mettre à jour la date du dernier message de la conversation
      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    });
  },

  // Récupérer les conversations d'un utilisateur
  async getUserConversations(userId: string): Promise<ConversationWithParticipants[]> {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileImageUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    return conversations.map(conv => ({
      ...conv,
      messages: [], // Ne pas renvoyer les messages dans la liste des conversations
    }));
  },

  // Récupérer les messages d'une conversation
  async getConversationMessages(
    conversationId: string,
    userId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedMessages> {
    // Vérifier que l'utilisateur a accès à la conversation
    const hasAccess = await db.participant.findFirst({
      where: {
        userId,
        conversationId,
      },
    });

    if (!hasAccess) {
      throw new Error("Vous n'avez pas accès à cette conversation");
    }

    // Récupérer les messages paginés
    const [messages, total] = await Promise.all([
      db.message.findMany({
        where: {
          conversationId,
          isDeleted: false,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.message.count({
        where: {
          conversationId,
          isDeleted: false,
        },
      }),
    ]);

    // Marquer les messages comme lus
    await db.participant.updateMany({
      where: {
        userId,
        conversationId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return {
      messages: messages.reverse(), // Inverser pour avoir les plus anciens en premier
      total,
      hasMore: page * limit < total,
    };
  },

  // Marquer les messages comme lus
  async markAsRead(conversationId: string, userId: string): Promise<{ count: number }> {
    return db.participant.updateMany({
      where: {
        userId,
        conversationId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });
  },

  // Supprimer un message (soft delete)
  async deleteMessage(messageId: string, userId: string): Promise<Message> {
    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error('Message non trouvé');
    }

    if (message.senderId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce message");
    }

    return db.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  },

  // Ajouter un participant à une conversation
  async addParticipant(
    conversationId: string,
    userId: string,
    addedById: string
  ): Promise<Participant> {
    return db.$transaction(async (tx) => {
      // Vérifier que la personne qui ajoute est bien dans la conversation
      const hasAccess = await tx.participant.findFirst({
        where: {
          userId: addedById,
          conversationId,
          isAdmin: true,
        },
      });

      if (!hasAccess) {
        throw new Error("Vous n'êtes pas autorisé à ajouter des participants");
      }

      // Vérifier si l'utilisateur n'est pas déjà dans la conversation
      const existingParticipant = await tx.participant.findFirst({
        where: {
          userId,
          conversationId,
        },
      });

      if (existingParticipant) {
        throw new Error("L'utilisateur fait déjà partie de cette conversation");
      }

      // Ajouter le participant
      return tx.participant.create({
        data: {
          id: uuidv4(),
          userId,
          conversationId,
          isAdmin: false,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
            },
          },
        },
      });
    });
  },

  // Supprimer un participant d'une conversation
  async removeParticipant(
    conversationId: string,
    userId: string,
    removedById: string
  ): Promise<Participant> {
    return db.$transaction(async (tx) => {
      // Vérifier que la personne qui supprime est bien dans la conversation
      const remover = await tx.participant.findFirst({
        where: {
          userId: removedById,
          conversationId,
        },
      });

      if (!remover) {
        throw new Error("Vous n'êtes pas autorisé à effectuer cette action");
      }

      // Vérifier que l'utilisateur ne se supprime pas lui-même ou qu'il est admin
      if (remover.userId !== userId && !remover.isAdmin) {
        throw new Error(
          "Vous n'êtes pas autorisé à supprimer d'autres participants"
        );
      }

      // Supprimer le participant
      const participant = await tx.participant.delete({
        where: {
          userId_conversationId: {
            userId,
            conversationId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImageUrl: true,
            },
          },
        },
      });

      // Vérifier s'il reste des participants
      const remainingParticipants = await tx.participant.count({
        where: { conversationId },
      });

      // Si c'était le dernier participant, supprimer la conversation
      if (remainingParticipants === 0) {
        await tx.conversation.delete({
          where: { id: conversationId },
        });
      }

      return participant;
    });
  },
};

export { messagingService };
