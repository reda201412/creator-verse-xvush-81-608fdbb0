
import express from 'express';
import Mux from '@mux/mux-node';
import { verifyFirebaseToken } from '../middleware/auth';
import { processWebhookRequest } from '../../lib/mux-webhooks';

const router = express.Router();

// Initialize Mux client
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || '',
});

// Create a direct upload URL
router.post('/upload', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Create a direct upload
    const upload = await muxClient.video.uploads.create({
      cors_origin: req.headers.origin || '*',
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
    });

    // Return upload details
    return res.json({
      id: upload.id,
      url: upload.url,
      assetId: upload.asset_id,
      status: upload.status,
    });
  } catch (error) {
    console.error('Error creating MUX upload:', error);
    return res.status(500).json({ 
      error: 'Failed to create upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Handle Mux webhooks
router.post('/webhooks', async (req, res) => {
  try {
    // Process the webhook request
    const event = await processWebhookRequest(req);
    
    // Return success
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(400).json({ 
      error: 'Invalid webhook request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
