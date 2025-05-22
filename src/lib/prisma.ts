// This file provides a Prisma client instance that works in both server and browser environments
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import clientPrisma from './client-prisma';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use a function to handle async initialization
const initPrisma = async (): Promise<PrismaClientType> => {
  if (isBrowser) {
    // In browser, use our mock client
    return clientPrisma as unknown as PrismaClientType;
  }
  
  // In Node.js, use the real Prisma client
  const { PrismaClient } = await import('@prisma/client');
  
  // Use a singleton pattern to prevent multiple instances
  const globalForPrisma = global as unknown as {
    prisma: PrismaClientType | undefined;
  };

  const client = globalForPrisma.prisma ?? new PrismaClient();

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  // Clean up on exit (server-side only)
  process.on('beforeExit', async () => {
    if (client) {
      await client.$disconnect();
    }
  });

  return client;
};

// Initialize prisma and export a promise that resolves to the client
const prismaPromise = initPrisma();

// For backward compatibility, export the promise directly
export const prisma = prismaPromise;

export default prisma;
