import { PrismaClient } from '@prisma/client';

// Create a type-safe mock of the Prisma Client
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type MockPrismaClient = DeepPartial<PrismaClient> & {
  $reset: () => void;
};

// Create a mock implementation of Prisma Client
export function createMockPrismaClient(): MockPrismaClient {
  // Mock data
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: new Date(),
    image: null,
    bio: null,
    website: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVideo = {
    id: 'video-1',
    title: 'Test Video',
    description: 'Test Description',
    url: 'https://example.com/video.mp4',
    thumbnailUrl: null,
    duration: 120,
    isPublished: true,
    ownerId: 'user-1',
    assetId: 'asset-1',
    playbackId: 'playback-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock Prisma Client methods
  const mockPrisma: MockPrismaClient = {
    // Connection methods
    $connect: async () => {},
    $disconnect: async () => {},
    $on: () => {},
    $use: () => {},
    $transaction: async (fn) => {
      if (typeof fn === 'function') {
        return fn(mockPrisma);
      }
      return Promise.all(fn);
    },
    $queryRaw: async () => [],
    $executeRaw: async () => 0,

    // Model mocks
    user: {
      findUnique: async () => mockUser,
      findMany: async () => [mockUser],
      create: async (data: any) => ({
        ...mockUser,
        ...data.data,
        id: 'new-user-id',
      }),
      update: async ({ where, data }: any) => ({
        ...mockUser,
        ...where,
        ...data,
      }),
      delete: async () => mockUser,
      count: async () => 1,
    },

    video: {
      findUnique: async () => mockVideo,
      findMany: async () => [mockVideo],
      create: async (data: any) => ({
        ...mockVideo,
        ...data.data,
        id: 'new-video-id',
      }),
      update: async ({ where, data }: any) => ({
        ...mockVideo,
        ...where,
        ...data,
      }),
      delete: async () => mockVideo,
      count: async () => 1,
    },

    // Add other models as needed...
    conversation: {
      findUnique: async () => ({}),
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      count: async () => 0,
    },

    message: {
      findUnique: async () => ({}),
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
      count: async () => 0,
    },

    // Reset function to restore all mocks
    $reset: () => {
      // Recreate the mock instance
      const newMock = createMockPrismaClient();
      Object.assign(mockPrisma, newMock);
    },
  };

  return mockPrisma;
}

// Create a singleton instance
export const prismaMock = createMockPrismaClient();

// Default export for convenience
export default prismaMock;
