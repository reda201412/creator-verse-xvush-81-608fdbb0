import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Video } from '@prisma/client';

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
    const { muxUploadId } = req.body;
    const video = await prisma.video.create({
      data: {
        muxUploadId,
        status: 'processing',
        userId: user.uid,
      },
    });
    return res.status(201).json(video);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 