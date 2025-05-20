
// Mock implementation for authService
import { MockPrismaClient } from '@/lib/mock-prisma';
import { User } from '@/types/video';

// Create a mock prisma client with user property
const mockPrisma = {
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null
  }
} as any;

const authService = {
  // Fix the user access issues
  findUserByEmail: async (email: string) => {
    try {
      return mockPrisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },
  
  // Fix other methods as well
  createUser: async (userData: Partial<User>) => {
    try {
      return mockPrisma.user.create({
        data: userData
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },
  
  updateUser: async (userId: string, userData: Partial<User>) => {
    try {
      return mockPrisma.user.update({
        where: { id: userId },
        data: userData
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }
};

export default authService;
