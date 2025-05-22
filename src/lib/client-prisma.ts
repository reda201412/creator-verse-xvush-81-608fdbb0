
// Mock implementation of Prisma client for browser environments

// Create types similar to what Prisma would generate
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other fields as needed
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status?: string;
  // Add other fields as needed
}

// Create a mock client
const clientPrisma = {
  user: {
    findUnique: async ({ where }: { where: any }) => {
      console.log('Mock findUnique user:', where);
      return null;
    },
    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any }) => {
      console.log('Mock findMany users:', { where, orderBy });
      return [];
    },
    create: async ({ data }: { data: any }) => {
      console.log('Mock create user:', data);
      return { id: 'mock-id', ...data };
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      console.log('Mock update user:', { where, data });
      return { id: where.id, ...data };
    },
    delete: async ({ where }: { where: any }) => {
      console.log('Mock delete user:', where);
      return { id: where.id };
    },
    count: async ({ where }: { where?: any }) => {
      return 0;
    },
  },
  
  video: {
    findUnique: async ({ where }: { where: any }) => {
      console.log('Mock findUnique video:', where);
      return null;
    },
    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any }) => {
      console.log('Mock findMany videos:', { where, orderBy });
      return [];
    },
    create: async ({ data }: { data: any }) => {
      console.log('Mock create video:', data);
      return { id: 1, ...data };
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      console.log('Mock update video:', { where, data });
      return { id: where.id, ...data };
    },
    delete: async ({ where }: { where: any }) => {
      console.log('Mock delete video:', where);
      return { id: where.id };
    },
    count: async ({ where }: { where?: any }) => {
      return 0;
    },
  },
  
  profile: {
    findUnique: async ({ where }: { where: any }) => {
      console.log('Mock findUnique profile:', where);
      return null;
    },
    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any }) => {
      console.log('Mock findMany profiles:', { where, orderBy });
      return [];
    },
    create: async ({ data }: { data: any }) => {
      console.log('Mock create profile:', data);
      return { id: 'mock-profile-id', ...data };
    },
    update: async ({ where, data }: { where: any; data: any }) => {
      console.log('Mock update profile:', { where, data });
      return { id: where.id, ...data };
    },
  },
  
  // Additional models can be added here as needed
  
  // Connection utilities (mock implementations)
  $connect: async () => {},
  $disconnect: async () => {},
  $transaction: async (fn: any) => fn(clientPrisma),
};

export default clientPrisma;
