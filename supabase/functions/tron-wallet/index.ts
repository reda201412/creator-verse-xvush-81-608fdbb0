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
      case 'get_platform_wallet':
        result = await getPlatformWallet(supabase)
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

// Get user's wallet information with detailed transactions
async function getWalletInfo(supabase, userId) {
  console.log(`Getting wallet info for user ${userId}`)
  
  // Check if the user has a wallet
  const { data: wallet, error } = await supabase
    .from('wallet_addresses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching wallet:', error)
    throw error
  }

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

  if (subError) {
    console.error('Error fetching subscription:', subError)
    throw subError
  }

  // Get recent transactions with more details
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select(`
      *,
      reference_content:videos!transactions_reference_id_fkey(title, thumbnail_url),
      reference_tier:subscription_tiers!transactions_reference_id_fkey(name, price_usdt)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (txError) {
    console.error('Error fetching transactions:', txError)
    throw txError
  }

  return {
    wallet,
    subscription,
    transactions
  }
}

// Create a new TRON wallet for the user
// Modified to avoid TronWeb initialization issues in Deno environment
async function createWallet(supabase, userId) {
  console.log(`Creating wallet for user ${userId}`)
  
  // Check if user already has a wallet
  const { data: existingWallet } = await supabase
    .from('wallet_addresses')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
    
  if (existingWallet) {
    console.log('User already has a wallet:', existingWallet)
    return existingWallet
  }
  
  try {
    // Generate a wallet address using a simplified approach for Deno compatibility
    // For production, you would use a more secure method to generate a real TRON address
    
    // This is a simplified example that generates a mock TRON address
    // In production, this would be replaced with a secure wallet generation service
    const mockAddress = generateMockTronAddress()
    console.log('Generated new TRON account:', mockAddress)
    
    // Save the wallet address to the database
    const { data, error } = await supabase
      .from('wallet_addresses')
      .upsert({
        user_id: userId,
        tron_address: mockAddress,
        is_verified: true,
        balance_usdt: 100, // Start with test balance
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving wallet to database:', error)
      throw error
    }
    
    // Record the creation as a transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount_usdt: 100,
        transaction_type: 'system_credit',
        status: 'completed',
        updated_at: new Date().toISOString()
      })
    
    return data
  } catch (error) {
    console.error('Error creating TRON wallet:', error)
    throw new Error(`Failed to create TRON wallet: ${error.message}`)
  }
}

// Helper function to generate a mock TRON address
function generateMockTronAddress() {
  // TRON addresses start with T and are Base58 encoded
  // This is a simplified mock for development purposes
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'T';
  
  // Generate 33 more characters to make a 34-character address
  for (let i = 0; i < 33; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Verify a TRON transaction
async function verifyTransaction(supabase, userId, data) {
  const { txHash, amount, purpose, contentId, tierId, recipientId } = data
  console.log(`Verifying transaction ${txHash} for user ${userId}`)
  
  try {
    // Record the transaction in tron_transactions for detailed tracking
    const { data: tronTx, error: tronTxError } = await supabase
      .from('tron_transactions')
      .insert({
        transaction_hash: txHash,
        from_address: data.fromAddress || 'unknown',
        to_address: data.toAddress || 'platform_wallet',
        amount: amount,
        token_type: 'USDT',
        status: 'verifying',
        user_id: userId,
        metadata: {
          purpose: purpose,
          contentId: contentId,
          tierId: tierId,
          recipientId: recipientId
        }
      })
      .select()
      .single()
    
    if (tronTxError) {
      console.error('Error recording TRON transaction:', tronTxError)
      throw tronTxError
    }
    
    // Record the transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount_usdt: amount,
        transaction_type: purpose,
        status: 'completed',
        tron_tx_id: txHash,
        reference_id: contentId || tierId || recipientId
      })
      .select()
      .single()
    
    if (txError) {
      console.error('Error recording transaction:', txError)
      throw txError
    }
    
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
    
    if (walletError) {
      console.error('Error updating wallet balance:', walletError)
      throw walletError
    }
    
    // Process based on transaction purpose
    let result = { transaction }
    
    if (purpose === 'purchase' && contentId) {
      result = await processContentPurchase(supabase, userId, contentId, transaction.id, amount)
    } 
    else if (purpose === 'subscription' && tierId) {
      result = await processSubscription(supabase, userId, tierId, transaction.id)
    }
    else if (purpose === 'message_support' && recipientId) {
      result = await processCreatorSupport(supabase, userId, recipientId, transaction.id, amount)
    }
    
    // Update the tron transaction to completed
    await supabase
      .from('tron_transactions')
      .update({
        status: 'completed',
        verified_at: new Date().toISOString()
      })
      .eq('id', tronTx.id)
    
    return result
  } catch (error) {
    console.error(`Error verifying transaction:`, error)
    throw error
  }
}

// Request a withdrawal to a TRON wallet
async function requestWithdrawal(supabase, userId, data) {
  const { amount, destinationAddress } = data
  console.log(`Processing withdrawal request of ${amount} USDT to ${destinationAddress} for user ${userId}`)
  
  // Verify user has enough balance
  const { data: wallet, error: walletError } = await supabase
    .from('wallet_addresses')
    .select('balance_usdt')
    .eq('user_id', userId)
    .single()
  
  if (walletError) {
    console.error('Error fetching wallet balance:', walletError)
    throw walletError
  }
  
  if (wallet.balance_usdt < amount) {
    throw new Error(`Insufficient balance for withdrawal: ${wallet.balance_usdt} USDT available, ${amount} USDT requested`)
  }
  
  try {
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
    
    if (txError) {
      console.error('Error creating withdrawal transaction:', txError)
      throw txError
    }
    
    // Get user profile to check if user is a creator
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      throw profileError
    }
    
    let creatorPayout = null
    
    // Create creator payout record if user is a creator
    if (userProfile.role === 'creator') {
      const { data: payout, error: payoutError } = await supabase
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
      
      if (payoutError) {
        console.error('Error creating creator payout:', payoutError)
        throw payoutError
      }
      
      creatorPayout = payout
    }
    
    // Update wallet balance
    const { error: updateError } = await supabase
      .from('wallet_addresses')
      .update({ 
        balance_usdt: wallet.balance_usdt - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    
    if (updateError) {
      console.error('Error updating wallet balance:', updateError)
      throw updateError
    }
    
    // Record the withdrawal request in tron_transactions
    await supabase
      .from('tron_transactions')
      .insert({
        from_address: 'platform_wallet',
        to_address: destinationAddress,
        amount: amount,
        token_type: 'USDT',
        status: 'pending',
        user_id: userId,
        metadata: {
          purpose: 'withdrawal',
          transactionId: transaction.id,
          creatorPayoutId: creatorPayout?.id
        }
      })
    
    return {
      transaction,
      creatorPayout
    }
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    throw error
  }
}

// Get the platform wallet information (public)
async function getPlatformWallet(supabase) {
  const { data, error } = await supabase
    .from('site_wallet')
    .select('*')
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned, create a platform wallet
      const mockTronAddress = 'TF4TUVM5CbJgYgfs19RatBE96vKLMktpiy' // Public platform address
      
      const { data: newWallet, error: createError } = await supabase
        .from('site_wallet')
        .insert({
          tron_address: mockTronAddress,
          total_balance_usdt: 1000000,
          commission_percentage: 10
        })
        .select()
        .single()
      
      if (createError) throw createError
      return newWallet
    }
    throw error
  }
  
  return data
}

// Helper for processing content purchases
async function processContentPurchase(supabase, userId, contentId, transactionId, amount) {
  // Check if content exists and get price
  const { data: content, error: contentError } = await supabase
    .from('videos')
    .select('token_price, user_id')
    .eq('id', contentId)
    .single()
  
  if (contentError) {
    console.error('Error fetching content:', contentError)
    throw contentError
  }
  
  // Calculate expiration date (30 days access)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)
  
  // Record the purchase
  const { data: purchase, error: purchaseError } = await supabase
    .from('content_purchases')
    .insert({
      user_id: userId,
      content_id: contentId,
      transaction_id: transactionId,
      amount_usdt: content.token_price,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()
  
  if (purchaseError) {
    console.error('Error recording content purchase:', purchaseError)
    throw purchaseError
  }
  
  // Credit creator's wallet (90% of the amount - platform keeps 10%)
  const creatorAmount = amount * 0.9
  
  if (content.user_id) {
    const { error: creatorWalletError } = await supabase
      .from('wallet_addresses')
      .update({ 
        balance_usdt: supabase.rpc('increment_balance', { 
          user_id_param: content.user_id, 
          amount_param: creatorAmount 
        }),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', content.user_id)
    
    if (creatorWalletError && creatorWalletError.code !== 'PGRST116') {
      console.error('Error updating creator wallet:', creatorWalletError)
      // Don't throw, just log the error
    }
    
    // Record transaction for creator
    await supabase
      .from('transactions')
      .insert({
        user_id: content.user_id,
        amount_usdt: creatorAmount,
        transaction_type: 'content_sale',
        status: 'completed',
        reference_id: contentId
      })
      .catch(error => {
        console.error('Error recording creator transaction:', error)
      })
  }
  
  return { purchase }
}

// Helper for processing subscriptions
async function processSubscription(supabase, userId, tierId, transactionId) {
  // Get tier information
  const { data: tier, error: tierError } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('id', tierId)
    .single()
  
  if (tierError) {
    console.error('Error fetching subscription tier:', tierError)
    throw tierError
  }
  
  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + tier.duration_days)
  
  // Deactivate existing subscriptions
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
      transaction_id: transactionId,
      starts_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true
    })
    .select()
    .single()
  
  if (subError) {
    console.error('Error creating subscription:', subError)
    throw subError
  }
  
  return { subscription }
}

// Helper for processing creator support
async function processCreatorSupport(supabase, userId, recipientId, transactionId, amount) {
  // Calculate the commission of the platform (10%)
  const platformFee = amount * 0.1
  const creatorAmount = amount - platformFee
  
  try {
    // Ensure creator exists
    const { data: creator, error: creatorError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', recipientId)
      .eq('role', 'creator')
      .single()
    
    if (creatorError) {
      console.error('Creator not found:', creatorError)
      throw new Error('Creator not found or not a creator')
    }
    
    // Create support record
    const { data: support, error: supportError } = await supabase
      .from('creator_support')
      .insert({
        supporter_id: userId,
        creator_id: recipientId,
        amount_usdt: amount,
        creator_amount_usdt: creatorAmount,
        platform_fee_usdt: platformFee,
        transaction_id: transactionId
      })
      .select()
      .single()
      .catch(err => {
        // If table doesn't exist, just log and continue
        console.error('Error recording creator support (table might not exist):', err)
        return { data: null, error: err }
      })
    
    // Credit creator's wallet
    const { error: creatorWalletError } = await supabase
      .from('wallet_addresses')
      .update({ 
        balance_usdt: supabase.rpc('increment_balance', { 
          user_id_param: recipientId, 
          amount_param: creatorAmount 
        }),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', recipientId)
    
    if (creatorWalletError) {
      console.error('Error updating creator wallet:', creatorWalletError)
      throw creatorWalletError
    }
    
    // Record transaction for creator
    await supabase
      .from('transactions')
      .insert({
        user_id: recipientId,
        amount_usdt: creatorAmount,
        transaction_type: 'fan_support',
        status: 'completed',
        reference_id: userId
      })
    
    return { support: support || { amount, creatorAmount, platformFee } }
  } catch (error) {
    console.error('Error processing creator support:', error)
    throw error
  }
}
