
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS pre-flight request handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Error verifying user token or user not found');
    }

    const { contentId } = await req.json();
    
    if (!contentId) {
      throw new Error('Content ID is required');
    }
    
    console.log(`Checking access for user ${user.id} to content ${contentId}`);
    
    // Check if the user has purchased this content
    const { data: purchase, error: purchaseError } = await supabase
      .from('content_purchases')
      .select('*')
      .eq('content_id', contentId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (purchaseError) {
      throw new Error('Error checking content purchase: ' + purchaseError.message);
    }

    // If purchase exists and hasn't expired, grant access
    let hasAccess = false;
    let reason = 'not_purchased';
    
    if (purchase) {
      if (!purchase.expires_at || new Date(purchase.expires_at) > new Date()) {
        hasAccess = true;
        reason = '';
      } else {
        reason = 'expired';
      }
    }
    
    // Also check if the content is free
    if (!hasAccess) {
      const { data: content, error: contentError } = await supabase
        .from('videos')
        .select('is_premium, token_price')
        .eq('id', contentId)
        .maybeSingle();
        
      if (contentError) {
        throw new Error('Error checking content: ' + contentError.message);
      }
      
      if (content && (!content.is_premium || content.token_price === 0)) {
        hasAccess = true;
        reason = '';
      }
    }

    // Return the access check result
    return new Response(
      JSON.stringify({
        hasAccess,
        reason,
        userId: user.id,
        contentId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
