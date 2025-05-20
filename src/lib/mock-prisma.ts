
// Mock PrismaClient implementation for development
export class MockPrismaClient {
  user = {
    findUnique: async (args: any) => {
      return {
        id: 'mock-user-id',
        email: 'user@example.com',
        username: 'mockuser',
        profileImageUrl: 'https://i.pravatar.cc/150?u=mockuser'
      };
    },
    findMany: async (args?: any) => {
      return [
        {
          id: 'mock-user-1',
          email: 'user1@example.com',
          username: 'user1',
          profileImageUrl: 'https://i.pravatar.cc/150?u=user1'
        },
        {
          id: 'mock-user-2',
          email: 'user2@example.com',
          username: 'user2',
          profileImageUrl: 'https://i.pravatar.cc/150?u=user2'
        }
      ];
    },
    create: async (args: any) => {
      return {
        id: 'new-mock-user',
        ...args.data
      };
    },
    update: async (args: any) => {
      return {
        id: args.where.id,
        ...args.data
      };
    },
    delete: async (args: any) => {
      return { id: args.where.id };
    }
  };
  
  // Add a follow model for creator following functionality
  follow = {
    findUnique: async (args: any) => {
      return null; // Default to not following
    },
    findMany: async (args?: any) => {
      return []; // Default to no followers
    },
    create: async (args: any) => {
      return {
        id: 'new-mock-follow',
        ...args.data
      };
    },
    delete: async (args: any) => {
      return {
        id: 'deleted-mock-follow',
        ...args.where
      };
    },
    count: async (args: any) => {
      return 0; // Default count
    }
  };

  // Mock for any additional models you may need
  profile = {
    findUnique: async (args: any) => {
      return {
        id: 'mock-profile-id',
        userId: args.where.userId,
        displayName: 'Mock User',
        avatarUrl: `https://i.pravatar.cc/150?u=${args.where.userId}`,
        bio: 'This is a mock user profile for development.'
      };
    },
    findMany: async (args?: any) => {
      return [];
    },
    create: async (args: any) => {
      return {
        id: 'new-mock-profile',
        ...args.data
      };
    },
    update: async (args: any) => {
      return {
        id: args.where.id,
        ...args.data
      };
    }
  };
}

export const mockPrisma = new MockPrismaClient();
