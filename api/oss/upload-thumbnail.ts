import OSS from 'ali-oss';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
  'http://localhost:3000'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  
  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Correction parsing body JSON
  let body = req.body;
  if (req.headers['content-type'] === 'application/json' && typeof req.body === 'string') {
    body = JSON.parse(req.body);
  }
  const { filename, data } = body || {};
  if (!filename || !data) {
    res.status(400).json({ error: 'Missing filename or data' });
    return;
  }

  const buffer = Buffer.from(data, 'base64');

  try {
    const result = await client.put(`thumbnails/${filename}`, buffer);
    res.status(200).json({ url: result.url });
  } catch (error) {
    console.error('OSS upload error:', error);
    res.status(500).json({ error: error.message });
  }
} 