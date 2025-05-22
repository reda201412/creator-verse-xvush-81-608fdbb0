
// Mock implementation for Prisma Client
import clientPrisma from './client-prisma';

// Create a mock implementation that simulates Prisma's API structure
const mockPrisma = {
  video: {
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({ id: args.where.id }),
    findUnique: async (args: any) => null
  },
  user: {
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock-user-id', ...args.data })
  },
  profile: {
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock-profile-id', ...args.data })
  }
};

// Export the client Prisma mock for browser environments
export default mockPrisma;
