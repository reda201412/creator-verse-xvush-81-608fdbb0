
import { createHmac } from 'crypto';
import { Request } from 'express';

type MuxEvent = {
  type: string;
  data: {
    id: string;
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
export function handleMuxWebhookEvent(event: MuxEvent) {
  if (!event || !event.type) {
    console.error('Invalid Mux webhook event:', event);
    return;
  }

  const eventHandlers: Record<string, (data: MuxEvent['data']) => void> = {
    'video.asset.created': (data) => {
      console.log('Asset created:', data.id);
      // Add your custom logic here
    },
    'video.asset.ready': (data) => {
      console.log('Asset ready:', data.id);
      // Add your custom logic here
    },
    'video.upload.asset_created': (data) => {
      console.log('Upload complete, asset created:', data.id);
      // Add your custom logic here
    },
    'video.asset.errored': (data) => {
      console.error('Asset error:', data.id, (data as any).errors);
      // Add your custom logic here
    },
  };

  const handler = eventHandlers[event.type];
  if (handler) {
    try {
      handler(event.data);
    } catch (error) {
      console.error(`Error handling Mux event ${event.type}:`, error);
    }
  } else {
    console.log('Unhandled Mux event type:', event.type);
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
  handleMuxWebhookEvent(event);
  
  return event;
}
