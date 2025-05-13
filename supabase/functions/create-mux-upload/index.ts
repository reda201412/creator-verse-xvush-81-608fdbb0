
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // [1] Authentication - verify the Firebase token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Authorization header missing');
    
    const jwtToken = authHeader.replace('Bearer ', '');
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')!;
    
    // Verify the JWT token using jose library
    try {
      const { payload } = await jose.jwtVerify(
        new TextEncoder().encode(jwtToken),
        new TextEncoder().encode(jwtSecret)
      );
      
      if (!payload.sub) throw new Error('Invalid JWT token: missing sub claim');
      
      const user = { sub: payload.sub };
      
      // [2] Create MUX upload using the MUX API
      const muxTokenId = Deno.env.get('MUX_TOKEN_ID');
      const muxTokenSecret = Deno.env.get('MUX_TOKEN_SECRET');
      
      if (!muxTokenId || !muxTokenSecret) {
        throw new Error('MUX credentials not configured');
      }

      const muxToken = btoa(`${muxTokenId}:${muxTokenSecret}`);
      
      const muxResponse = await fetch('https://api.mux.com/video/v1/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${muxToken}`
        },
        body: JSON.stringify({
          cors_origin: '*',
          new_asset_settings: {
            playback_policy: 'public'
          }
        })
      });

      if (!muxResponse.ok) {
        const error = await muxResponse.json();
        throw new Error(`MUX API error: ${error.error?.message || 'Unknown error'}`);
      }

      const muxData = await muxResponse.json();
      
      // [3] Extract important data
      const { id: uploadId, url: uploadUrl } = muxData.data;
      
      // [4] Store in database
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          user_id: user.sub,
          upload_id: uploadId,
          status: 'created'
        });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      // [5] Send targeted response to frontend
      return new Response(JSON.stringify({ 
        uploadId,
        uploadUrl,
        status: 'created'
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (err) {
      // JWT verification error
      throw new Error(`JWT verification failed: ${err.message}`);
    }
  } catch (err) {
    // [6] Detailed error handling
    const errorMessage = err.message || 'Unknown error occurred';
    console.error(`Error in create-mux-upload: ${errorMessage}`);
    
    return new Response(JSON.stringify({ 
      error: 'Upload creation failed',
      details: errorMessage
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
