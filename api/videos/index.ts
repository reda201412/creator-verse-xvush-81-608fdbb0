import { prisma } from '../../lib/prisma';
import { verifyFirebaseToken } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const user = await verifyFirebaseToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Si tu veux filtrer par utilisateur, décommente la ligne suivante :
    // const videos = await prisma.video.findMany({ where: { userId: user.uid } });
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(videos);
  }

  res.status(405).json({ error: 'Method not allowed' });
} 