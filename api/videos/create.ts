import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma } from '@prisma/client';

type VideoWithUser = Prisma.VideoGetPayload<{
  include: { user: true }
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoWithUser | { error: string }>
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
      include: { user: true }
    });
    return res.status(201).json(video);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 