import { NextResponse } from 'next/server';
import { processWebhookRequest } from '@/lib/mux-webhooks';

// Disable caching for this route
export const dynamic = 'force-dynamic';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, mux-signature',
};

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

export async function POST(request: Request) {
  try {
    const event = await processWebhookRequest(request);
    
    // Here you would typically update your database with the event data
    // For example, update the video status when it's ready
    if (event.type === 'video.asset.ready') {
      console.log('Video is ready:', event.data.id);
      // Update your database here
    } else if (event.type === 'video.asset.errored') {
      console.error('Video processing failed:', event.data.id, (event.data as any).errors);
      // Update your database with error status
    }
    
    return NextResponse.json(
      { 
        success: true,
        event: event.type,
        id: event.data.id,
      },
      { 
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    const status = error instanceof Error && error.message === 'Invalid webhook signature' ? 401 : 400;
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: message,
      }),
      { 
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
