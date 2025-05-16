import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    const video = await prisma.video.findUnique({ where: { id: id as string } });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    return res.status(200).json(video);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 