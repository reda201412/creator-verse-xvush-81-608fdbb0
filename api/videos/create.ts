
import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Video, Prisma } from '@prisma/client';

type VideoCreateBody = {
  muxUploadId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  type?: 'standard' | 'teaser' | 'premium' | 'vip';
  format?: '16:9' | '9:16' | '1:1';
  isPremium?: boolean;
  tokenPrice?: number;
  restrictions?: Prisma.JsonValue;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Video | { error: string }>
) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const body = req.body as VideoCreateBody;

    // Validate required fields
    if (!body.title || !body.muxUploadId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate video type
    const validTypes = ['standard', 'teaser', 'premium', 'vip'] as const;
    if (body.type && !validTypes.includes(body.type)) {
      return res.status(400).json({ error: 'Invalid video type' });
    }

    // Validate video format
    const validFormats = ['16:9', '9:16', '1:1'] as const;
    if (body.format && !validFormats.includes(body.format)) {
      return res.status(400).json({ error: 'Invalid video format' });
    }

    // Create video record
    const createData = {
      title: body.title,
      description: body.description ?? null,
      thumbnailUrl: body.thumbnailUrl ?? null,
      type: body.type ?? 'standard',
      format: body.format ?? '16:9',
      isPremium: body.isPremium ?? false,
      userId: user.uid,
      muxUploadId: body.muxUploadId,
      tokenPrice: body.tokenPrice ?? 0,
      restrictions: body.restrictions ? body.restrictions : undefined,
      status: 'processing' as const
    };

    const video = await prisma.video.create({
      data: createData
    });



    return res.status(201).json(video);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 
