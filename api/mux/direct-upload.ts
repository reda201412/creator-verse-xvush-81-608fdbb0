import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';

// Clés d'API Mux
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID || '614f11e3-39f6-46ef-8104-680fda482a19';
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET || 'TLmLKbeRUVf/zP4JYuU/uSKEle/xzowLpzR6vwFRvoSaMjud1UaQ4XCvezEA6bBSOglm8BUDsHr';

// Fonction pour créer un upload direct via l'API Mux
async function createMuxDirectUpload(origin: string) {
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
      throw new Error(`Mux API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Mux upload:', error);
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

    // Obtenir l'origine de la requête
    const origin = req.headers.origin || '*';

    // Créer l'upload Mux
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
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
