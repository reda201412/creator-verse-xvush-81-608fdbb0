import { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';
import { withCreatorAuth } from './auth-middleware';

// Initialiser le client Mux
const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || '',
  tokenSecret: process.env.MUX_TOKEN_SECRET || ''
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Obtenir l'ID de l'asset depuis les paramètres de l'URL
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // Si un ID est fourni, récupérer cet asset spécifique
      if (id) {
        try {
          const asset = await Video.Assets.get(id as string);
          return res.status(200).json(asset);
        } catch (error: any) {
          console.error(`Error fetching asset ${id}:`, error);
          return res.status(404).json({ error: `Asset not found: ${error.message}` });
        }
      } 
      // Sinon, liste paginée des assets
      else {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          
          const assets = await Video.Assets.list({
            limit,
            page
          });
          
          return res.status(200).json(assets);
        } catch (error: any) {
          console.error('Error listing assets:', error);
          return res.status(500).json({ error: `Failed to list assets: ${error.message}` });
        }
      }

    case 'DELETE':
      // Supprimer un asset
      if (!id) {
        return res.status(400).json({ error: 'Asset ID is required' });
      }
      
      try {
        await Video.Assets.del(id as string);
        return res.status(200).json({ deleted: true, id });
      } catch (error: any) {
        console.error(`Error deleting asset ${id}:`, error);
        return res.status(500).json({ error: `Failed to delete asset: ${error.message}` });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

// Exporter le gestionnaire avec middleware d'authentification pour créateurs
export default withCreatorAuth(handler); 