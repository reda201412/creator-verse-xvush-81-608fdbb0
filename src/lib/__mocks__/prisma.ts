
// Create a type-safe mock of the Prisma Client
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Define the types for the entities
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

interface MockPrismaClient {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $on: (event: string, callback: (e: unknown) => void) => void;
  $use: (fn: unknown) => void;
  $transaction: <T>(fn: (prisma: MockPrismaClient) => Promise<T>) => Promise<T>;
  $queryRaw: () => Promise<unknown[]>;
  $executeRaw: () => Promise<number>;
  
  user: {
    findUnique: (args: { where: { id: string } }) => Promise<User | null>;
    findMany: () => Promise<User[]>;
    create: (args: { data: Partial<User> }) => Promise<User>;
    update: (args: { where: { id: string }; data: Partial<User> }) => Promise<User>;
    delete: (args: { where: { id: string } }) => Promise<User>;
    count: () => Promise<number>;
  };
  
  video: {
    findUnique: (args: { where: { id: string } }) => Promise<Video | null>;
    findMany: () => Promise<Video[]>;
    create: (args: { data: Omit<Partial<Video>, 'id'> }) => Promise<Video>;
    update: (args: { where: { id: string }; data: Partial<Video> }) => Promise<Video>;
    delete: (args: { where: { id: string } }) => Promise<Video>;
    count: () => Promise<number>;
  };
  
  // Add other models as needed
  [key: string]: unknown;
}

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
const clientPrismaMock: MockPrismaClient = {
  // Connection methods
  $connect: async () => {},
  $disconnect: async () => {},
  $on: () => {},
  $use: () => {},
  $transaction: async <T>(fn: (prisma: MockPrismaClient) => Promise<T>): Promise<T> => {
    return fn(clientPrismaMock);
  },
  $queryRaw: async () => [],
  $executeRaw: async () => 0,
  
  // Model mocks
  user: {
    findUnique: async () => mockUser,
    findMany: async () => [mockUser],
    create: async (data) => ({
      ...mockUser,
      ...data.data,
      id: 'new-user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async ({ where, data }) => ({
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
    create: async (data) => ({
      ...mockVideo,
      ...data.data,
      id: 'new-video-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async ({ where, data }) => ({
      ...mockVideo,
      ...where,
      ...data,
      updatedAt: new Date(),
    }),
    delete: async () => mockVideo,
    count: async () => 1,
  },
  
  // Add other model mocks as needed
};

// Create a singleton instance
const prisma = clientPrismaMock;

// Export for tests
export const prismaMock = clientPrismaMock;

// Export the singleton instance
export default prisma;

// Export a type for PrismaClient
export type PrismaClient = typeof prisma;
