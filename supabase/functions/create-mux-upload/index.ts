import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { jwt } from "https://deno.land/x/jwt@v0.2.0/mod.ts";

Deno.serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*'
        ,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      }
    })
  }

  try {
    // [1] Authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Authorization header missing')
    
    const jwtToken = authHeader.replace('Bearer ', '')
    const jwtSecret = Deno.env.get('SUPABASE_JWT_SECRET')!
    
    const { payload: user } = await jwt.verify(jwtToken, jwtSecret, 'HS256')
    if (!user) throw new Error('Invalid or expired JWT token')

    // [2] Création de l'upload Mux
    const muxToken = btoa(`${Deno.env.get('MUX_TOKEN_ID')}:${Deno.env.get('MUX_TOKEN_SECRET')}`)
    
    const muxResponse = await fetch('https://api.mux.com/video/v1/uploads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${muxToken}`
      },
      body: JSON.stringify({
        cors_origin: '*'
        ,
        new_asset_settings: {
          playback_policy: 'public'
        }
      })
    })

    if (!muxResponse.ok) {
      const error = await muxResponse.json()
      throw new Error(`Mux API error: ${error.error?.message || 'Unknown error'}`)
    }

    const muxData = await muxResponse.json()
    
    // [3] Destructuration des données importantes
    const { id: uploadId, url: uploadUrl } = muxData.data
    
    // [4] Stockage en base
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: dbError } = await supabase
      .from('videos')
      .insert({
        user_id: user.sub,
        upload_id: uploadId,
        status: 'created'
      })

    if (dbError) throw new Error(`Database error: ${dbError.message}`)

    // [5] Réponse ciblée au frontend
    return new Response(JSON.stringify({ 
      uploadId,
      uploadUrl,
      status: 'created'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (err) {
    // [6] Gestion d'erreur détaillée
    const errorMessage = err.message || 'Unknown error occurred'
    console.error(`Error in create-mux-upload: ${errorMessage}`)
    
    return new Response(JSON.stringify({ 
      error: 'Upload creation failed',
      details: errorMessage
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})
