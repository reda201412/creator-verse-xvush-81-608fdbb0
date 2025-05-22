
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

export const createConversation = async (options: { 
  participantIds: string[]; 
  title?: string; 
  isGroup?: boolean; 
}) => {
  // Mock implementation
  console.log('Creating conversation with participants', options.participantIds);
  return { 
    id: 'mock-conversation-id', 
    participants: options.participantIds.map(id => ({
      id: `participant-${id}`,
      userId: id,
      user: {
        id: id,
        username: `user-${id}`,
        profileImageUrl: null
      },
      lastReadAt: null,
      isAdmin: false,
      conversationId: 'mock-conversation-id'
    })),
    title: options.title || null,
    isGroup: options.isGroup || false,
    isGated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(),
    messages: [] 
  };
};

export const sendMessage = async (options: { 
  conversationId: string; 
  senderId: string; 
  content: string;
  metadata?: any;
}) => {
  // Mock implementation
  const { conversationId, senderId, content, metadata } = options;
  console.log('Sending message in conversation', conversationId);
  return { 
    id: 'mock-message-id', 
    conversationId, 
    senderId, 
    content, 
    type: 'text',
    metadata: metadata || null,
    isEdited: false,
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    sender: {
      id: senderId,
      username: `user-${senderId}`,
      profileImageUrl: null
    }
  };
};

export const getUserConversations = async (userId: string) => {
  // Mock implementation
  console.log('Getting conversations for user', userId);
  return [
    {
      id: 'mock-conversation-id',
      title: null,
      isGroup: false,
      isGated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      unreadCount: 0,
      participants: [
        {
          id: `participant-${userId}`,
          userId: userId,
          user: {
            id: userId,
            username: `user-${userId}`,
            profileImageUrl: null
          },
          lastReadAt: new Date(),
          isAdmin: true,
          conversationId: 'mock-conversation-id'
        },
        {
          id: 'participant-other-user',
          userId: 'other-user',
          user: {
            id: 'other-user',
            username: 'other-user',
            profileImageUrl: null
          },
          lastReadAt: new Date(),
          isAdmin: false,
          conversationId: 'mock-conversation-id'
        }
      ],
      messages: [
        {
          id: 'mock-message-1',
          conversationId: 'mock-conversation-id',
          senderId: 'other-user',
          content: 'Hello there!',
          type: 'text',
          metadata: null,
          isEdited: false,
          isDeleted: false,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: {
            id: 'other-user',
            username: 'other-user',
            profileImageUrl: null
          }
        }
      ]
    }
  ];
};

export const getConversationMessages = async (
  conversationId: string, 
  userId: string, 
  page: number = 1, 
  limit: number = 20
) => {
  // Mock implementation
  console.log('Getting messages for conversation', conversationId, 'page', page);
  const messages = [
    {
      id: 'mock-message-1',
      conversationId,
      senderId: 'other-user',
      content: 'Hello there!',
      type: 'text',
      metadata: null,
      isEdited: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: 'other-user',
        username: 'other-user',
        profileImageUrl: null
      }
    },
    {
      id: 'mock-message-2',
      conversationId,
      senderId: userId,
      content: 'Hi! How are you?',
      type: 'text',
      metadata: null,
      isEdited: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: userId,
        username: `user-${userId}`,
        profileImageUrl: null
      }
    }
  ];

  // Only return messages for the current page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedMessages = messages.slice(startIndex, endIndex);

  return {
    messages: paginatedMessages,
    hasMore: paginatedMessages.length === limit
  };
};

export const markAsRead = async (conversationId: string, userId: string) => {
  // Mock implementation
  console.log('Marking conversation as read', conversationId, 'for user', userId);
  return true;
};

export const addParticipant = async (conversationId: string, userId: string, adminId: string) => {
  // Mock implementation
  console.log('Adding participant', userId, 'to conversation', conversationId, 'by admin', adminId);
  return true;
};

export const removeParticipant = async (conversationId: string, userId: string, adminId: string) => {
  // Mock implementation
  console.log('Removing participant', userId, 'from conversation', conversationId, 'by admin', adminId);
  return true;
};

// Add the messagingService export to fix the ConversationContext import error
export const messagingService = {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  getUserConversations,
  getConversationMessages,
  markAsRead,
  addParticipant,
  removeParticipant
};
