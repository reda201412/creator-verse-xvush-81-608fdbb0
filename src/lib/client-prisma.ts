
/**
 * This file provides a mock Prisma client for browser environments
 * It's a simplified implementation that mimics Prisma's API structure,
 * but actually just uses localStorage for persistence.
 */

// Mock PrismaClient for client-side use
const clientPrisma = {
  // Video operations
  video: {
    findUnique: async ({ where }) => {
      try {
        const videos = JSON.parse(localStorage.getItem('mock_videos') || '[]');
        return videos.find(v => v.id === where.id) || null;
      } catch (error) {
        console.error('Error in mock findUnique:', error);
        return null;
      }
    },
    findMany: async ({ where, orderBy } = {}) => {
      try {
        let videos = JSON.parse(localStorage.getItem('mock_videos') || '[]');
        
        // Apply filters if where is provided
        if (where) {
          if (where.userId) {
            videos = videos.filter(v => v.userId === where.userId);
          }
          if (where.status) {
            videos = videos.filter(v => v.status === where.status);
          }
        }
        
        // Apply sorting if orderBy is provided
        if (orderBy) {
          const [field, direction] = Object.entries(orderBy)[0];
          videos.sort((a, b) => {
            if (direction === 'asc') {
              return a[field] > b[field] ? 1 : -1;
            } else {
              return a[field] < b[field] ? 1 : -1;
            }
          });
        }
        
        return videos;
      } catch (error) {
        console.error('Error in mock findMany:', error);
        return [];
      }
    },
    create: async ({ data }) => {
      try {
        const videos = JSON.parse(localStorage.getItem('mock_videos') || '[]');
        const newId = Math.max(0, ...videos.map(v => v.id)) + 1;
        
        const newVideo = {
          id: newId,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        videos.push(newVideo);
        localStorage.setItem('mock_videos', JSON.stringify(videos));
        
        return newVideo;
      } catch (error) {
        console.error('Error in mock create:', error);
        throw error;
      }
    },
    update: async ({ where, data }) => {
      try {
        const videos = JSON.parse(localStorage.getItem('mock_videos') || '[]');
        const index = videos.findIndex(v => v.id === where.id);
        
        if (index === -1) throw new Error('Video not found');
        
        const updatedVideo = {
          ...videos[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        videos[index] = updatedVideo;
        localStorage.setItem('mock_videos', JSON.stringify(videos));
        
        return updatedVideo;
      } catch (error) {
        console.error('Error in mock update:', error);
        throw error;
      }
    },
    delete: async ({ where }) => {
      try {
        const videos = JSON.parse(localStorage.getItem('mock_videos') || '[]');
        const index = videos.findIndex(v => v.id === where.id);
        
        if (index === -1) throw new Error('Video not found');
        
        const deletedVideo = videos[index];
        videos.splice(index, 1);
        localStorage.setItem('mock_videos', JSON.stringify(videos));
        
        return deletedVideo;
      } catch (error) {
        console.error('Error in mock delete:', error);
        throw error;
      }
    },
  },

  // User operations
  user: {
    findUnique: async ({ where }) => {
      try {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        return users.find(u => u.id === where.id || u.email === where.email) || null;
      } catch (error) {
        console.error('Error in mock user findUnique:', error);
        return null;
      }
    },
    update: async ({ where, data }) => {
      try {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const index = users.findIndex(u => u.id === where.id || u.email === where.email);
        
        if (index === -1) throw new Error('User not found');
        
        const updatedUser = {
          ...users[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        users[index] = updatedUser;
        localStorage.setItem('mock_users', JSON.stringify(users));
        
        return updatedUser;
      } catch (error) {
        console.error('Error in mock user update:', error);
        throw error;
      }
    },
  },
  
  // Helper function to close connection (no-op for mock)
  $disconnect: async () => {
    return Promise.resolve();
  },
};

export default clientPrisma;
