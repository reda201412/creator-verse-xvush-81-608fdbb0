
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
    const { userId, amount } = await req.json()
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data: wallet, error: walletError } = await supabase
      .from('wallet_addresses')
      .select('balance_usdt')
      .eq('user_id', userId)
      .single()
    
    if (walletError) {
      throw new Error('Error getting wallet: ' + walletError.message)
    }
    
    if (!wallet || wallet.balance_usdt < amount) {
      throw new Error('Insufficient balance')
    }
    
    // Update the wallet balance
    const { data, error } = await supabase
      .from('wallet_addresses')
      .update({ balance_usdt: wallet.balance_usdt - amount })
      .eq('user_id', userId)
      .select()
    
    if (error) {
      throw new Error('Error updating wallet: ' + error.message)
    }
    
    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})
