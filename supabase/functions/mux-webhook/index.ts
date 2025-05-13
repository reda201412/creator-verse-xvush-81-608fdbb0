
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { crypto } from "https://deno.land/std@0.185.0/crypto/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Type definitions for better code structure
interface ErrorResponse {
  code: string;
  error: string;
  details?: string;
}

interface MuxEvent<T = any> {
  type: string;
  data: T;
}

interface AssetCreatedData {
  id: string;
  upload_id: string;
}

interface AssetReadyData {
  id: string;
  playback_ids: { id: string; policy: string }[];
  duration: number;
  max_stored_resolution: string;
}

interface AssetErroredData {
  id: string;
  upload_id?: string;
  errors: {
    type: string;
    message: string;
  }[];
}

type WebhookEvent = 
  | MuxEvent<AssetCreatedData> & { type: 'video.asset.created' }
  | MuxEvent<AssetReadyData> & { type: 'video.asset.ready' }
  | MuxEvent<AssetErroredData> & { type: 'video.asset.errored' };

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify MUX signature for security
    const signature = req.headers.get('mux-signature');
    if (!signature) throw createError('signature_missing', 'Signature header missing');

    const body = await req.text();
    const webhookSecret = Deno.env.get('MUX_WEBHOOK_SECRET');
    if (!webhookSecret) throw createError('config_missing', 'Webhook secret not configured');

    const isValid = await verifySignature(signature, body, webhookSecret);
    if (!isValid) throw createError('invalid_signature', 'Invalid signature');

    // Process the event based on its type
    const event = JSON.parse(body) as WebhookEvent;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    switch (event.type) {
      case 'video.asset.created':
        await handleAssetCreated(supabase, event.data);
        break;

      case 'video.asset.ready':
        await handleAssetReady(supabase, event.data);
        break;

      case 'video.asset.errored':
        await handleAssetErrored(supabase, event.data);
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
        return jsonResponse(200, { status: 'unhandled_event', event_type: event.type });
    }

    return jsonResponse(200, { status: 'processed' });

  } catch (err) {
    // Typed error handling
    const error = err as ErrorResponse;
    console.error(`[${error.code}] ${error.error}: ${error.details}`);
    
    return jsonResponse(error.code === 'invalid_signature' ? 401 : 400, error);
  }
});

// Helper functions
function createError(code: string, message: string, details?: string): ErrorResponse {
  return { code, error: message, details };
}

async function verifySignature(signature: string, body: string, secret: string): Promise<boolean> {
  const signatureBuffer = hexToBuffer(signature);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBuffer,
    new TextEncoder().encode(body)
  );
}

function jsonResponse(status: number, data: object): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// Event handlers
async function handleAssetCreated(supabase: any, data: AssetCreatedData) {
  if (!data.upload_id) throw createError('invalid_data', 'upload_id missing');

  const { error } = await supabase
    .from('videos')
    .update({
      mux_asset_id: data.id,
      status: 'processing',
      updated_at: new Date().toISOString()
    })
    .eq('upload_id', data.upload_id);

  if (error) throw createError('database_error', 'Failed to update asset', error.message);
}

async function handleAssetReady(supabase: any, data: AssetReadyData) {
  const playbackId = data.playback_ids?.[0]?.id;
  if (!playbackId) throw createError('invalid_data', 'playback_id missing');

  const { error } = await supabase
    .from('videos')
    .update({
      mux_playback_id: playbackId,
      status: 'ready',
      duration: data.duration,
      resolution: data.max_stored_resolution,
      updated_at: new Date().toISOString()
    })
    .eq('mux_asset_id', data.id);

  if (error) throw createError('database_error', 'Failed to update playback', error.message);
}

async function handleAssetErrored(supabase: any, data: AssetErroredData) {
  const updateData: any = {
    status: 'error',
    updated_at: new Date().toISOString(),
    error_details: data.errors
  };

  // Try to find by upload_id or asset_id
  const query = data.upload_id ? 
    supabase.from('videos').update(updateData).eq('upload_id', data.upload_id) :
    supabase.from('videos').update(updateData).eq('mux_asset_id', data.id);

  const { error } = await query;

  if (error) throw createError('database_error', 'Failed to update error', error.message);
}

function hexToBuffer(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}
