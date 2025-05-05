
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
    const { operation, data } = await req.json()
    
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

    console.log(`User ${user.id} performing operation: ${operation}`)

    let result
    switch (operation) {
      case 'get_wallet_info':
        result = await getWalletInfo(supabase, user.id)
        break
      case 'create_wallet':
        result = await createWallet(supabase, user.id)
        break
      case 'verify_transaction':
        result = await verifyTransaction(supabase, user.id, data)
        break
      case 'request_withdrawal':
        result = await requestWithdrawal(supabase, user.id, data)
        break
      default:
        throw new Error(`Unsupported operation: ${operation}`)
    }

    return new Response(JSON.stringify({ success: true, data: result }), { 
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

// Get user's wallet information
async function getWalletInfo(supabase, userId) {
  // Check if the user has a wallet
  const { data: wallet, error } = await supabase
    .from('wallet_addresses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error

  // Get subscription information
  const { data: subscription, error: subError } = await supabase
    .from('user_subscriptions')
    .select(`
      id,
      is_active,
      expires_at,
      subscription_tiers(name, price_usdt)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (subError) throw subError

  // Get recent transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (txError) throw txError

  return {
    wallet,
    subscription,
    transactions
  }
}

// Create a new TRON wallet for the user
async function createWallet(supabase, userId) {
  // In a real implementation, we would integrate with TRON API to create a wallet
  // For now, we'll create a placeholder
  
  const mockTronAddress = `T${Array.from({length: 33}, () => 
    '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
  ).join('')}`
  
  const { data, error } = await supabase
    .from('wallet_addresses')
    .upsert({
      user_id: userId,
      tron_address: mockTronAddress,
      is_verified: false,
      balance_usdt: 0,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  
  return data
}

// Verify a TRON transaction
async function verifyTransaction(supabase, userId, data) {
  const { txHash, amount, purpose, contentId, tierId } = data
  
  // In a real implementation, we would verify the transaction on the TRON blockchain
  // For now, we'll simulate a successful verification
  
  // Record the transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount_usdt: amount,
      transaction_type: purpose,
      status: 'completed',
      tron_tx_id: txHash,
      reference_id: contentId || tierId
    })
    .select()
    .single()
  
  if (txError) throw txError
  
  // Update user's wallet balance
  const { error: walletError } = await supabase
    .from('wallet_addresses')
    .update({ 
      balance_usdt: supabase.rpc('increment_balance', { 
        user_id_param: userId, 
        amount_param: amount 
      }),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
  
  if (walletError) throw walletError
  
  // Process based on transaction purpose
  let result = { transaction }
  
  if (purpose === 'purchase' && contentId) {
    // If purchasing content, create content_purchase record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('token_price')
      .eq('id', contentId)
      .single()
    
    if (videoError) throw videoError
    
    // Calculate expiration (if applicable)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // Default 30 days access
    
    const { data: purchase, error: purchaseError } = await supabase
      .from('content_purchases')
      .insert({
        user_id: userId,
        content_id: contentId,
        transaction_id: transaction.id,
        amount_usdt: video.token_price,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()
    
    if (purchaseError) throw purchaseError
    
    result.purchase = purchase
  } 
  else if (purpose === 'subscription' && tierId) {
    // If purchasing subscription, create subscription record
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single()
    
    if (tierError) throw tierError
    
    // Calculate expiration
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + tier.duration_days)
    
    // Set existing subscriptions to inactive
    await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)
    
    // Create new subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        tier_id: tierId,
        transaction_id: transaction.id,
        starts_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select()
      .single()
    
    if (subError) throw subError
    
    result.subscription = subscription
  }
  
  return result
}

// Request a withdrawal to a TRON wallet
async function requestWithdrawal(supabase, userId, data) {
  const { amount, destinationAddress } = data
  
  // Verify user has enough balance
  const { data: wallet, error: walletError } = await supabase
    .from('wallet_addresses')
    .select('balance_usdt')
    .eq('user_id', userId)
    .single()
  
  if (walletError) throw walletError
  
  if (wallet.balance_usdt < amount) {
    throw new Error('Insufficient balance for withdrawal')
  }
  
  // Create withdrawal transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount_usdt: amount,
      transaction_type: 'withdrawal',
      status: 'pending'
    })
    .select()
    .single()
  
  if (txError) throw txError
  
  // Create creator payout record if user is a creator
  const { data: creatorPayout, error: payoutError } = await supabase
    .from('creator_payouts')
    .insert({
      creator_id: userId,
      amount_usdt: amount,
      transaction_id: transaction.id,
      status: 'pending',
      destination_address: destinationAddress
    })
    .select()
    .single()
  
  if (payoutError) throw payoutError
  
  // Update wallet balance
  const { error: updateError } = await supabase
    .from('wallet_addresses')
    .update({ 
      balance_usdt: wallet.balance_usdt - amount,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
  
  if (updateError) throw updateError
  
  return {
    transaction,
    creatorPayout
  }
}
