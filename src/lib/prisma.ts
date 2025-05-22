
// This file provides a Prisma client instance that works in both server and browser environments
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import clientPrisma from './client-prisma';

// For TypeScript type safety, create a type for PrismaClient
interface CustomPrismaClient {
  video?: any;
  user?: any;
  profile?: any;
  [key: string]: any;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use a function to handle async initialization
const initPrisma = async (): Promise<CustomPrismaClient> => {
  if (isBrowser) {
    // In browser, use our mock client
    return clientPrisma as unknown as CustomPrismaClient;
  }
  
  try {
    // In Node.js, try to use the real Prisma client
    // We use dynamic import to prevent webpack from trying to bundle this
    const { default: prismaModule } = await import('@prisma/client');
    
    // Use a singleton pattern to prevent multiple instances
    const globalForPrisma = global as unknown as {
      prisma: CustomPrismaClient | undefined;
    };

    // If PrismaClient is available, use it
    if (prismaModule?.PrismaClient) {
      const client = globalForPrisma.prisma ?? new prismaModule.PrismaClient();

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }

      // Clean up on exit (server-side only)
      process.on('beforeExit', async () => {
        if (client.$disconnect) {
          await client.$disconnect();
        }
      });

      return client;
    }
    
    // If PrismaClient is not available, fallback to mock
    return clientPrisma as unknown as CustomPrismaClient;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    // Fallback to mock client if real PrismaClient fails to load
    return clientPrisma as unknown as CustomPrismaClient;
  }
};

// Initialize prisma and export a promise that resolves to the client
const prismaPromise = initPrisma();

// For backward compatibility, export the promise directly
export const prisma = prismaPromise;

export default prisma;
