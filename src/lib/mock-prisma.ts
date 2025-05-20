
export class MockPrismaClient {
  user = {
    findUnique: async () => ({ id: 'mock-user-id', name: 'Mock User' }),
    findMany: async () => [{ id: 'mock-user-id', name: 'Mock User' }],
    create: async (data: any) => ({ id: 'mock-user-id', ...data }),
    update: async (data: any) => ({ id: 'mock-user-id', ...data }),
    delete: async () => ({ id: 'mock-user-id' }),
  };
  
  follow = {
    findUnique: async () => ({ id: 'mock-follow-id' }),
    findMany: async () => [{ id: 'mock-follow-id' }],
    create: async (data: any) => ({ id: 'mock-follow-id', ...data }),
    update: async (data: any) => ({ id: 'mock-follow-id', ...data }),
    delete: async () => ({ id: 'mock-follow-id' }),
    count: async () => 5,
  };
  
  video = {
    findUnique: async () => ({ id: 'mock-video-id' }),
    findMany: async () => [{ id: 'mock-video-id' }],
    create: async (data: any) => ({ id: 'mock-video-id', ...data }),
    update: async (data: any) => ({ id: 'mock-video-id', ...data }),
    delete: async () => ({ id: 'mock-video-id' }),
  };
}

const db = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({
        exists: true,
        id,
        data: () => ({
          id,
          name: `Mock ${name} ${id}`,
          createdAt: new Date(),
        }),
      }),
      set: async (data: any) => Promise.resolve(),
      update: async (data: any) => Promise.resolve(),
      delete: async () => Promise.resolve(),
    }),
    where: () => ({
      get: async () => ({
        docs: [],
        empty: true,
      }),
    }),
  }),
};

const mockPrismaClient = new MockPrismaClient();

export default mockPrismaClient;
