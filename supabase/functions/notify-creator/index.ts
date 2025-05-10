
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_npm

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  // Create a Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Vérifier que la requête est autorisée
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header is required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error getting user or user not found')
    }

    const { videoId, notificationType, metadata } = await req.json()
    
    if (!videoId) {
      throw new Error('videoId is required')
    }

    if (!notificationType) {
      throw new Error('notificationType is required')
    }

    // Récupérer la vidéo et son créateur
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('*, user_profiles:user_id(*)')
      .eq('id', videoId)
      .single()

    if (videoError || !video) {
      throw new Error(`Error fetching video: ${videoError?.message || 'Video not found'}`)
    }

    // Créer une notification pour le créateur
    let title = ''
    let message = ''
    
    switch (notificationType) {
      case 'screenshot':
        title = 'Capture d\'écran détectée'
        message = `Un utilisateur a pris une capture d'écran de votre vidéo "${video.title}".`
        break
      case 'view_limit':
        title = 'Limite de vues atteinte'
        message = `Votre vidéo "${video.title}" a atteint son nombre maximum de vues.`
        break
      case 'expiration':
        title = 'Vidéo expirée'
        message = `Votre vidéo "${video.title}" a expiré.`
        break
      default:
        title = 'Notification'
        message = `Notification concernant votre vidéo "${video.title}"`
    }

    // Insérer la notification dans la base de données
    const { data: notification, error: notifError } = await supabase
      .from('creator_notifications')
      .insert({
        creator_id: video.user_id,
        video_id: videoId,
        title,
        message,
        type: 'ephemeral_alert',
        metadata: {
          alert_type: notificationType,
          trigger_user_id: user.id,
          ...metadata
        },
        is_read: false
      })
      .select()
      .single()

    if (notifError) {
      throw new Error(`Error creating notification: ${notifError.message}`)
    }
    
    // Optionnellement, envoyer un email au créateur
    // Cette partie pourrait être implémentée plus tard

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error(`Error processing request:`, error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
