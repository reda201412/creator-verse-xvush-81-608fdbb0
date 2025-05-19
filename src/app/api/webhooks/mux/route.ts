
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mux webhook secret for signature verification
const webhookSecret = process.env.MUX_WEBHOOK_SECRET || '';

if (!webhookSecret) {
  console.warn('MUX_WEBHOOK_SECRET is not set. Webhook verification will be disabled in development mode.');
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mux-signature',
};

export const dynamic = 'force-dynamic';

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Handle HEAD method for Mux webhook validation
export function HEAD() {
  return new Response(null, { 
    status: 200,
    headers: corsHeaders,
  });
}

// Verify webhook signature
function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature || !webhookSecret) {
    // Skip verification in development if no secret is set
    return process.env.NODE_ENV !== 'production';
  }

  try {
    // Parse signature (format: t=timestamp,v1=signature)
    const [timestamp, signatureHash] = signature.split(',').map(part => part.split('=')[1]);
    
    if (!timestamp || !signatureHash) {
      console.error('Invalid signature format');
      return false;
    }

    // Create the signed payload
    const signedPayload = `${timestamp}.${body}`;
    
    // Generate expected signature
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(signedPayload)
      .digest('hex');

    // Compare signatures
    return signatureHash === expectedSignature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get signature and body
    const signature = request.headers.get('mux-signature');
    const body = await request.text();
    
    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Parse event
    const event = JSON.parse(body);
    console.log('Received Mux webhook event:', event.type);
    
    // Handle different event types
    switch (event.type) {
      case 'video.asset.ready': {
        // Video is ready for playback
        const assetId = event.data.id;
        const playbackIds = event.data.playback_ids || [];
        
        if (!assetId) {
          return NextResponse.json(
            { error: 'Missing asset ID in event data' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Find primary playback ID (prefer public policy)
        const primaryPlaybackId = playbackIds.find((p: any) => p.policy === 'public')?.id || 
                                 (playbackIds.length > 0 ? playbackIds[0].id : null);
        
        if (!primaryPlaybackId) {
          console.warn('No playback ID found for asset', assetId);
        }
        
        // Update video record in database
        const { data, error } = await supabase
          .from('videos')
          .update({
            status: 'ready',
            mux_playback_id: primaryPlaybackId,
            duration: event.data.duration,
            aspect_ratio: event.data.aspect_ratio,
            max_stored_resolution: event.data.max_stored_resolution,
            updated_at: new Date().toISOString()
          })
          .eq('mux_asset_id', assetId)
          .select();
          
        if (error) {
          console.error('Error updating video status:', error);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500, headers: corsHeaders }
          );
        }
        
        console.log('Video status updated to ready:', data);
        break;
      }
      
      case 'video.asset.errored': {
        // Video processing failed
        const assetId = event.data.id;
        const errors = event.data.errors;
        
        if (!assetId) {
          return NextResponse.json(
            { error: 'Missing asset ID in event data' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Update video record with error status
        const { error } = await supabase
          .from('videos')
          .update({
            status: 'error',
            error_details: errors || 'Unknown processing error',
            updated_at: new Date().toISOString()
          })
          .eq('mux_asset_id', assetId);
          
        if (error) {
          console.error('Error updating video error status:', error);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500, headers: corsHeaders }
          );
        }
        
        console.log('Video status updated to error:', assetId);
        break;
      }
      
      // Handle asset creation from direct upload
      case 'video.upload.asset_created': {
        const uploadId = event.data.id;
        const assetId = event.data.asset_id;
        
        if (!uploadId || !assetId) {
          return NextResponse.json(
            { error: 'Missing upload ID or asset ID in event data' },
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Update video with asset ID if it was created with upload_id
        const { error } = await supabase
          .from('videos')
          .update({
            mux_asset_id: assetId,
            updated_at: new Date().toISOString()
          })
          .eq('upload_id', uploadId);
          
        if (error) {
          console.error('Error linking upload to asset:', error);
          return NextResponse.json(
            { error: 'Database update failed' },
            { status: 500, headers: corsHeaders }
          );
        }
        
        console.log('Upload linked to asset:', uploadId, '->', assetId);
        break;
      }
      
      default:
        console.log('Unhandled event type:', event.type);
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
