import { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';
import { withCreatorAuth } from './auth-middleware';

// Initialiser le client Mux avec les variables d'environnement
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

// List of allowed origins
const allowedOrigins = [
  'https://creator-verse-xvush-81-608fdbb0.vercel.app',
  'https://creator-verse-xvush-81-608fdbb0-2st4obiig-reda201412s-projects.vercel.app',
  'https://creator-verse-xvush-81-608fdbb0-9kb32mmm3-reda201412s-projects.vercel.app',
  'https://xdose-reda201412s-projects.vercel.app',
  'http://localhost:3000'
];

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  const origin = req.headers.origin;
  
  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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