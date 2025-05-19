import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type VideoStatus = 'pending' | 'processing' | 'ready' | 'error';
type VideoType = 'standard' | 'teaser' | 'premium' | 'vip';

// Fonction utilitaire pour formater la réponse de la base de données
interface VideoRecord {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  mux_asset_id: string | null;
  mux_upload_id: string | null;
  mux_playback_id: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number | null;
  aspect_ratio: string | null;
  status: VideoStatus;
  type: VideoType;
  is_premium: boolean;
  token_price: number | null;
  view_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, unknown> | null;
}

const formatVideo = (video: VideoRecord) => ({
  id: video.id,
  userId: video.user_id,
  title: video.title,
  description: video.description,
  assetId: video.mux_asset_id,
  uploadId: video.mux_upload_id,
  playbackId: video.mux_playback_id,
  thumbnailUrl: video.thumbnail_url,
  videoUrl: video.video_url,
  duration: video.duration,
  aspectRatio: video.aspect_ratio,
  status: video.status,
  type: video.type,
  isPremium: video.is_premium,
  price: video.token_price,
  viewCount: video.view_count || 0,
  likeCount: video.like_count || 0,
  commentCount: video.comment_count || 0,
  createdAt: video.created_at?.toISOString(),
  updatedAt: video.updated_at?.toISOString(),
  metadata: video.metadata,
});

// Fonction utilitaire pour convertir les données d'entrée en format base de données
interface VideoInput {
  userId?: string;
  user_id?: string;
  title: string;
  description?: string | null;
  assetId?: string | null;
  mux_asset_id?: string | null;
  uploadId?: string | null;
  mux_upload_id?: string | null;
  playbackId?: string | null;
  mux_playback_id?: string | null;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  videoUrl?: string | null;
  video_url?: string | null;
  duration?: number | null;
  aspectRatio?: string | null;
  aspect_ratio?: string | null;
  status?: VideoStatus;
  type?: VideoType;
  isPremium?: boolean;
  is_premium?: boolean;
  price?: number | null;
  token_price?: number | null;
  viewCount?: number;
  view_count?: number;
  likeCount?: number;
  like_count?: number;
  commentCount?: number;
  comment_count?: number;
  metadata?: Record<string, unknown> | null;
}

const toDbFormat = (data: VideoInput) => ({
  user_id: data.userId || data.user_id,
  title: data.title,
  description: data.description,
  mux_asset_id: data.assetId || data.mux_asset_id,
  mux_upload_id: data.uploadId || data.mux_upload_id,
  mux_playback_id: data.playbackId || data.mux_playback_id,
  thumbnail_url: data.thumbnailUrl || data.thumbnail_url,
  video_url: data.videoUrl || data.video_url,
  duration: data.duration,
  aspect_ratio: data.aspectRatio || data.aspect_ratio,
  status: data.status || 'processing', // Valeur par défaut
  type: data.type || 'standard', // Valeur par défaut
  is_premium: data.isPremium || data.is_premium || false,
  token_price: data.price || data.token_price,
  view_count: data.viewCount || data.view_count || 0,
  like_count: data.likeCount || data.like_count || 0,
  comment_count: data.commentCount || data.comment_count || 0,
  metadata: data.metadata || {},
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Gestion des requêtes OPTIONS pour le CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Gestion des requêtes GET
  if (req.method === 'GET') {
    try {
      const { id, userId } = req.query;
      
      // Récupérer une vidéo par son ID
      if (id) {
        try {
          const video = await prisma.video.findUnique({
            where: { id: Number(id) },
          });
          
          if (!video) {
            return res.status(404).json({ error: 'Video not found' });
          }
          
          return res.status(200).json(formatVideo(video as unknown as VideoRecord));
        } catch (error) {
          console.error('Error fetching video by ID:', error);
          return res.status(500).json({ error: 'Failed to fetch video' });
        }
      }
      
      // Récupérer les vidéos d'un utilisateur
      if (userId) {
        try {
          const videos = await prisma.video.findMany({
            where: { user_id: userId as string },
            orderBy: { created_at: 'desc' },
          });
          
          return res.status(200).json(
            videos.map(video => formatVideo(video as unknown as VideoRecord))
          );
        } catch (error) {
          console.error('Error fetching user videos:', error);
          return res.status(500).json({ error: 'Failed to fetch user videos' });
        }
      }
      
      // Récupérer toutes les vidéos (avec pagination si nécessaire)
      try {
        const videos = await prisma.video.findMany({
          orderBy: { created_at: 'desc' },
          take: 100, // Limite par défaut
        });
        
        res.status(200).json(
          videos.map(video => formatVideo(video as unknown as VideoRecord))
        );
      } catch (error) {
        console.error('Error fetching all videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  }
  
  // Créer une nouvelle vidéo ou enregistrer des métadonnées
  else if (req.method === 'POST') {
    try {
      // Endpoint pour enregistrer les métadonnées
      if (req.url?.endsWith('/metadata')) {
        const videoData = req.body;
        
        // Valider les données requises
        if (!videoData.userId) {
          return res.status(400).json({ error: 'userId is required' });
        }
        
        if (!videoData.title) {
          return res.status(400).json({ error: 'title is required' });
        }
        
        const video = await prisma.video.create({
          data: toDbFormat(videoData),
        });
        
        return res.status(201).json(formatVideo(video));
      }
      
      // Créer une nouvelle vidéo (ancien format)
      try {
        const videoData = req.body as VideoInput;
        
        if (!videoData.title) {
          return res.status(400).json({ error: 'title is required' });
        }
        
        const video = await prisma.video.create({
          data: toDbFormat(videoData),
        });
        
        res.status(201).json(formatVideo(video as unknown as VideoRecord));
      } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ error: 'Failed to create video' });
      }
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({ error: 'Failed to create video' });
    }
  } 
  
  // Mettre à jour une vidéo existante
  else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body as { id?: string } & Partial<VideoInput>;
      
      if (!id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      try {
        const video = await prisma.video.update({
          where: { id: Number(id) },
          data: {
            ...toDbFormat(updateData as VideoInput),
            updated_at: new Date(),
          },
        });
        
        res.status(200).json(formatVideo(video as unknown as VideoRecord));
      } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'Failed to update video' });
      }
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).json({ error: 'Failed to update video' });
    }
  } 
  
  // Supprimer une vidéo
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      try {
        await prisma.video.delete({
          where: { id: Number(id) },
        });
        
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } 
  
  // Méthode non autorisée
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
