import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
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
        // userId: user.uid, // si tu veux lier à l'utilisateur
      },
    });
    return res.status(201).json(video);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 