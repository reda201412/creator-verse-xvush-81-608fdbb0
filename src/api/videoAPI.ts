
import { ContentType, FreeVideoResponse } from '@/types/content';
import { VideoMetadata } from '@/components/creator/VideoUploader';

// Sample data - in a real app this would come from a database
const sampleVideos: VideoMetadata[] = [
  {
    id: 'video-1',
    title: 'Morning Routine - Behind the scenes',
    description: 'Découvrez ma routine matinale et mes secrets pour bien commencer la journée.',
    type: 'premium',
    videoFile: new File([], 'video1.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: true,
    tokenPrice: 50,
    shareable: false,
    restrictions: {
      tier: 'fan',
      sharingAllowed: true,
      downloadsAllowed: false
    }
  },
  {
    id: 'video-2',
    title: 'Xtease - Spring Collection Preview',
    description: 'Un aperçu exclusif de ma collection de printemps.',
    type: 'teaser',
    videoFile: new File([], 'video2.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
    format: '9:16',
    isPremium: true,
    tokenPrice: 25,
    shareable: true,
    restrictions: {
      tier: 'free',
      sharingAllowed: true,
      downloadsAllowed: false
    }
  },
  {
    id: 'video-3',
    title: 'Mountain Hike - Full Experience',
    description: 'Accompagnez-moi pour une randonnée complète dans les montagnes.',
    type: 'standard',
    videoFile: new File([], 'video3.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: false,
    shareable: true,
  },
  {
    id: 'video-4',
    title: 'Boulangerie Tour Paris - Exclusive',
    description: 'Découvrez les meilleures boulangeries de Paris dans cette visite exclusive.',
    type: 'vip',
    videoFile: new File([], 'video4.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: true,
    tokenPrice: 150,
    shareable: false,
    restrictions: {
      tier: 'vip',
      sharingAllowed: false,
      downloadsAllowed: false
    }
  }
];

/**
 * Get free and teaser videos that can be consumed without payment
 * Route: /api/free-videos
 * Method: GET
 */
export const getFreeVideos = async (): Promise<FreeVideoResponse[]> => {
  // In a real app, this would be an API call to a backend
  // For demo purposes, we'll filter our sample data
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter for standard (free) and teaser videos
  const freeVideos = sampleVideos.filter(video => 
    video.type === 'standard' || video.type === 'teaser'
  );
  
  // Map to the expected response format
  return freeVideos.map(video => ({
    id: video.id,
    performerId: '1', // Mock creator ID
    author: 'Sophie Laurent', // Mock creator name
    performerImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop',
    thumbnail: video.thumbnailUrl,
    title: video.title,
    description: video.description,
    publishDate: new Date().toLocaleDateString('fr-FR'),
    metrics: {
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000)
    },
    type: video.type as 'standard' | 'teaser',
    shareable: video.shareable || false
  }));
};

/**
 * Mock endpoint handler that would be used in a full backend implementation
 */
export const freeVideosEndpoint = async (req: Request) => {
  // This would normally check the request method, auth tokens, etc.
  // For demo purposes we'll just return the data
  
  const videos = await getFreeVideos();
  
  return new Response(JSON.stringify(videos), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
