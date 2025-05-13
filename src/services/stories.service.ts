
import { Story } from '@/types/stories';
import { Timestamp } from 'firebase/firestore';

// Mock story data for development
const mockStories: Story[] = [
  {
    id: "1",
    creator_id: "creator1",
    media_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    thumbnail_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200",
    duration: 5,
    created_at: new Date().toISOString(),
    viewed: false,
    view_count: 0,
    caption: "Beautiful mountain landscape",
    filter_used: "none",
    is_highlighted: true,
    tags: [{ id: "1", tag_name: "nature" }, { id: "2", tag_name: "mountains" }],
    creator: {
      id: "creator1",
      username: "nature.lover",
      display_name: "Nature Photography",
      avatar_url: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: "2",
    creator_id: "creator2",
    media_url: "https://images.unsplash.com/photo-1494253109108-2e30c049369b",
    thumbnail_url: "https://images.unsplash.com/photo-1494253109108-2e30c049369b?w=200",
    duration: 7,
    created_at: new Date().toISOString(),
    viewed: false,
    view_count: 0,
    caption: "Sunset on the beach",
    filter_used: "warm",
    is_highlighted: false,
    tags: [{ id: "3", tag_name: "sunset" }, { id: "4", tag_name: "beach" }],
    creator: {
      id: "creator2",
      username: "beach.vibes",
      display_name: "Beach Life",
      avatar_url: "https://i.pravatar.cc/150?img=4"
    }
  }
];

/**
 * Get stories for a specific user
 */
export const getStoriesForUser = async (userId: string): Promise<Story[]> => {
  // Add a mock story for the current user if they exist
  const userStories = mockStories.map(story => {
    if (story.creator_id === userId) {
      return { ...story, creator_id: userId };
    }
    return story;
  });

  // In a real implementation, this would fetch stories from a database
  return Promise.resolve(userStories);
};

/**
 * Mark a story as viewed
 */
export const markStoryAsViewed = async (userId: string, storyId: string, viewDuration?: number): Promise<void> => {
  console.log(`User ${userId} viewed story ${storyId} for ${viewDuration || 'unknown'} seconds`);
  // In a real implementation, this would update the story's view status in a database
  return Promise.resolve();
};

/**
 * Create a new story
 */
export const createStory = async (story: Partial<Story>): Promise<Story> => {
  const newStory: Story = {
    id: `story-${Date.now()}`,
    creator_id: story.creator_id || '',
    media_url: story.media_url || '',
    thumbnail_url: story.thumbnail_url || '',
    duration: story.duration || 5,
    created_at: new Date().toISOString(),
    viewed: false,
    view_count: 0,
    caption: story.caption || '',
    filter_used: story.filter_used || 'none',
    is_highlighted: story.is_highlighted || false,
    tags: story.tags || [],
    creator: story.creator || {
      id: '',
      username: '',
      display_name: '',
      avatar_url: ''
    }
  };

  // In a real implementation, this would save the story to a database
  return Promise.resolve(newStory);
};
