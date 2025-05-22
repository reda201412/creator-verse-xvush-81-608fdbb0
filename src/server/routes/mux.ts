
import express, { Request } from 'express';
import Mux from '@mux/mux-node';
import { verifyFirebaseToken } from '../middleware/auth';
import { processWebhookRequest } from '../../lib/mux-webhooks';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        [key: string]: any;
      };
    }
  }
}

const router = express.Router();

// Initialize Mux client
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || '',
});

// Create a direct upload URL
router.post('/upload', verifyFirebaseToken, async (req, res) => {
  // Log CORS headers for debugging
  console.log('CORS Headers:', {
    origin: req.headers.origin,
    'access-control-request-method': req.headers['access-control-request-method'],
    'access-control-request-headers': req.headers['access-control-request-headers']
  });
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
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
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Failed to create upload',
      details: error instanceof Error ? error.message : 'Unknown error',
      code: 'UPLOAD_ERROR'
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
