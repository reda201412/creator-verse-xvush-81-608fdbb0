
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
    
    // Obtenir la clé API TRON Grid à partir des secrets Supabase
    const tronGridApiKey = Deno.env.get('TRON_GRID_API_KEY') as string;
    
    // Configurer TronWeb avec les points d'extrémité publics ou privés (selon l'environnement)
    const fullNode = 'https://api.trongrid.io';
    const solidityNode = 'https://api.trongrid.io';
    const eventServer = 'https://api.trongrid.io';
    
    // Initialiser TronWeb sans clé privée (pour les opérations en lecture seule)
    const tronWeb = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      null // pas de clé privée pour les vérifications
    );

    // Configurer l'en-tête d'API pour TronGrid si disponible
    if (tronGridApiKey) {
      tronWeb.setHeader({"TRON-PRO-API-KEY": tronGridApiKey});
    }

    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Error verifying user token or user not found');
    }

    // Récupérer les paramètres de la requête
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

// Vérifier une transaction sur la blockchain TRON
async function verifyTransaction(tronWeb, supabase, userId, data) {
  const { txHash, amount, purpose, contentId, tierId, recipientId } = data;
  
  if (!txHash) {
    throw new Error('Transaction hash is required');
  }

  try {
    // Récupérer les informations de transaction depuis la blockchain TRON
    const txInfo = await tronWeb.trx.getTransaction(txHash);
    const txInfoUnconfirmed = await tronWeb.trx.getUnconfirmedTransactionInfo(txHash);
    
    // Vérifier si la transaction existe
    if (!txInfo) {
      throw new Error('Transaction not found on blockchain');
    }
    
    // Vérifier si la transaction est confirmée
    if (txInfo.ret?.[0]?.contractRet !== 'SUCCESS') {
      throw new Error('Transaction was not successful on blockchain');
    }
    
    // Pour les transferts TRC20 (USDT), nous devons analyser les logs des événements
    const contract = txInfo.raw_data.contract[0];
    let verifiedAmount = 0;
    let fromAddress = '';
    let toAddress = '';
    
    // Vérifier le type de transaction
    if (contract.type === 'TransferContract') {
      // Pour les transferts TRX
      const transferContract = contract.parameter.value;
      fromAddress = tronWeb.address.fromHex(transferContract.owner_address);
      toAddress = tronWeb.address.fromHex(transferContract.to_address);
      verifiedAmount = transferContract.amount / 1_000_000; // Convertir de sun à TRX
    } 
    else if (contract.type === 'TriggerSmartContract') {
      // Pour les transferts de tokens TRC20 (comme USDT)
      // Nous devons analyser les logs si disponibles dans txInfoUnconfirmed
      if (txInfoUnconfirmed && txInfoUnconfirmed.log) {
        // Analyser les logs pour trouver l'événement de transfert
        for (const log of txInfoUnconfirmed.log) {
          if (log.topics && log.topics[0] === 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
            // C'est un événement de transfert ERC20/TRC20 (Transfer)
            fromAddress = '0x' + log.topics[1].substring(24);
            toAddress = '0x' + log.topics[2].substring(24);
            verifiedAmount = parseInt(log.data, 16) / 1_000_000; // Convertir selon la décimale du token
          }
        }
      }
    }
    
    console.log(`Verified transaction: ${txHash} for ${verifiedAmount} USDT from ${fromAddress} to ${toAddress}`);
    
    // Vérifier si le montant correspond à celui attendu
    if (Math.abs(verifiedAmount - amount) > 0.01) {
      throw new Error(`Transaction amount (${verifiedAmount}) doesn't match expected amount (${amount})`);
    }
    
    // Enregistrer la transaction vérifiée dans la base de données
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
    
    // Mettre à jour le solde du portefeuille de l'utilisateur
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
    
    // Traiter en fonction du type de transaction
    let additionalData = {};
    
    if (purpose === 'purchase' && contentId) {
      // Traiter l'achat de contenu
      const result = await processContentPurchase(supabase, userId, contentId, transaction.id, amount);
      additionalData.purchase = result.purchase;
    } 
    else if (purpose === 'subscription' && tierId) {
      // Traiter l'abonnement
      const result = await processSubscription(supabase, userId, tierId, transaction.id);
      additionalData.subscription = result.subscription;
    }
    else if (purpose === 'message_support' && recipientId) {
      // Traiter le soutien à un créateur via message
      const result = await processCreatorSupport(supabase, userId, recipientId, transaction.id, amount);
      additionalData.support = result.support;
    }
    
    return {
      transaction,
      verified: true,
      blockchain_data: {
        hash: txHash,
        fromAddress,
        toAddress,
        amount: verifiedAmount
      },
      ...additionalData
    };
  } catch (error) {
    console.error(`Error verifying transaction ${txHash}:`, error);
    throw new Error(`Transaction verification failed: ${error.message}`);
  }
}

// Récupérer les informations d'une transaction
async function getTransactionInfo(tronWeb, txHash) {
  if (!txHash) {
    throw new Error('Transaction hash is required');
  }
  
  try {
    const txInfo = await tronWeb.trx.getTransaction(txHash);
    const txInfoDetails = await tronWeb.trx.getTransactionInfo(txHash);
    
    if (!txInfo) {
      throw new Error('Transaction not found');
    }
    
    return {
      hash: txHash,
      info: txInfo,
      details: txInfoDetails,
      confirmed: txInfoDetails && txInfoDetails.blockNumber ? true : false
    };
  } catch (error) {
    console.error(`Error getting transaction info for ${txHash}:`, error);
    throw new Error(`Failed to get transaction info: ${error.message}`);
  }
}

// Récupérer les informations d'un compte TRON
async function getAccountInfo(tronWeb, address) {
  if (!address) {
    throw new Error('Account address is required');
  }
  
  try {
    const accountInfo = await tronWeb.trx.getAccount(address);
    const accountResources = await tronWeb.trx.getAccountResources(address);
    
    // Si nous avons un contrat USDT, nous pouvons obtenir le solde USDT
    let usdtBalance = 0;
    try {
      // Adresse du contrat USDT sur TRON (mainnet)
      const usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
      
      // Créer une instance du contrat
      const contract = await tronWeb.contract().at(usdtContractAddress);
      
      // Obtenir le solde
      const balance = await contract.balanceOf(address).call();
      usdtBalance = tronWeb.toBigNumber(balance).div(1e6).toNumber();
    } catch (e) {
      console.log('Error getting USDT balance:', e);
    }
    
    return {
      address,
      account: accountInfo,
      resources: accountResources,
      usdt_balance: usdtBalance
    };
  } catch (error) {
    console.error(`Error getting account info for ${address}:`, error);
    throw new Error(`Failed to get account info: ${error.message}`);
  }
}

// Fonctions auxiliaires pour traiter différents types de transactions
async function processContentPurchase(supabase, userId, contentId, transactionId, amount) {
  // Vérifier le contenu et son prix
  const { data: content, error: contentError } = await supabase
    .from('videos')
    .select('token_price')
    .eq('id', contentId)
    .single();
  
  if (contentError) throw contentError;
  
  // Calculer la date d'expiration (si applicable)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // Accès par défaut de 30 jours
  
  // Créer l'enregistrement d'achat de contenu
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
  
  return { purchase };
}

async function processSubscription(supabase, userId, tierId, transactionId) {
  // Obtenir les informations sur le niveau d'abonnement
  const { data: tier, error: tierError } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('id', tierId)
    .single();
  
  if (tierError) throw tierError;
  
  // Calculer la date d'expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + tier.duration_days);
  
  // Désactiver les abonnements existants
  await supabase
    .from('user_subscriptions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true);
  
  // Créer le nouvel abonnement
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
}

async function processCreatorSupport(supabase, userId, recipientId, transactionId, amount) {
  // Calculer la commission de la plateforme (10%)
  const platformFee = amount * 0.1;
  const creatorAmount = amount - platformFee;
  
  // Enregistrer la transaction de support pour le créateur
  const { data: support, error: supportError } = await supabase
    .from('creator_support')
    .insert({
      supporter_id: userId,
      creator_id: recipientId,
      amount_usdt: amount,
      creator_amount_usdt: creatorAmount,
      platform_fee_usdt: platformFee,
      transaction_id: transactionId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (supportError) {
    // Si la table n'existe pas, nous la créerons plus tard avec une migration SQL
    console.error("Error recording creator support:", supportError);
    return { error: "Failed to record creator support" };
  }
  
  // Mettre à jour le solde du portefeuille du créateur
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
  
  return { support };
}
