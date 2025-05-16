
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import Mux from '@mux/mux-node';
import type { Video } from '@prisma/client';

// Initialize Mux client
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Video | Video[] | { error: string }>
) {
  // Authenticate request
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { videoId } = req.body;

      // If videoId is provided, sync just that one video
      if (videoId) {
        const video = await prisma.video.findUnique({
          where: { id: videoId }
        });

        if (!video || video.userId !== user.uid) {
          return res.status(404).json({ error: 'Video not found' });
        }

        // If video has muxAssetId, check its status
        if (video.muxAssetId) {
          const asset = await muxClient.video.assets.retrieve(video.muxAssetId);
          
          // Update video status and playbackId
          const updatedVideo = await prisma.video.update({
            where: { id: videoId },
            data: {
              status: asset.status,
              muxPlaybackId: asset.playback_ids && asset.playback_ids.length > 0 
                ? asset.playback_ids[0].id 
                : video.muxPlaybackId
            }
          });
          
          return res.status(200).json(updatedVideo);
        } else {
          return res.status(400).json({ error: 'Video has no Mux asset ID' });
        }
      } else {
        // Sync all processing videos for the user
        const processingVideos = await prisma.video.findMany({
          where: { 
            userId: user.uid,
            status: 'processing',
            muxAssetId: { not: null }
          }
        });

        if (processingVideos.length === 0) {
          return res.status(200).json([]);
        }

        const updatedVideos = [];
        for (const video of processingVideos) {
          try {
            if (!video.muxAssetId) continue;
            
            const asset = await muxClient.video.assets.retrieve(video.muxAssetId);
            const updatedVideo = await prisma.video.update({
              where: { id: video.id },
              data: {
                status: asset.status,
                muxPlaybackId: asset.playback_ids && asset.playback_ids.length > 0 
                  ? asset.playback_ids[0].id 
                  : video.muxPlaybackId
              }
            });
            updatedVideos.push(updatedVideo);
          } catch (error) {
            console.error(`Error syncing video ${video.id}:`, error);
          }
        }

        return res.status(200).json(updatedVideos);
      }
    } catch (error) {
      console.error('Error syncing video status:', error);
      return res.status(500).json({ error: 'Failed to sync video status' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
