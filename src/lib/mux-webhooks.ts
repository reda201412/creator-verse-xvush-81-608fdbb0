
import { createHmac } from 'crypto';
import { Request } from 'express';
import { prisma } from '@/lib/prisma';

type MuxEvent = {
  type: string;
  data: {
    id: string;
    playback_ids?: Array<{id: string, policy: string}>;
    duration?: number;
    aspect_ratio?: string;
    errors?: Array<{message: string, type: string}>;
    asset_id?: string;
    [key: string]: any;
  };
};

const webhookSecret = process.env.MUX_WEBHOOK_SECRET || '';

if (!webhookSecret) {
  console.warn('MUX_WEBHOOK_SECRET is not set. Webhook verification will be disabled.');
}

/**
 * Verifies the Mux webhook signature using HMAC-SHA256
 */
export function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature || !webhookSecret) {
    console.warn('Webhook verification skipped: Missing signature or secret');
    return process.env.NODE_ENV !== 'production'; // Only verify in production
  }

  try {
    // The Mux signature is in the format: t=timestamp,v1=signature
    const timestamp = signature.split(',')[0].split('=')[1];
    const signatureHash = signature.split(',')[1].split('=')[1];
    
    if (!timestamp || !signatureHash) {
      console.error('Invalid signature format');
      return false;
    }

    // Create the signed payload
    const signedPayload = `${timestamp}.${body}`;
    
    // Create the HMAC
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    // Compare the signatures
    return signatureHash === expectedSignature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Handles Mux webhook events
 */
export async function handleMuxWebhookEvent(event: MuxEvent) {
  if (!event || !event.type) {
    console.error('Invalid Mux webhook event:', event);
    return;
  }

  try {
    switch (event.type) {
      case 'video.asset.ready': {
        await handleAssetReady(event.data);
        break;
      }
      case 'video.asset.errored': {
        await handleAssetError(event.data);
        break;
      }
      case 'video.upload.asset_created': {
        await handleUploadAssetCreated(event.data);
        break;
      }
      default:
        console.log('Unhandled Mux event type:', event.type);
    }
  } catch (error) {
    console.error(`Error processing Mux event ${event.type}:`, error);
  }
}

/**
 * Handle video.asset.ready events
 */
async function handleAssetReady(data: MuxEvent['data']) {
  const assetId = data.id;
  console.log(`Processing asset ready for asset_id: ${assetId}`);

  if (!assetId) {
    console.error('Missing asset ID in event data');
    return;
  }

  const playbackId = data.playback_ids?.[0]?.id;
  if (!playbackId) {
    console.error(`No playback ID found for asset_id: ${assetId}`);
    return;
  }

  // Generate a thumbnail URL using Mux's Image API
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

  try {
    // Update the video record in the database
    const updatedVideo = await prisma.video.update({
      where: {
        mux_asset_id: assetId,
      },
      data: {
        status: 'ready',
        mux_playback_id: playbackId,
        playbackId: playbackId, // Update both formats for compatibility
        duration: data.duration || null,
        aspect_ratio: data.aspect_ratio || null,
        aspectRatio: data.aspect_ratio || null, // Update both formats
        // Only set thumbnail if not already set
        thumbnailUrl: {
          set: thumbnailUrl,
        },
        thumbnail_url: {
          set: thumbnailUrl, 
        },
      },
    });

    console.log(`Video record updated for asset_id: ${assetId}`, updatedVideo);
  } catch (error) {
    console.error(`Error updating video record for asset_id: ${assetId}:`, error);
  }
}

/**
 * Handle video.asset.errored events
 */
async function handleAssetError(data: MuxEvent['data']) {
  const assetId = data.id;
  console.log(`Processing asset error for asset_id: ${assetId}`);

  if (!assetId) {
    console.error('Missing asset ID in event data');
    return;
  }

  try {
    // Update the video record to indicate an error
    const updatedVideo = await prisma.video.update({
      where: {
        mux_asset_id: assetId,
      },
      data: {
        status: 'error',
        error_details: data.errors ? JSON.stringify(data.errors) : null,
      },
    });

    console.log(`Video error status updated for asset_id: ${assetId}`);
  } catch (error) {
    console.error(`Error updating error status for asset_id: ${assetId}:`, error);
  }
}

/**
 * Handle video.upload.asset_created events
 */
async function handleUploadAssetCreated(data: MuxEvent['data']) {
  const uploadId = data.id;
  const newAssetId = data.asset_id;
  
  if (!uploadId || !newAssetId) {
    console.error('Missing upload ID or asset ID in event data');
    return;
  }

  console.log(`Processing upload.asset_created: uploadId=${uploadId}, assetId=${newAssetId}`);

  try {
    // Link the upload ID to the new asset ID
    const updatedVideo = await prisma.video.update({
      where: {
        mux_upload_id: uploadId,
      },
      data: {
        mux_asset_id: newAssetId,
        assetId: newAssetId, // Update both formats
      },
    });

    console.log(`Linked upload_id ${uploadId} to asset_id ${newAssetId}`);
  } catch (error) {
    console.error(`Error linking upload_id ${uploadId} to asset_id ${newAssetId}:`, error);
  }
}

/**
 * Processes a raw webhook request
 */
export async function processWebhookRequest(request: Request): Promise<MuxEvent> {
  let body = '';
  
  // Get the raw body if it's a stream
  if (typeof request.body === 'object') {
    body = JSON.stringify(request.body);
  } else if (typeof request.body === 'string') {
    body = request.body;
  } else {
    // Read the body as a string
    body = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      request.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      request.on('error', reject);
    });
  }
  
  const signature = request.headers['mux-signature'] as string;
  
  if (!verifyWebhookSignature(body, signature)) {
    throw new Error('Invalid webhook signature');
  }
  
  const event = JSON.parse(body) as MuxEvent;
  await handleMuxWebhookEvent(event);
  
  return event;
}
