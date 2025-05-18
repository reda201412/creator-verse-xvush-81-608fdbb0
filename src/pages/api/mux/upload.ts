import type { NextApiRequest, NextApiResponse } from 'next';
import { MUX_TOKEN_ID, MUX_TOKEN_SECRET } from '@/lib/mux-config';

export const config = {
  api: {
    bodyParser: false, // Désactive le bodyParser pour gérer manuellement le streaming
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const muxResponse = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        cors_origin: 'https://xdose.vercel.app',
        new_asset_settings: {
          playback_policy: ['public'],
        },
      }),
    });

    const data = await muxResponse.json();
    
    if (!muxResponse.ok) {
      throw new Error(data.message || 'Failed to create upload');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Mux upload error:', error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
