
// This file provides a Prisma client instance that works in both server and browser environments
import clientPrisma from './client-prisma';

// For TypeScript type safety, create a type for PrismaClient
interface CustomPrismaClient {
  video: {
    findMany: (args: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
  };
  user?: any;
  profile?: any;
  [key: string]: any;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a mock Prisma client for browser environments
const mockPrismaClient: CustomPrismaClient = {
  video: {
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: 1, ...args.data }),
    update: async (args: any) => ({ id: 1, ...args.data }),
    delete: async (args: any) => ({ id: 1 }),
    findUnique: async (args: any) => null
  },
  user: {},
  profile: {}
};

// Export a concrete prisma client directly to avoid Promise-related issues
export const prisma = isBrowser 
  ? clientPrisma as unknown as CustomPrismaClient
  : mockPrismaClient;

// For backward compatibility
export default prisma;
