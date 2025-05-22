
// Mock Prisma client for browser environments
const clientPrisma = {
  video: {
    findMany: async (args: any) => {
      console.log('Mock findMany called with', args);
      return [];
    },
    findUnique: async (args: any) => {
      console.log('Mock findUnique called with', args);
      return null;
    },
    create: async (args: any) => {
      console.log('Mock create called with', args);
      return { id: 'mock-id', ...args.data };
    },
    update: async (args: any) => {
      console.log('Mock update called with', args);
      return { id: args.where.id, ...args.data };
    },
    delete: async (args: any) => {
      console.log('Mock delete called with', args);
      return { id: args.where.id };
    }
  }
};

export default clientPrisma;
