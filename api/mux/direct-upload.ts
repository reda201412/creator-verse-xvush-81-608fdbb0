import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import fetch from 'node-fetch';

// Types
type MuxUploadResponse = {
  data: {
    url: string;
    id: string;
  };
};

type ApiResponse = {
  uploadUrl?: string;
  uploadId?: string;
  assetId?: string | null;
  error?: string;
  details?: string;
};

// Configuration
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;
const MUX_API_URL = 'https://api.mux.com/video/v1/uploads';

const createMuxDirectUpload = async (origin: string): Promise<MuxUploadResponse> => {
  console.log('Starting Mux direct upload request with origin:', origin);
  
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    throw new Error('Missing Mux API credentials');
  }

  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');

  try {
    const response = await fetch(MUX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        cors_origin: origin,
        new_asset_settings: {
          playback_policy: 'public',
          mp4_support: 'standard'
        }
      })
    });

    const responseText = await response.text();
    console.log('Mux API response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 200) // Limiter la taille du log
    });

    if (!response.ok) {
      throw new Error(`Mux API error: ${response.status} ${response.statusText}`);
    }

    try {
      return JSON.parse(responseText) as MuxUploadResponse;
    } catch (parseError) {
      console.error('Failed to parse Mux response:', parseError);
      throw new Error('Invalid JSON response from Mux');
    }
  } catch (error) {
    console.error('Error in createMuxDirectUpload:', error);
    throw error;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Répondre aux requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Vérifier les clés d'API Mux
    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Vérifier le token d'authentification
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    try {
      const token = authHeader.split(' ')[1];
      await verifyFirebaseToken(token);
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid authentication token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Créer l'upload direct via l'API Mux
    const origin = req.headers.origin || '*';
    const muxResponse = await createMuxDirectUpload(origin);

    return res.status(200).json({
      uploadUrl: muxResponse.data.url,
      uploadId: muxResponse.data.id,
      assetId: null
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default handler;
}
