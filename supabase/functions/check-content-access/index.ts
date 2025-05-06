
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

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header is required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error getting user or user not found')
    }

    const { contentId } = await req.json()
    
    if (!contentId) {
      throw new Error('Content ID is required')
    }

    console.log(`Checking access for user ${user.id} to content ${contentId}`)

    // Check if user has an active subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        is_active,
        expires_at,
        subscription_tiers(name, gives_full_access)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .maybeSingle()
    
    if (subError) {
      console.error('Error checking subscription:', subError)
    }

    // If user has an active subscription that gives full access
    if (subscription && subscription.is_active && 
        subscription.subscription_tiers?.gives_full_access) {
      return new Response(
        JSON.stringify({ 
          hasAccess: true, 
          reason: 'subscription', 
          subscription: subscription 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Check if user has purchased this content specifically
    const { data: purchase, error: purchaseError } = await supabase
      .from('content_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .maybeSingle()
    
    if (purchaseError) {
      console.error('Error checking content purchase:', purchaseError)
    }
    
    // If content was purchased and hasn't expired
    if (purchase) {
      const now = new Date()
      const expiresAt = purchase.expires_at ? new Date(purchase.expires_at) : null
      
      if (!expiresAt || expiresAt > now) {
        return new Response(
          JSON.stringify({ 
            hasAccess: true, 
            reason: 'purchase', 
            purchase: purchase 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ 
            hasAccess: false, 
            reason: 'expired', 
            purchase: purchase 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check if content is created by the user
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('user_id, is_premium, token_price')
      .eq('id', contentId)
      .maybeSingle()
    
    if (videoError) {
      console.error('Error checking video:', videoError)
      throw new Error('Error checking content information')
    }
    
    // If content is created by the user
    if (video && video.user_id === user.id) {
      return new Response(
        JSON.stringify({ 
          hasAccess: true, 
          reason: 'creator', 
          content: video 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // If content is not premium (free)
    if (video && !video.is_premium) {
      return new Response(
        JSON.stringify({ 
          hasAccess: true, 
          reason: 'free_content', 
          content: video 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // No access - return content price and premium status
    return new Response(
      JSON.stringify({ 
        hasAccess: false, 
        reason: 'no_purchase', 
        content: video 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ 
        hasAccess: false, 
        reason: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      }
    )
  }
})
