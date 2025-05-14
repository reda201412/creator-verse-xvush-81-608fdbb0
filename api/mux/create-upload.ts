import { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';
import { withCreatorAuth } from './auth-middleware';

// Initialiser le client Mux avec les variables d'environnement
const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Vérifier si la méthode est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    // Extraire des données du corps de la requête si nécessaire
    // const { /* paramètres personnalisés si nécessaire */ } = req.body;

    // Créer un nouvel upload Mux
    const upload = await Video.Uploads.create({
      new_asset_settings: {
        playback_policy: 'public',
        // Ajouter des paramètres personnalisés si nécessaire
        mp4_support: 'standard',
      },
      cors_origin: '*', // Autorise tous les domaines pour le développement, à restreindre en production
    });

    // Renvoyer l'ID et l'URL d'upload
    return res.status(200).json({
      id: upload.id,
      url: upload.url,
    });
  } catch (error: any) {
    console.error('Error creating Mux upload:', error);
    return res.status(500).json({
      error: `Failed to create Mux upload: ${error.message}`,
    });
  }
};

// Exporter le gestionnaire avec middleware d'authentification pour créateurs
export default withCreatorAuth(handler); 