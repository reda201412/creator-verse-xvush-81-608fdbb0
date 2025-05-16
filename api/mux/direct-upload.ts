import { NextApiRequest, NextApiResponse } from 'next';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';

// Utiliser fetch directement pour créer un upload Mux
// IMPORTANT: Ces clés ne sont jamais exposées au frontend
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID || '614f11e3-39f6-46ef-8104-680fda482a19';
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET || 'TLmLKbeRUVf/zP4JYuU/uSKEle/xzowLpzR6vwFRvoSaMjud1UaQ4XCvezEA6bBSOglm8BUDsHr';

// Fonction pour créer un upload direct via l'API Mux
async function createMuxDirectUpload() {
  const response = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')
    },
    body: JSON.stringify({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: 'public',
        mp4_support: 'standard'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Mux API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    // Créer un upload direct en utilisant notre fonction
    const uploadResponse = await createMuxDirectUpload();
    
    // Extraire les données pertinentes de la réponse Mux
    const { data } = uploadResponse;
    
    // Retourner l'URL d'upload et l'ID
    return res.status(200).json({
      uploadUrl: data.url,
      uploadId: data.id,
      assetId: null // Sera disponible après l'upload
    });
  } catch (error) {
    console.error('Error creating direct upload:', error);
    return res.status(500).json({ 
      error: 'Failed to create upload URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
