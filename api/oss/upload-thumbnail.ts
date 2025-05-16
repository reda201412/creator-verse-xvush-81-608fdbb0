import OSS from 'ali-oss';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withCreatorAuth } from '../mux/auth-middleware';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends VercelRequest {
  user?: DecodedIdToken;
}

const client = new OSS({
  region: process.env.ALIBABA_OSS_REGION!,
  accessKeyId: process.env.ALIBABA_OSS_KEY_ID!,
  accessKeySecret: process.env.ALIBABA_OSS_KEY_SECRET!,
  bucket: process.env.ALIBABA_OSS_BUCKET!
});

// List of allowed origins
const allowedOrigins = [
  'https://creator-verse-xvush-81-608fdbb0.vercel.app',
  'https://creator-verse-xvush-81-608fdbb0-2st4obiig-reda201412s-projects.vercel.app',
  'https://creator-verse-xvush-81-608fdbb0-9kb32mmm3-reda201412s-projects.vercel.app',
  'https://xdose-reda201412s-projects.vercel.app',
  'http://localhost:3000'
];

async function handler(req: AuthenticatedRequest, res: VercelResponse): Promise<void> {
  // Set CORS headers for all responses
  const origin = req.headers.origin as string | undefined;
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    console.error(`Method ${req.method} not allowed`);
    res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
    return;
  }

  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const { filename, data } = req.body as { filename?: string; data?: string };
    
    if (!filename || !data) {
      res.status(400).json({ error: 'Missing required fields: filename and data' });
      return;
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(data, 'base64');
    const result = await client.put(`thumbnails/${filename}`, buffer);

    res.status(200).json({
      url: result.url,
      name: filename
    });
  } catch (error) {
    console.error('OSS upload error:', error);
    res.status(500).json({ error: error.message });
  }
} 

export default withCreatorAuth(handler);