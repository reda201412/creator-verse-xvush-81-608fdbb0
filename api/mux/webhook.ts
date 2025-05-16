
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';

function isValidMuxSignature(signature: string, body: string, secret: string) {
  // Mux sends multiple signatures separated by ','
  // We validate if at least one is correct
  return signature.split(',').some(sig => {
    const [tsPart, sigPart] = sig.split(' ');
    const ts = tsPart?.split('=')[1];
    const hash = sigPart?.split('=')[1];
    if (!ts || !hash) return false;
    const payload = `${ts}.${body}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return expected === hash;
  });
}

export const config = {
  api: {
    bodyParser: true, // Mux sends JSON
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['mux-signature'];
  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  // Read raw body
  let rawBody = '';
  try {
    rawBody = JSON.stringify(req.body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET;
  if (!muxWebhookSecret) {
    console.error('Missing MUX_WEBHOOK_SECRET environment variable');
    return res.status(500).json({ error: 'Missing MUX_WEBHOOK_SECRET' });
  }

  if (!isValidMuxSignature(signature as string, rawBody, muxWebhookSecret)) {
    console.error('Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const event = req.body;
    const { type, data } = event;

    // For debug: log the received event
    console.log('Received Mux webhook event:', {
      type,
      data_id: data?.id,
      upload_id: data?.upload_id,
      asset_id: data?.asset_id,
      playback_ids: data?.playback_ids,
    });

    if (type === 'video.upload.asset_created') {
      const { upload_id, id: asset_id, playback_ids } = data;
      
      // Get the playback ID
      const playback_id = playback_ids && playback_ids.length > 0 
        ? playback_ids[0].id 
        : null;
        
      console.log(`Processing video.upload.asset_created: upload_id=${upload_id}, asset_id=${asset_id}, playback_id=${playback_id}`);

      // Update the video in the database
      const updatedVideos = await prisma.video.updateMany({
        where: { muxUploadId: upload_id },
        data: {
          muxAssetId: asset_id,
          muxPlaybackId: playback_id,
          status: 'ready',
        },
      });

      console.log(`Updated ${updatedVideos.count} videos for upload_id ${upload_id}`);
      return res.status(200).json({ success: true, updated: updatedVideos.count });
    } 
    else if (type === 'video.asset.ready') {
      const { id: asset_id, playback_ids } = data;
      
      // Get the playback ID
      const playback_id = playback_ids && playback_ids.length > 0 
        ? playback_ids[0].id 
        : null;
        
      console.log(`Processing video.asset.ready: asset_id=${asset_id}, playback_id=${playback_id}`);

      // Update the video in the database
      const updatedVideos = await prisma.video.updateMany({
        where: { muxAssetId: asset_id },
        data: {
          muxPlaybackId: playback_id,
          status: 'ready',
        },
      });

      console.log(`Updated ${updatedVideos.count} videos for asset_id ${asset_id}`);
      return res.status(200).json({ success: true, updated: updatedVideos.count });
    }
    else if (type === 'video.asset.errored') {
      const { id: asset_id } = data;
      console.log(`Processing video.asset.errored: asset_id=${asset_id}`);
      
      // Update the status to 'error' in the database
      const updatedVideos = await prisma.video.updateMany({
        where: { muxAssetId: asset_id },
        data: {
          status: 'error',
        },
      });
      
      console.log(`Updated ${updatedVideos.count} videos to error state for asset_id ${asset_id}`);
      return res.status(200).json({ success: true, updated: updatedVideos.count });
    }

    console.log(`Unhandled webhook type: ${type}`);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
