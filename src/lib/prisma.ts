// Ce fichier utilise une version adaptée du client Prisma pour le navigateur

// Directly importing from the generated types to avoid issues
import type { PrismaClient as PrismaClientType } from '../generated/prisma/index';

// Global type declaration for maintaining connection between hot reloads
declare global {
  var prisma: PrismaClientType | undefined;
}

// Alternative dynamic import approach compatible with ESM
const getPrismaClient = async (): Promise<PrismaClientType> => {
  try {
    const { PrismaClient } = await import('../generated/prisma/index.js');
    return new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  } catch (error) {
    console.error("Error importing PrismaClient:", error);
    // Fallback to empty client for browser environments
    return {} as PrismaClientType;
  }
};

// Lazy-initialize the client
let prismaClientInstance: PrismaClientType | undefined = globalThis.prisma;

export const prisma: PrismaClientType = prismaClientInstance || (async () => {
  const client = await getPrismaClient();
  // In development, keep the client in the global object for connection reuse
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client;
  }
  prismaClientInstance = client;
  return client;
})() as unknown as PrismaClientType;

export type { PrismaClientType as PrismaClient };
