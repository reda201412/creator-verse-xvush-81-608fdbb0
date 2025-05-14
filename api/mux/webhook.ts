import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Mux from '@mux/mux-node';

// Initialiser Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialiser Mux pour la vérification de signature
const { Webhooks } = new Mux();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vérifier si la méthode est POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    // Récupérer la signature MUX de l'en-tête
    const signature = req.headers['mux-signature'] as string;
    
    if (!signature) {
      console.error('Missing Mux signature header');
      return res.status(401).json({ error: 'Missing signature header' });
    }

    // Vérifier la signature du webhook avec la clé secrète
    let event;
    try {
      event = Webhooks.verifyHeader(
        JSON.stringify(req.body),
        signature,
        process.env.MUX_WEBHOOK_SECRET || ''
      );
    } catch (error: any) {
      console.error('Signature verification failed:', error);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Traiter l'événement en fonction de son type
    if (event.type === 'video.asset.ready') {
      await handleAssetReady(event.data);
    } else if (event.type === 'video.asset.errored') {
      await handleAssetError(event.data);
    }
    // Ajouter d'autres types d'événements si nécessaire

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Fonction pour gérer les notifications "asset.ready"
async function handleAssetReady(data: any) {
  const assetId = data.id;
  const playbackId = data.playback_ids?.[0]?.id;
  const uploadId = data.upload_id;
  
  if (!uploadId) {
    console.error('Missing upload_id in asset ready event:', data);
    return;
  }

  try {
    // Mettre à jour la vidéo dans la base de données
    const { error } = await supabase
      .from('videos')
      .update({
        status: 'ready',
        asset_id: assetId,
        playback_id: playbackId,
        updated_at: new Date().toISOString()
      })
      .eq('upload_id', uploadId);

    if (error) {
      console.error('Error updating video record:', error);
    }
  } catch (error) {
    console.error('Error in handleAssetReady:', error);
  }
}

// Fonction pour gérer les notifications d'erreur
async function handleAssetError(data: any) {
  const uploadId = data.upload_id;
  
  if (!uploadId) {
    console.error('Missing upload_id in asset error event:', data);
    return;
  }

  try {
    // Mettre à jour le statut de la vidéo en erreur
    const { error } = await supabase
      .from('videos')
      .update({
        status: 'error',
        error_message: data.errors?.[0]?.message || 'Unknown error',
        updated_at: new Date().toISOString()
      })
      .eq('upload_id', uploadId);

    if (error) {
      console.error('Error updating video error status:', error);
    }
  } catch (error) {
    console.error('Error in handleAssetError:', error);
  }
} 