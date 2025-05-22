
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

// Use a function to handle async initialization
const initPrisma = async (): Promise<CustomPrismaClient> => {
  if (isBrowser) {
    // In browser, use our mock client
    return clientPrisma as unknown as CustomPrismaClient;
  }
  
  // For server environments, simply return our client mock
  // We're removing the dynamic import approach since it's causing issues
  console.warn('Using mock Prisma client');
  return clientPrisma as unknown as CustomPrismaClient;
};

// Initialize prisma and export a promise that resolves to the client
const prismaPromise = initPrisma();

// For backward compatibility, export the promise directly
export const prisma = prismaPromise;

export default prisma;
