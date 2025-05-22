
import express from 'express';
import prisma from '@/lib/prisma';

const router = express.Router();

// Define custom user type
interface RequestWithUser extends express.Request {
  user?: {
    uid: string;
    email?: string;
  };
}

// Import middleware
import { verifyFirebaseToken } from '../middleware/auth';

// Middleware to verify authentication
router.use(verifyFirebaseToken);

// Get all videos for the authenticated creator
router.get('/', async (req: RequestWithUser, res: express.Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const prismaInstance = await prisma;
    const videos = await prismaInstance.video.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new video record
router.post('/', async (req: RequestWithUser, res: express.Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract all required and optional fields from request body
    const { 
      title, 
      description, 
      assetId, 
      uploadId,
      playbackId,
      status = 'processing',
      duration,
      aspectRatio,
      thumbnailUrl,
      videoUrl,
      isPremium = false,
      price,
      isPublished = false,
      type = 'standard'
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Missing required field: title' });
    }

    const prismaInstance = await prisma;
    
    // Create video record with all metadata
    const video = await prismaInstance.video.create({
      data: {
        userId,
        title,
        description: description || '',
        status,
        assetId,
        mux_asset_id: assetId,
        uploadId,
        mux_upload_id: uploadId,
        playbackId,
        mux_playback_id: playbackId,
        duration,
        aspectRatio,
        aspect_ratio: aspectRatio,
        thumbnailUrl,
        thumbnail_url: thumbnailUrl,
        videoUrl,
        video_url: videoUrl,
        isPremium,
        is_premium: isPremium,
        price,
        token_price: price,
        isPublished,
        type,
      },
    });

    return res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return res.status(500).json({ 
      error: 'Failed to create video',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
