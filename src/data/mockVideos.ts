
import { VideoMetadata } from '@/components/creator/VideoUploader';

// Mock video data
export const initialVideos: VideoMetadata[] = [
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
    isPremium: false
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
    restrictions: {
      tier: 'vip',
      sharingAllowed: false,
      downloadsAllowed: false
    }
  }
];
