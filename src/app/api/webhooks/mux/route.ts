import { NextResponse } from 'next/server';
import { processWebhookRequest, verifyWebhookSignature } from '@/lib/mux-webhooks';
import { prisma } from '@/lib/prisma';
import { updateVideoStatus } from '@/services/muxService';

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic';

// En-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, mux-signature',};

// Gérer la méthode OPTIONS pour la pré-vérification CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Gérer la méthode HEAD pour la validation du webhook Mux
export function HEAD() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Gestionnaires d'événements du webhook Mux

async function handleAssetCreated(assetData: any) {
  try {
    const { id: assetId, playback_ids, duration, aspect_ratio } = assetData;
    
    // Mettre à jour la vidéo avec les métadonnées de l'asset
    await updateVideoStatus(assetId, 'processing', {
      duration,
      aspectRatio: aspect_ratio,
      playbackId: playback_ids?.[0]?.id,
    });
    
    console.log(`Asset ${assetId} marqué comme en cours de traitement`);
  } catch (error) {
    console.error('Erreur lors du traitement de la création de l\'asset:', error);
    throw error;
  }
}

async function handleAssetReady(assetData: any) {
  try {
    const { id: assetId, playback_ids, duration, max_stored_resolution, aspect_ratio } = assetData;
    
    // Mettre à jour la vidéo avec les métadonnées de l'asset prêt
    await updateVideoStatus(assetId, 'ready', {
      duration,
      aspectRatio: aspect_ratio,
      maxResolution: max_stored_resolution,
      playbackId: playback_ids?.[0]?.id,
      readyAt: new Date().toISOString(),
    });
    
    console.log(`Asset ${assetId} marqué comme prêt`);
  } catch (error) {
    console.error('Erreur lors du traitement de la disponibilité de l\'asset:', error);
    throw error;
  }
}

async function handleAssetErrored(assetData: any) {
  try {
    const { id: assetId, errors } = assetData;
    
    // Mettre à jour la vidéo avec l'état d'erreur
    await updateVideoStatus(assetId, 'error', {
      error: JSON.stringify(errors),
      failedAt: new Date().toISOString(),
    });
    
    console.error(`Erreur de traitement pour l'asset ${assetId}:`, errors);
  } catch (error) {
    console.error('Erreur lors du traitement de l\'échec de l\'asset:', error);
    throw error;
  }
}

async function handleAssetUpdated(assetData: any) {
  try {
    const { id: assetId, status, playback_ids, ...metadata } = assetData;
    
    // Mettre à jour les métadonnées de la vidéo
    await prisma.video.update({
      where: { assetId },
      data: {
        status,
        metadata: {
          update: {
            ...metadata,
            playbackId: playback_ids?.[0]?.id,
            updatedAt: new Date().toISOString(),
          }
        },
        updatedAt: new Date()
      }
    });
    
    console.log(`Métadonnées mises à jour pour l'asset ${assetId}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'asset:', error);
    throw error;
  }
}

// Gérer la méthode POST pour les événements de webhook
export async function POST(request: Request) {
  try {
    const event = await processWebhookRequest(request);
    
    // Traiter l'événement en fonction de son type
    switch (event.type) {
      case 'video.asset.created':
        console.log('Nouvel asset créé:', event.data.id);
        await handleAssetCreated(event.data);
        break;
        
      case 'video.asset.ready':
        console.log('Asset prêt:', event.data.id);
        await handleAssetReady(event.data);
        break;
        
      case 'video.asset.errored':
        console.error('Erreur de traitement de l\'asset:', event.data.id, (event.data as any).errors);
        await handleAssetErrored(event.data);
        break;
        
      case 'video.asset.updated':
        console.log('Asset mis à jour:', event.data.id);
        await handleAssetUpdated(event.data);
        break;
        
      default:
        console.log('Événement non géré:', event.type);
    }
    
    return NextResponse.json(
      { 
        success: true,
        event: event.type,
        id: event.data.id,
      },
      { 
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    const status = error instanceof Error && error.message === 'Invalid webhook signature' ? 401 : 400;
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: message,
      }),
      { 
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}
