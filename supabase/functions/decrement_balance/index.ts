
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS pre-flight request handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
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

    const { userId, amount } = await req.json();
    
    // Check if userId in request matches authenticated user
    if (userId !== user.id) {
      throw new Error('Unauthorized: User ID mismatch');
    }

    console.log(`User ${userId} is requesting to decrement balance by ${amount} USDT`);

    // Verify user has enough balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallet_addresses')
      .select('balance_usdt')
      .eq('user_id', userId)
      .single();
    
    if (walletError) {
      throw new Error('Error fetching wallet: ' + walletError.message);
    }

    if (!wallet || wallet.balance_usdt < amount) {
      throw new Error('Insufficient balance');
    }

    // Update wallet balance
    const newBalance = wallet.balance_usdt - amount;
    const { error: updateError } = await supabase
      .from('wallet_addresses')
      .update({ 
        balance_usdt: newBalance, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);
    
    if (updateError) {
      throw new Error('Error updating balance: ' + updateError.message);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        newBalance: newBalance,
        message: `Balance decremented by ${amount} USDT`
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
})
