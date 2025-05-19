import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Initialiser le client Mux
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Lire le corps de la requête
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'video.mp4';
    const title = searchParams.get('title') || 'Sans titre';
    const description = searchParams.get('description') || '';
    
    // Créer un upload direct avec Mux
    const upload = await mux.video.uploads.create({
      cors_origin: '*',
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
        input: filename,
        master_access: 'temporary',
      },
    });

    // Créer un enregistrement vidéo dans la base de données
    const video = await prisma.video.create({
      data: {
        title,
        description,
        status: 'uploading',
        assetId: upload.asset_id || '',
        uploadId: upload.id,
        userId: session.user.id,
        metadata: {
          create: {
            filename,
            originalUrl: upload.url || '',
            uploadStatus: 'created',
          },
        },
      },
      include: {
        metadata: true,
      },
    });

    // Retourner la réponse avec l'URL d'upload
    return NextResponse.json({
      id: upload.id,
      url: upload.url,
      asset_id: upload.asset_id,
      videoId: video.id,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'upload Mux:', error);
    return NextResponse.json(
      { 
        error: 'Échec de la création de l\'upload',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
