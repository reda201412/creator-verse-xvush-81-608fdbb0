
// This is a client-side mock for @prisma/client to prevent issues in the browser

// Define types for our mock client
interface MockPrismaClient {
  video: {
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };
  // Add other models as needed
}

const clientPrismaMock: MockPrismaClient = {
  video: {
    findMany: (args?: any) => Promise.resolve([]),
    create: (args: any) => Promise.resolve(args.data),
    update: (args: any) => Promise.resolve(args.data),
    delete: (args: any) => Promise.resolve(args.where),
  },
  // Add other model mocks as needed
};

export default clientPrismaMock;

// Also export a PrismaClient type for compatibility
export type PrismaClient = MockPrismaClient;
