import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MUX_TOKEN_ID: string;
      MUX_TOKEN_SECRET: string;
    }
  }
}

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contentType, filename } = req.body;

    if (!contentType || !filename) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const upload = await muxClient.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
    });

    return res.status(200).json({
      id: upload.id,
      url: upload.url,
      assetId: upload.asset_id,
      status: upload.status,
    });
  } catch (error) {
    console.error('Error creating MUX upload:', error);
    return res.status(500).json({ 
      error: 'Failed to create upload',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
