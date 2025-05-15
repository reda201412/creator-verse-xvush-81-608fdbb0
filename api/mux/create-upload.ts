import { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';
import { withCreatorAuth } from './auth-middleware';

// Initialiser le client Mux avec les variables d'environnement
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Vérifier si la méthode est POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed, use POST' });
    return;
  }

  try {
    // Extraire des données du corps de la requête si nécessaire
    // const { /* paramètres personnalisés si nécessaire */ } = req.body;

    // Créer un nouvel upload Mux
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
      cors_origin: '*', // Autorise tous les domaines pour le développement, à restreindre en production
    });

    // Renvoyer l'ID et l'URL d'upload
    res.status(200).json({
      id: upload.id,
      url: upload.url,
    });
  } catch (error: any) {
    console.error('Error creating Mux upload:', error);
    res.status(500).json({
      error: `Failed to create Mux upload: ${error.message}`,
    });
  }
};

// Exporter le gestionnaire avec middleware d'authentification pour créateurs
export default withCreatorAuth(handler); 