
// This file should contain all the functions related to creator operations

import db from '@/lib/mock-prisma';
import { TrendingContentItem } from '@/types/trending';

export interface CreatorProfileData {
  id: string;
  user_id: string;
  userId: string;
  uid: string;
  username: string;
  name: string;
  displayName: string;
  bio?: string;
  avatarUrl: string;
  coverImageUrl?: string;
  isPremium?: boolean;
  isOnline?: boolean;
  metrics?: {
    followers?: number;
    likes?: number;
    rating?: number;
  };
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  sort?: 'asc' | 'desc';
}

// Get all creators with optional pagination
export async function getAllCreators(options: PaginationOptions = {}): Promise<CreatorProfileData[]> {
  try {
    // Mock data for creators
    const mockCreators: CreatorProfileData[] = Array.from({ length: 15 }).map((_, index) => ({
      id: `creator-${index + 1}`,
      user_id: `user-${index + 1}`,
      userId: `user-${index + 1}`,
      uid: `user-${index + 1}`,
      username: `creator${index + 1}`,
      name: `Creator ${index + 1}`,
      displayName: `Creator ${index + 1}`,
      bio: index % 3 === 0 ? `This is the bio for Creator ${index + 1}` : undefined,
      avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,
      coverImageUrl: index % 2 === 0 ? `https://picsum.photos/seed/${index + 1}/800/300` : undefined,
      isPremium: index % 5 === 0,
      isOnline: index % 4 === 0,
      metrics: {
        followers: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 50000),
        rating: 3 + Math.random() * 2
      }
    }));

    // Apply pagination if options are provided
    const { page = 1, limit = 10, orderBy = 'followers', sort = 'desc' } = options;
    
    let results = [...mockCreators];
    
    // Sort the results
    if (orderBy === 'followers') {
      results.sort((a, b) => {
        const aValue = a.metrics?.followers || 0;
        const bValue = b.metrics?.followers || 0;
        return sort === 'desc' ? bValue - aValue : aValue - bValue;
      });
    } else if (orderBy === 'rating') {
      results.sort((a, b) => {
        const aValue = a.metrics?.rating || 0;
        const bValue = b.metrics?.rating || 0;
        return sort === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    results = results.slice(startIndex, endIndex);
    
    return results;
  } catch (error) {
    console.error('Error getting creators:', error);
    return [];
  }
}

// Get trending creators
export async function getTrendingCreators(limit: number = 5): Promise<CreatorProfileData[]> {
  try {
    // Return a subset of all creators, assuming they're "trending"
    const allCreators = await getAllCreators();
    return allCreators
      .slice(0, limit)
      .map(creator => ({
        ...creator,
        isOnline: Math.random() > 0.5 // Randomize online status for trending
      }));
  } catch (error) {
    console.error('Error getting trending creators:', error);
    return [];
  }
}

// Get a creator by ID
export async function getCreatorById(id: string): Promise<CreatorProfileData | null> {
  try {
    if (!id) return null;
    
    // Fetch mock data - in a real app, this would query the database
    const mockCreator: CreatorProfileData = {
      id,
      user_id: id,
      userId: id,
      uid: id,
      username: `creator${id.substring(id.length - 2)}`,
      name: `Creator ${id}`,
      displayName: `Creator ${id}`,
      bio: "This is a sample bio for this creator. They make amazing content!",
      avatarUrl: `https://i.pravatar.cc/150?img=${(parseInt(id.substring(id.length - 2)) % 70) + 1}`,
      coverImageUrl: `https://picsum.photos/seed/${id}/800/300`,
      isPremium: Math.random() > 0.7,
      isOnline: Math.random() > 0.5,
      metrics: {
        followers: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 50000),
        rating: 3 + Math.random() * 2
      }
    };
    
    return mockCreator;
  } catch (error) {
    console.error(`Error getting creator with ID ${id}:`, error);
    return null;
  }
}

// Get creator's content
export async function getCreatorContent(creatorId: string): Promise<TrendingContentItem[]> {
  try {
    // Mock content items
    return Array.from({ length: 12 }).map((_, index) => ({
      id: `content-${creatorId}-${index}`,
      title: `Content ${index + 1} by Creator ${creatorId}`,
      thumbnailUrl: `https://picsum.photos/seed/${creatorId}${index}/300/200`,
      videoUrl: index % 3 === 0 ? `https://example.com/video${index}.mp4` : undefined,
      type: index % 3 === 0 ? 'video' : 'image',
      format: index % 2 === 0 ? '16:9' : '1:1',
      isPremium: index % 4 === 0
    }));
  } catch (error) {
    console.error(`Error getting content for creator ${creatorId}:`, error);
    return [];
  }
}

// Follow a creator
export async function followCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    // In a real implementation, this would create a record in the database
    console.log(`User ${userId} is now following creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
}

// Unfollow a creator
export async function unfollowCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    // In a real implementation, this would delete a record from the database
    console.log(`User ${userId} unfollowed creator ${creatorId}`);
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
}

// Check if a user follows a creator
export async function checkUserFollowsCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    // Mock implementation - randomly return true or false
    // In a real app, this would query the database
    return Math.random() > 0.5;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

// Get followers count for a creator
export async function getFollowersCount(creatorId: string): Promise<number> {
  try {
    // Mock implementation - return a random number
    // In a real app, this would count records in the database
    return Math.floor(Math.random() * 10000);
  } catch (error) {
    console.error('Error getting followers count:', error);
    return 0;
  }
}

// Get list of users following a creator
export async function getCreatorFollowers(
  creatorId: string,
  options: PaginationOptions = {}
): Promise<{ id: string; username: string; avatarUrl: string }[]> {
  try {
    // Mock data for followers
    const mockFollowers = Array.from({ length: 20 }).map((_, index) => ({
      id: `user-${index + 1}`,
      username: `user${index + 1}`,
      avatarUrl: `https://i.pravatar.cc/150?img=${index + 30}`
    }));

    // Apply pagination if options are provided
    const { page = 1, limit = 10 } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return mockFollowers.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error getting creator followers:', error);
    return [];
  }
}

// Update creator profile
export async function updateCreatorProfile(
  creatorId: string,
  profileData: Partial<CreatorProfileData>
): Promise<boolean> {
  try {
    // Mock implementation - log the update
    console.log(`Updating profile for creator ${creatorId}:`, profileData);
    return true;
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return false;
  }
}

// Get recommendations for similar creators
export async function getSimilarCreators(creatorId: string, limit: number = 3): Promise<CreatorProfileData[]> {
  try {
    // Get all creators and filter out the current one
    const allCreators = await getAllCreators();
    return allCreators
      .filter(creator => creator.id !== creatorId)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting similar creators:', error);
    return [];
  }
}

// Check if user is a creator
export async function isUserCreator(userId: string): Promise<boolean> {
  try {
    // Mock implementation - randomly return true or false
    return Math.random() > 0.3;
  } catch (error) {
    console.error('Error checking if user is creator:', error);
    return false;
  }
}

// Get creator stats
export async function getCreatorStats(creatorId: string): Promise<{
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
}> {
  try {
    // Mock implementation - return random stats
    return {
      views: Math.floor(Math.random() * 100000),
      likes: Math.floor(Math.random() * 20000),
      comments: Math.floor(Math.random() * 5000),
      shares: Math.floor(Math.random() * 3000),
      revenue: Math.floor(Math.random() * 10000) / 100
    };
  } catch (error) {
    console.error('Error getting creator stats:', error);
    return {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      revenue: 0
    };
  }
}

// Get mock DB instance
export { db };
