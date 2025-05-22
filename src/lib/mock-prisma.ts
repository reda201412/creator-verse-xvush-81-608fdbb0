// Mock Prisma Client for testing
import { PrismaClient } from '@prisma/client';

// Create a type-safe mock of the Prisma Client
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type User = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  bio: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Video = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  duration: number;
  isPublished: boolean;
  ownerId: string;
  assetId: string | null;
  playbackId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserCreateInput = {
  data: Partial<User>;
};

type UpdateInput<T> = {
  where: { id: string };
  data: Partial<T>;
};

type MockPrismaClient = DeepPartial<PrismaClient> & {
  $reset: () => void;
};

// Mock data
const mockUser: User = {
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

const mockVideo: Video = {
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

// Create a mock implementation of Prisma Client
export function createMockPrismaClient(): MockPrismaClient {
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
      create: async (data: UserCreateInput) => ({
        ...mockUser,
        ...data.data,
        id: 'new-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async ({ where, data }: UpdateInput<User>) => ({
        ...mockUser,
        ...where,
        ...data,
        updatedAt: new Date(),
      }),
      delete: async () => mockUser,
      count: async () => 1,
    },

    video: {
      findUnique: async () => mockVideo,
      findMany: async () => [mockVideo],
      create: async (data: { data: Partial<Video> }) => ({
        ...mockVideo,
        ...data.data,
        id: 'new-video-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async ({ where, data }: UpdateInput<Video>) => ({
        ...mockVideo,
        ...where,
        ...data,
        updatedAt: new Date(),
      }),
      delete: async () => mockVideo,
      count: async () => 1,
    },

    // Add other models as needed...
    conversation: {
      findUnique: async () => ({} as Record<string, unknown>),
      findMany: async () => [],
      create: async () => ({} as Record<string, unknown>),
      update: async () => ({} as Record<string, unknown>),
      delete: async () => ({} as Record<string, unknown>),
      count: async () => 0,
    },

    message: {
      findUnique: async () => ({} as Record<string, unknown>),
      findMany: async () => [],
      create: async () => ({} as Record<string, unknown>),
      update: async () => ({} as Record<string, unknown>),
      delete: async () => ({} as Record<string, unknown>),
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
const prismaMock = createMockPrismaClient();

// Export the mock Prisma client
export { prismaMock };
export default prismaMock;
