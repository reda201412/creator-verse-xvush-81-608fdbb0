import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type VideoStatus = 'processing' | 'ready' | 'error';
type VideoType = 'standard' | 'teaser' | 'premium' | 'vip';

interface VideoMetadata {
  id?: number;
  user_id: string;
  title: string;
  description?: string | null;
  mux_asset_id: string;
  mux_playback_id?: string | null;
  mux_upload_id?: string | null;
  thumbnail_url?: string | null;
  duration?: number | null;
  aspect_ratio?: string | null;
  status: VideoStatus;
  type: VideoType;
  is_premium: boolean;
  token_price?: number | null;
}

// Fonction utilitaire pour formater la réponse de la base de données
const formatVideo = (video: any): any => ({
  ...video,
  created_at: video.created_at?.toISOString(),
  updated_at: video.updated_at?.toISOString(),
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
        const video = await prisma.video.findUnique({
          where: { id: Number(id) },
        });
        
        if (!video) {
          return res.status(404).json({ error: 'Video not found' });
        }
        
        return res.status(200).json(formatVideo(video));
      }
      
      // Récupérer les vidéos d'un utilisateur
      if (userId) {
        const videos = await prisma.video.findMany({
          where: { user_id: userId as string },
          orderBy: { created_at: 'desc' },
        });
        
        return res.status(200).json(videos.map(formatVideo));
      }
      
      // Récupérer toutes les vidéos (avec pagination si nécessaire)
      const videos = await prisma.video.findMany({
        orderBy: { created_at: 'desc' },
        take: 100, // Limite par défaut
      });
      
      res.status(200).json(videos.map(formatVideo));
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  }
  
  // Créer une nouvelle vidéo
  else if (req.method === 'POST') {
    try {
      const videoData: Omit<VideoMetadata, 'id'> = req.body;
      
      const video = await prisma.video.create({
        data: {
          ...videoData,
          token_price: videoData.token_price ? Number(videoData.token_price) : null,
        },
      });
      
      res.status(201).json(formatVideo(video));
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({ error: 'Failed to create video' });
    }
  } 
  
  // Mettre à jour une vidéo existante
  else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      const video = await prisma.video.update({
        where: { id: Number(id) },
        data: {
          ...updateData,
          updated_at: new Date(),
          token_price: updateData.token_price ? Number(updateData.token_price) : null,
        },
      });
      
      res.status(200).json(formatVideo(video));
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
      
      await prisma.video.delete({
        where: { id: Number(id) },
      });
      
      res.status(200).json({ success: true });
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
