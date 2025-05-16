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
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // Vérifier les clés d'API Mux
    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      console.error('Missing Mux API credentials');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Vérifier le token d'authentification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      await verifyFirebaseToken(token);
    } catch (error) {
      console.error('Firebase token verification error:', error);
      res.status(401).json({ error: 'Invalid authentication token' });
      return;
    }

    // Obtenir l'origine pour CORS
    const origin = req.headers.origin || '*';

    try {
      // Créer l'upload direct via l'API Mux
      const muxResponse = await createMuxDirectUpload(origin);
      
      // Vérifier et formater la réponse
      if (!muxResponse || !muxResponse.data) {
        throw new Error('Invalid response from Mux');
      }

      const responseData = {
        uploadUrl: muxResponse.data.url,
        uploadId: muxResponse.data.id,
        assetId: null
      };

      res.status(200).json(responseData);
    } catch (muxError) {
      console.error('Mux API error:', muxError);
      res.status(502).json({ error: 'Error communicating with video service' });
    }
  } catch (error) {
    console.error('Error in direct-upload handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
