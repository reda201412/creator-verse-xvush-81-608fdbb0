
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
    const { contentId } = await req.json()
    
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

    console.log(`User ${user.id} checking access to content: ${contentId}`)

    // Get the content details
    const { data: content, error: contentError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', contentId)
      .single()
    
    if (contentError) {
      throw new Error(`Error fetching content: ${contentError.message}`)
    }
    
    if (!content) {
      throw new Error('Content not found')
    }

    // Check if content is free
    if (!content.is_premium && content.type === 'standard') {
      return new Response(JSON.stringify({ 
        success: true, 
        hasAccess: true,
        reason: 'free_content'
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      })
    }

    // Check if user has purchased this content
    const { data: purchase, error: purchaseError } = await supabase
      .from('content_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .maybeSingle()
    
    if (purchaseError) {
      throw new Error(`Error checking purchase: ${purchaseError.message}`)
    }
    
    if (purchase) {
      // Check if purchase has not expired
      if (!purchase.expires_at || new Date(purchase.expires_at) > new Date()) {
        return new Response(JSON.stringify({ 
          success: true, 
          hasAccess: true,
          reason: 'purchased',
          purchase
        }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        })
      }
    }

    // Check if user has an active subscription that gives access to this content
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        expires_at,
        subscription_tiers(name)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()
    
    if (subError) {
      throw new Error(`Error checking subscription: ${subError.message}`)
    }
    
    if (subscription) {
      // Check if subscription is valid (not expired)
      if (new Date(subscription.expires_at) > new Date()) {
        // Map tier names to levels
        const tierLevels = {
          'fan': 1,
          'superfan': 2,
          'vip': 3,
          'exclusive': 4
        }
        
        // Map content types to required tiers
        const requiredTierForType = {
          'standard': 0,
          'teaser': 0,
          'premium': 1, // Fan level
          'vip': 3      // VIP level
        }
        
        const userTierLevel = tierLevels[subscription.subscription_tiers.name]
        const requiredLevel = requiredTierForType[content.type] || 0
        
        if (userTierLevel >= requiredLevel) {
          return new Response(JSON.stringify({ 
            success: true, 
            hasAccess: true,
            reason: 'subscription',
            subscription
          }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 200 
          })
        }
      }
    }

    // If we got here, user doesn't have access
    return new Response(JSON.stringify({ 
      success: true, 
      hasAccess: false,
      contentInfo: {
        id: content.id,
        title: content.title,
        type: content.type,
        isPremium: content.is_premium,
        tokenPrice: content.token_price
      }
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    })
  } catch (error) {
    console.error(`Error processing request:`, error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
