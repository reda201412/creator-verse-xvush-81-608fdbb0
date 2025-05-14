
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Mux from 'npm:@mux/mux-node@8'; // Assurez-vous que la version est compatible ou utilisez une version spécifique

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const muxWebhookSecret = Deno.env.get('MUX_WEBHOOK_SECRET');

if (!supabaseUrl || !supabaseServiceKey || !muxWebhookSecret) {
  console.error('Missing Supabase URL, Service Role Key, or Mux Webhook Secret');
  // Dans un vrai scénario, vous pourriez vouloir retourner une erreur 500 ici
  // ou avoir un mécanisme pour alerter les administrateurs.
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Ou spécifiez les origines autorisées
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, X-Mux-Signature', // Inclure X-Mux-Signature
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log(`mux-webhook: Received ${req.method} request`);

  if (req.method === 'OPTIONS') {
    console.log('mux-webhook: Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.warn('mux-webhook: Invalid request method:', req.method);
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  if (!muxWebhookSecret) {
    console.error('mux-webhook: MUX_WEBHOOK_SECRET is not configured.');
    return new Response('Webhook secret not configured', { status: 500, headers: corsHeaders });
  }

  const signature = req.headers.get('X-Mux-Signature');
  const body = await req.text(); // Lire le corps en tant que texte pour la vérification

  try {
    console.log('mux-webhook: Verifying webhook signature...');
    Mux.Webhooks.verifyHeader(body, signature!, muxWebhookSecret); // La fonction lève une erreur si la vérification échoue
    console.log('mux-webhook: Webhook signature verified successfully.');
  } catch (error) {
    console.error('mux-webhook: Invalid webhook signature:', error.message);
    return new Response('Invalid signature', { status: 401, headers: corsHeaders });
  }

  const event = JSON.parse(body); // Parser le corps après vérification
  console.log(`mux-webhook: Received event type: ${event.type}`);
  console.log('mux-webhook: Event data:', JSON.stringify(event.data, null, 2));


  try {
    const assetId = event.data?.id; // L'ID de l'asset Mux

    if (!assetId) {
      console.warn('mux-webhook: Event data does not contain an asset ID.', event.data);
      return new Response('Event data missing asset ID', { status: 400, headers: corsHeaders });
    }

    switch (event.type) {
      case 'video.asset.ready': {
        console.log(`mux-webhook: Processing video.asset.ready for asset_id: ${assetId}`);
        const playbackIds = event.data.playback_ids;
        if (!playbackIds || playbackIds.length === 0) {
          console.warn(`mux-webhook: No playback_ids found for asset_id: ${assetId}`);
          return new Response('No playback IDs found', { status: 400, headers: corsHeaders });
        }
        
        const primaryPlaybackId = playbackIds.find(p => p.policy === 'public')?.id || playbackIds[0].id;
        console.log(`mux-webhook: Primary playback_id selected: ${primaryPlaybackId}`);

        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('videos')
          .update({
            status: 'ready',
            mux_playback_id: primaryPlaybackId,
            // Vous pourriez aussi vouloir stocker d'autres métadonnées de event.data
            // comme la durée, les dimensions, etc.
            // duration: event.data.duration, 
            // aspect_ratio: event.data.aspect_ratio,
          })
          .eq('mux_asset_id', assetId)
          .select(); // Pour obtenir les données mises à jour et vérifier

        if (updateError) {
          console.error(`mux-webhook: Supabase error updating video for asset_id ${assetId}:`, updateError);
          return new Response(`Error updating video: ${updateError.message}`, { status: 500, headers: corsHeaders });
        }
        if (!updateData || updateData.length === 0) {
            console.warn(`mux-webhook: No video found in DB with mux_asset_id: ${assetId}. Asset might have been created outside the app flow or mux_asset_id was not saved correctly.`);
            // Ne pas retourner une erreur ici, car Mux s'attend à un 200 si le webhook a été reçu et traité.
            // Mais loguer est important.
        } else {
            console.log(`mux-webhook: Video status updated to 'ready' for mux_asset_id: ${assetId}, Supabase record ID (if applicable): ${updateData[0]?.id}`);
        }
        break;
      }
      case 'video.asset.errored': {
        console.log(`mux-webhook: Processing video.asset.errored for asset_id: ${assetId}`);
        const errors = event.data.errors;
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('videos')
          .update({
            status: 'error',
            error_details: errors || { message: 'Unknown Mux processing error' },
          })
          .eq('mux_asset_id', assetId)
          .select();

        if (updateError) {
          console.error(`mux-webhook: Supabase error updating video status to 'error' for asset_id ${assetId}:`, updateError);
          return new Response(`Error updating video: ${updateError.message}`, { status: 500, headers: corsHeaders });
        }
         if (!updateData || updateData.length === 0) {
            console.warn(`mux-webhook: No video found in DB with mux_asset_id: ${assetId} to mark as errored.`);
        } else {
            console.log(`mux-webhook: Video status updated to 'error' for mux_asset_id: ${assetId}`);
        }
        break;
      }
      // Vous pouvez ajouter d'autres cas pour d'autres événements Mux ici
      // par exemple, video.upload.asset_created si vous utilisez l'upload_id pour corréler initialement
      case 'video.upload.asset_created': {
        // Cet événement est utile si vous avez seulement l'upload_id initialement et que vous voulez
        // enregistrer le mux_asset_id dès qu'il est créé.
        // L'asset_id se trouve dans event.data.asset_id
        // L'upload_id se trouve dans event.data.id (pour cet événement spécifique)
        const uploadId = event.data.id;
        const newAssetId = event.data.asset_id;
        console.log(`mux-webhook: Processing video.upload.asset_created. Upload ID: ${uploadId}, New Asset ID: ${newAssetId}`);
        
        const { error: uploadLinkError } = await supabaseAdmin
          .from('videos')
          .update({ mux_asset_id: newAssetId })
          .eq('upload_id', uploadId); // Assurez-vous que upload_id est bien stocké dans votre table videos

        if (uploadLinkError) {
          console.error(`mux-webhook: Error linking upload_id ${uploadId} to asset_id ${newAssetId}:`, uploadLinkError);
        } else {
          console.log(`mux-webhook: Successfully linked upload_id ${uploadId} to asset_id ${newAssetId}.`);
        }
        break;
      }
      default:
        console.log(`mux-webhook: Received unhandled event type: ${event.type}`);
    }

    console.log('mux-webhook: Event processed successfully.');
    return new Response('Webhook received', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('mux-webhook: Error processing webhook:', error);
    return new Response(`Webhook processing error: ${error.message}`, { status: 500, headers: corsHeaders });
  }
});
