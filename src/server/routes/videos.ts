
import express from 'express';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseToken } from '../middleware/auth';

const router = express.Router();

// Middleware to verify authentication
router.use(verifyFirebaseToken);

// Get all videos for the authenticated creator
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const videos = await prisma.video.findMany({
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
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, assetId, uploadId } = req.body;

    if (!title || !assetId || !uploadId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || '',
        status: 'processing',
        assetId,
        uploadId,
        userId,
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

module.exports = router;
