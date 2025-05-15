import { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';
import { withCreatorAuth } from './auth-middleware';

// Initialiser le client Mux
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Obtenir l'ID de l'asset depuis les paramètres de l'URL
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // Si un ID est fourni, récupérer cet asset spécifique
      if (id) {
        try {
          const asset = await muxClient.video.assets.retrieve(id as string);
          res.status(200).json(asset);
        } catch (error: any) {
          console.error(`Error fetching asset ${id}:`, error);
          res.status(404).json({ error: `Asset not found: ${error.message}` });
        }
      } 
      // Sinon, liste paginée des assets
      else {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          
          const assets = await muxClient.video.assets.list({
            limit,
            page
          });
          
          res.status(200).json(assets);
        } catch (error: any) {
          console.error('Error listing assets:', error);
          res.status(500).json({ error: `Failed to list assets: ${error.message}` });
        }
      }
      break;

    case 'DELETE':
      // Supprimer un asset
      if (!id) {
        res.status(400).json({ error: 'Asset ID is required' });
        return;
      }
      
      try {
        await muxClient.video.assets.delete(id as string);
        res.status(200).json({ deleted: true, id });
      } catch (error: any) {
        console.error(`Error deleting asset ${id}:`, error);
        res.status(500).json({ error: `Failed to delete asset: ${error.message}` });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
};

// Exporter le gestionnaire avec middleware d'authentification pour créateurs
export default withCreatorAuth(handler); 