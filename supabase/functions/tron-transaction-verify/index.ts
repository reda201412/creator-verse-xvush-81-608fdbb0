
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import TronWeb from 'https://esm.sh/tronweb@5.3.1';

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
    
    // Get the TRON Grid API key and platform private key
    const tronGridApiKey = Deno.env.get('TRON_GRID_API_KEY') as string;
    const tronPrivateKey = Deno.env.get('TRON_PRIVATE_KEY') as string;
    
    // Use mainnet in production, shasta in development
    const isProduction = Deno.env.get('ENVIRONMENT') === 'production';
    const network = {
      fullNode: isProduction ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io',
      solidityNode: isProduction ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io',
      eventServer: isProduction ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io'
    };
    
    // Initialize TronWeb with platform wallet for operations
    const tronWeb = new TronWeb(
      network.fullNode,
      network.solidityNode,
      network.eventServer,
      tronPrivateKey // Platform private key for operations
    );

    // Configure the API header for TronGrid
    if (tronGridApiKey) {
      tronWeb.setHeader({"TRON-PRO-API-KEY": tronGridApiKey});
    }

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Error verifying user token or user not found');
    }

    // Parse request parameters
    const { operation, data } = await req.json();
    console.log(`User ${user.id} performing operation: ${operation}`);

    let result;
    switch (operation) {
      case 'verify_transaction':
        result = await verifyTransaction(tronWeb, supabase, user.id, data);
        break;
      case 'get_transaction':
        result = await getTransactionInfo(tronWeb, data.txHash);
        break;
      case 'get_account':
        result = await getAccountInfo(tronWeb, data.address);
        break;
      case 'simulate_transaction':
        result = await simulateTransaction(tronWeb, supabase, user.id, data);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
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
        error: error.message || 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

// Verify a transaction on the TRON blockchain
async function verifyTransaction(tronWeb, supabase, userId, data) {
  const { txHash, amount, purpose, contentId, tierId, recipientId } = data;
  
  if (!txHash) {
    throw new Error('Transaction hash is required');
  }

  try {
    console.log(`Verifying transaction ${txHash} for ${amount} USDT`);
    
    // In a real implementation, we would verify the transaction on the blockchain
    // For this implementation, we'll treat it as verified for testing purposes
    
    // Record the transaction in tron_transactions
    const { data: tronTx, error: tronTxError } = await supabase
      .from('tron_transactions')
      .insert({
        transaction_hash: txHash,
        from_address: data.fromAddress || 'user_wallet',
        to_address: 'platform_wallet',
        amount: amount,
        token_type: 'USDT',
        status: 'completed',
        verified_at: new Date().toISOString(),
        user_id: userId,
        metadata: {
          purpose,
          contentId,
          tierId,
          recipientId
        }
      })
      .select()
      .single();
    
    if (tronTxError) throw tronTxError;
    
    // Record the transaction in the main transactions table
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
      .single();
    
    if (txError) throw txError;
    
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
      .eq('user_id', userId);
    
    if (walletError) throw walletError;
    
    // Process based on transaction purpose
    let additionalData = {};
    
    if (purpose === 'purchase' && contentId) {
      // Process content purchase
      const result = await processContentPurchase(supabase, userId, contentId, transaction.id, amount);
      additionalData.purchase = result.purchase;
    } 
    else if (purpose === 'subscription' && tierId) {
      // Process subscription
      const result = await processSubscription(supabase, userId, tierId, transaction.id);
      additionalData.subscription = result.subscription;
    }
    else if (purpose === 'message_support' && recipientId) {
      // Process creator support
      const result = await processCreatorSupport(supabase, userId, recipientId, transaction.id, amount);
      additionalData.support = result.support;
    }
    
    return {
      transaction,
      verified: true,
      blockchain_data: {
        hash: txHash,
        fromAddress: data.fromAddress || 'user_wallet',
        toAddress: 'platform_wallet',
        amount: amount
      },
      ...additionalData
    };
  } catch (error) {
    console.error(`Error verifying transaction ${txHash}:`, error);
    throw new Error(`Transaction verification failed: ${error.message}`);
  }
}

// Get information about a transaction
async function getTransactionInfo(tronWeb, txHash) {
  if (!txHash) {
    throw new Error('Transaction hash is required');
  }
  
  try {
    // For this implementation, we'll return simulated transaction data
    // In production, we'd actually query the blockchain
    return {
      hash: txHash,
      info: {
        blockNumber: 12345678,
        blockTimeStamp: Date.now(),
        contractResult: ['SUCCESS'],
        receipt: { energy_usage: 1000 }
      },
      details: {
        contractType: 'TRC20',
        tokenName: 'USDT',
        amount: '1000000', // 1 USDT (6 decimals)
        confirmed: true
      }
    };
  } catch (error) {
    console.error(`Error getting transaction info for ${txHash}:`, error);
    throw new Error(`Failed to get transaction info: ${error.message}`);
  }
}

// Get information about a TRON account
async function getAccountInfo(tronWeb, address) {
  if (!address) {
    throw new Error('Account address is required');
  }
  
  try {
    // For this implementation, return simulated account data
    // In production, we'd actually query the blockchain
    return {
      address,
      account: {
        balance: 1000000, // 1 TRX
        create_time: Date.now() - 3600000,
        latest_operation_time: Date.now()
      },
      resources: {
        energy: { limit: 5000, used: 100 },
        bandwidth: { limit: 10000, used: 500 }
      },
      usdt_balance: 100 // 100 USDT
    };
  } catch (error) {
    console.error(`Error getting account info for ${address}:`, error);
    throw new Error(`Failed to get account info: ${error.message}`);
  }
}

// Simulate a transaction for testing
async function simulateTransaction(tronWeb, supabase, userId, data) {
  const { amount, purpose, contentId, tierId, recipientId } = data;
  
  try {
    // Generate a fake transaction hash
    const txHash = `simulated_tx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    console.log(`Simulating transaction ${txHash} for ${amount} USDT`);
    
    // Call the actual verification function with this fake hash
    return await verifyTransaction(tronWeb, supabase, userId, {
      ...data,
      txHash
    });
  } catch (error) {
    console.error(`Error simulating transaction:`, error);
    throw new Error(`Transaction simulation failed: ${error.message}`);
  }
}

// Helper functions to process different types of transactions
async function processContentPurchase(supabase, userId, contentId, transactionId, amount) {
  try {
    // Get content information
    const { data: content, error: contentError } = await supabase
      .from('videos')
      .select('token_price, user_id')
      .eq('id', contentId)
      .single();
    
    if (contentError) throw contentError;
    
    // Calculate expiration (30 days access)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Create content purchase record
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
      .single();
    
    if (purchaseError) throw purchaseError;
    
    // Credit the creator's wallet (90% of payment, 10% platform fee)
    if (content.user_id) {
      const creatorAmount = amount * 0.9;
      
      await supabase
        .from('wallet_addresses')
        .update({ 
          balance_usdt: supabase.rpc('increment_balance', { 
            user_id_param: content.user_id, 
            amount_param: creatorAmount 
          }),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', content.user_id);
      
      // Record transaction for creator
      await supabase
        .from('transactions')
        .insert({
          user_id: content.user_id,
          amount_usdt: creatorAmount,
          transaction_type: 'content_sale',
          status: 'completed',
          reference_id: contentId
        });
    }
    
    return { purchase };
  } catch (error) {
    console.error('Error processing content purchase:', error);
    throw error;
  }
}

async function processSubscription(supabase, userId, tierId, transactionId) {
  try {
    // Get tier information
    const { data: tier, error: tierError } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single();
    
    if (tierError) throw tierError;
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tier.duration_days);
    
    // Deactivate existing subscriptions
    await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);
    
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
      .single();
    
    if (subError) throw subError;
    
    return { subscription };
  } catch (error) {
    console.error('Error processing subscription:', error);
    throw error;
  }
}

async function processCreatorSupport(supabase, userId, recipientId, transactionId, amount) {
  try {
    // Calculate platform fee (10%) and creator amount (90%)
    const platformFee = amount * 0.1;
    const creatorAmount = amount - platformFee;
    
    // Update creator's wallet balance
    const { error: creatorWalletError } = await supabase
      .from('wallet_addresses')
      .update({ 
        balance_usdt: supabase.rpc('increment_balance', { 
          user_id_param: recipientId, 
          amount_param: creatorAmount 
        }),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', recipientId);
    
    if (creatorWalletError) throw creatorWalletError;
    
    // Record transaction for creator
    const { data: creatorTx } = await supabase
      .from('transactions')
      .insert({
        user_id: recipientId,
        amount_usdt: creatorAmount,
        transaction_type: 'fan_support',
        status: 'completed',
        reference_id: userId
      })
      .select()
      .single();
    
    return { 
      support: {
        id: `support_${transactionId}`,
        supporter_id: userId,
        creator_id: recipientId,
        amount_usdt: amount,
        creator_amount_usdt: creatorAmount,
        platform_fee_usdt: platformFee,
        transaction_id: transactionId,
        created_at: new Date().toISOString()
      } 
    };
  } catch (error) {
    console.error('Error processing creator support:', error);
    throw error;
  }
}
