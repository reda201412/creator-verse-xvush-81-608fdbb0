import OSS from 'ali-oss';

const client = new OSS({
  region: process.env.ALIBABA_OSS_REGION!,
  accessKeyId: process.env.ALIBABA_OSS_KEY_ID!,
  accessKeySecret: process.env.ALIBABA_OSS_KEY_SECRET!,
  bucket: process.env.ALIBABA_OSS_BUCKET!
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { filename, data } = req.body; // data = base64
  if (!filename || !data) {
    res.status(400).json({ error: 'Missing filename or data' });
    return;
  }

  const buffer = Buffer.from(data, 'base64');

  try {
    const result = await client.put(`thumbnails/${filename}`, buffer);
    res.status(200).json({ url: result.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 