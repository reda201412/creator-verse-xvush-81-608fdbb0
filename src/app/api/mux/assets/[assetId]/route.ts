import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Initialiser le client Mux
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { assetId } = params;

    // Récupérer les informations de l'asset depuis Mux
    const asset = await mux.video.assets.retrieve(assetId);

    // Récupérer l'URL de lecture si disponible
    let playbackUrl = null;
    if (asset.playback_ids && asset.playback_ids.length > 0) {
      const playbackId = asset.playback_ids[0].id;
      const isSigned = asset.playback_ids[0].policy === 'signed';
      
      if (isSigned) {
        // Générer une URL signée si nécessaire
        playbackUrl = mux.video.assets.playbackId(playbackId).signed();
      } else {
        playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
      }
    }

    // Formater la réponse
    const response = {
      id: asset.id,
      status: asset.status,
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      created_at: asset.created_at,
      max_stored_resolution: asset.max_stored_resolution,
      max_stored_frame_rate: asset.max_stored_frame_rate,
      playback_url: playbackUrl,
      playback_ids: asset.playback_ids,
      is_live: asset.is_live,
      errors: asset.errors,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'asset Mux:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Asset non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Échec de la récupération de l\'asset',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
