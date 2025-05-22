
// Import our mock prisma client instead
import mockPrisma from '@/lib/mock-prisma';

// Mock messaging service implementation
export const getConversations = async (userId: string) => {
  // Mock implementation
  console.log('Getting conversations for user', userId);
  return [];
};

export const getConversation = async (conversationId: string) => {
  // Mock implementation
  console.log('Getting conversation', conversationId);
  return null;
};

export const createConversation = async (userId: string, recipientId: string) => {
  // Mock implementation
  console.log('Creating conversation between', userId, 'and', recipientId);
  return { id: 'mock-conversation-id', participants: [userId, recipientId] };
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  // Mock implementation
  console.log('Sending message in conversation', conversationId);
  return { 
    id: 'mock-message-id', 
    conversationId, 
    senderId, 
    content, 
    createdAt: new Date().toISOString() 
  };
};
