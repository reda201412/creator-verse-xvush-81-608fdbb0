
// This file provides a Prisma client instance that works in both server and browser environments
import clientPrisma from './client-prisma';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use a function to handle async initialization
const initPrisma = async (): Promise<any> => {
  if (isBrowser) {
    // In browser, use our mock client
    return clientPrisma as any;
  }
  
  try {
    // In Node.js, use the real Prisma client
    // Use dynamic import to avoid client-side bundling of the full Prisma client
    const prismaModule = await import('@prisma/client');
    
    // Extract the PrismaClient constructor using different approaches
    let PrismaClient: any;
    
    // Try different ways of accessing PrismaClient based on how it might be exported
    if (prismaModule && typeof prismaModule === 'object') {
      // First check if it's directly exported
      if ('PrismaClient' in prismaModule && typeof prismaModule.PrismaClient === 'function') {
        PrismaClient = prismaModule.PrismaClient;
      } 
      // Then check if it's in the default export
      else if (prismaModule.default && 
              typeof prismaModule.default === 'object' && 
              'PrismaClient' in prismaModule.default &&
              typeof prismaModule.default.PrismaClient === 'function') {
        PrismaClient = prismaModule.default.PrismaClient;
      }
      // Just use any available constructor function as a last resort
      else {
        const possibleClient = Object.values(prismaModule).find(
          (val: any) => typeof val === 'function' && val.name === 'PrismaClient'
        );
        if (possibleClient) {
          PrismaClient = possibleClient;
        }
      }
    }
    
    if (!PrismaClient) {
      throw new Error('Could not find PrismaClient in the imported module');
    }
    
    // Use a singleton pattern to prevent multiple instances
    const globalForPrisma = global as unknown as {
      prisma: any | undefined;
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
  } catch (error) {
    console.error("Error initializing Prisma client:", error);
    // Fall back to client prisma if there's an error loading the server version
    return clientPrisma as any;
  }
};

// Initialize prisma and export a promise that resolves to the client
const prismaPromise = initPrisma();

// For backward compatibility, export the promise directly
export const prisma = prismaPromise;

export default prisma;
