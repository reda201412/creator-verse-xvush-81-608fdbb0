
// Import types from the generated Prisma client
import type { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

// Define types for Prisma models
interface PrismaMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  type?: string;
  metadata?: any;
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sender: PrismaUser;
}

interface PrismaConversation {
  id: string;
  title?: string | null;
  isGroup: boolean;
  messages: PrismaMessage[];
  participants: any[];
  creator: PrismaUser;
  user: PrismaUser;
}

interface PrismaUser {
  id: string;
  username?: string | null;
  profileImageUrl?: string | null;
}

// Mock data
const mockConversations = [];
const mockMessages = [];

// Export the messaging service functions
export const getConversationsForUser = async (userId: string) => {
  try {
    const prismaClient = await prisma;
    return await prismaClient.conversation.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { userId: userId }
        ]
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          }
        },
        creator: true,
        user: true
      }
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    return mockConversations;
  }
};

export const getMessagesForConversation = async (
  conversationId: string,
  userId?: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const prismaClient = await prisma;
    const skip = (page - 1) * limit;
    
    const messages = await prismaClient.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      },
      skip,
      take: limit,
      include: {
        sender: true
      }
    });
    
    // Determine if there are more messages
    const totalCount = await prismaClient.message.count({
      where: { conversationId }
    });
    
    const hasMore = skip + messages.length < totalCount;
    
    return { 
      messages, 
      hasMore 
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { 
      messages: mockMessages, 
      hasMore: false 
    };
  }
};

export const createMessage = async (
  data: {
    conversationId: string,
    senderId: string,
    content: string,
    metadata?: any,
    type?: string
  }
) => {
  const { conversationId, senderId, content, metadata, type = 'text' } = data;
  
  try {
    const prismaClient = await prisma;
    return await prismaClient.message.create({
      data: {
        conversationId,
        senderId,
        content,
        metadata,
        type,
      },
      include: {
        sender: true
      }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};

export const createConversation = async (
  data: {
    participantIds: string[],
    title?: string,
    isGroup?: boolean,
    initialMessage?: string
  }
) => {
  try {
    const prismaClient = await prisma;
    const { participantIds, title, isGroup = false, initialMessage } = data;
    
    // We need at least two participants
    if (participantIds.length < 2) {
      throw new Error("At least two participants are required");
    }
    
    const creatorId = participantIds[0];
    const userId = participantIds[1];
    
    const conversation = await prismaClient.conversation.create({
      data: {
        title,
        isGroup,
        userId,
        creatorId,
        messages: initialMessage ? {
          create: [
            {
              content: initialMessage,
              senderId: creatorId,
              type: 'text'
            }
          ]
        } : undefined,
        participants: {
          create: participantIds.map(userId => ({
            userId,
            isAdmin: userId === creatorId
          }))
        }
      },
      include: {
        messages: {
          include: {
            sender: true
          }
        },
        participants: {
          include: {
            user: true
          }
        },
        creator: true,
        user: true
      }
    });
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
};

export const markConversationAsRead = async (
  conversationId: string,
  userId: string
) => {
  try {
    const prismaClient = await prisma;
    return await prismaClient.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        messages: {
          updateMany: {
            where: {
              NOT: {
                senderId: userId
              },
              read: false
            },
            data: {
              read: true,
              readAt: new Date()
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    return null;
  }
};

// Create a messaging service object to export as named constant
export const messagingService = {
  getUserConversations: getConversationsForUser,
  getConversationMessages: getMessagesForConversation,
  sendMessage: createMessage,
  createConversation,
  markAsRead: markConversationAsRead,
  addParticipant: async (conversationId: string, userId: string, currentUserId: string) => {
    // Mock implementation for now
    return { success: true };
  },
  removeParticipant: async (conversationId: string, userId: string, currentUserId: string) => {
    // Mock implementation for now
    return { success: true };
  }
};

export default messagingService;
