
// Import the client's typings without directly importing the PrismaClient class
import type { Message, Conversation, User } from '@prisma/client';
import prisma from '@/lib/prisma';

// Mock data
const mockConversations = [];
const mockMessages = [];

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

export const getMessagesForConversation = async (conversationId: string) => {
  try {
    const prismaClient = await prisma;
    return await prismaClient.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return mockMessages;
  }
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
  type: string = 'text'
) => {
  try {
    const prismaClient = await prisma;
    return await prismaClient.message.create({
      data: {
        conversationId,
        senderId,
        content,
        type,
      }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
};

export const createConversation = async (
  userId: string,
  creatorId: string,
  initialMessage?: string
) => {
  try {
    const prismaClient = await prisma;
    const conversation = await prismaClient.conversation.create({
      data: {
        userId,
        creatorId,
        messages: initialMessage ? {
          create: [
            {
              content: initialMessage,
              senderId: userId,
              type: 'text'
            }
          ]
        } : undefined
      },
      include: {
        messages: true,
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
