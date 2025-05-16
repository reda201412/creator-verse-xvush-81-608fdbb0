import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import fetch from 'node-fetch';

// Clés d'API Mux
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error('Missing Mux API credentials');
}

// Fonction pour créer un upload direct via l'API Mux
async function createMuxDirectUpload(origin: string) {
  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    throw new Error('MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set in environment variables');
  }

  try {
    const response = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')
      },
      body: JSON.stringify({
        cors_origin: origin,
        new_asset_settings: {
          playback_policy: 'public',
          mp4_support: 'standard'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mux API error response:', errorText);
      throw new Error(`Mux API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Mux API success response:', data);
    return data;
  } catch (error) {
    console.error('Error in createMuxDirectUpload:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Configurer les en-têtes CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Gérer les requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authentifier l'utilisateur
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const user = await verifyFirebaseToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const uploadData = await createMuxDirectUpload(origin);
      return res.status(200).json({
        uploadUrl: uploadData.data.url,
        uploadId: uploadData.data.id,
        assetId: null
      });
    } catch (error) {
      console.error('Error in direct-upload handler:', error);
      return res.status(500).json({
        error: 'Failed to create upload URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Unauthorized',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
