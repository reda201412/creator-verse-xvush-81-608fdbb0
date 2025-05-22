
// Fix the import to use the default export
import mockPrisma from '@/lib/mock-prisma';

// Define authentication service methods
export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  // Mock implementation
  console.log('Signing up with email and password');
  return { user: { uid: 'mock-user-id', email } };
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  // Mock implementation
  console.log('Signing in with email and password');
  return { user: { uid: 'mock-user-id', email } };
};

export const signOut = async () => {
  // Mock implementation
  console.log('Signing out');
  return true;
};

export const resetPassword = async (email: string) => {
  // Mock implementation
  console.log('Resetting password for email', email);
  return true;
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  // Mock implementation
  console.log('Updating user profile', userId, profileData);
  return { id: userId, ...profileData };
};
