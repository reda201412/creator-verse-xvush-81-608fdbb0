
// This file uses an adapted version of the Prisma client for the browser

// Import from our client-prisma mock instead of direct @prisma/client import
import type { PrismaClient as PrismaClientType } from '../lib/client-prisma';

// Global type declaration for maintaining connection between hot reloads
declare global {
  var prisma: PrismaClientType | undefined;
}

// Alternative dynamic import approach compatible with ESM
const getPrismaClient = async (): Promise<PrismaClientType> => {
  try {
    // Use relative path to our client mock instead
    const { default: clientPrismaMock } = await import('../lib/client-prisma');
    return clientPrismaMock;
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
