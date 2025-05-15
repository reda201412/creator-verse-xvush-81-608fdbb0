import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

function isValidMuxSignature(signature: string, body: string, secret: string) {
  // Mux envoie plusieurs signatures séparées par ','
  // On valide si au moins une est correcte
  return signature.split(',').some(sig => {
    const [tsPart, sigPart] = sig.split(' ');
    const ts = tsPart?.split('=')[1];
    const hash = sigPart?.split('=')[1];
    if (!ts || !hash) return false;
    const payload = `${ts}.${body}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return expected === hash;
  });
}

export const config = {
  api: {
    bodyParser: false, // On veut le body brut pour la vérification de signature
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['mux-signature'];
  if (!signature) {
    return res.status(401).json({ error: 'No signature provided' });
  }

  // Lire le body brut
  let rawBody = '';
  await new Promise((resolve, reject) => {
    req.on('data', (chunk: Buffer) => {
      rawBody += chunk.toString('utf8');
    });
    req.on('end', resolve);
    req.on('error', reject);
  });

  const muxWebhookSecret = process.env.MUX_WEBHOOK_SECRET;
  if (!muxWebhookSecret) {
    return res.status(500).json({ error: 'Missing MUX_WEBHOOK_SECRET' });
  }

  if (!isValidMuxSignature(signature, rawBody, muxWebhookSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const event = JSON.parse(rawBody);
    const { type, data } = event;

    if (type === 'video.asset.ready') {
      const { id: assetId } = data;
      
      // Mettre à jour le statut de la vidéo dans Firestore
      const videosRef = db.collection('videos');
      const querySnapshot = await videosRef.where('muxAssetId', '==', assetId).get();
      
      if (!querySnapshot.empty) {
        const batch = db.batch();
        querySnapshot.forEach(doc => {
          batch.update(doc.ref, {
            status: 'ready',
            updatedAt: new Date()
          });
        });
        await batch.commit();
        console.log(`Video status updated to 'ready' for mux_asset_id: ${assetId}`);
      }
    } else if (type === 'video.asset.errored') {
      const { id: assetId } = data;
      
      // Mettre à jour le statut d'erreur dans Firestore
      const videosRef = db.collection('videos');
      const querySnapshot = await videosRef.where('muxAssetId', '==', assetId).get();
      
      if (!querySnapshot.empty) {
        const batch = db.batch();
        querySnapshot.forEach(doc => {
          batch.update(doc.ref, {
            status: 'error',
            errorDetails: data,
            updatedAt: new Date()
          });
        });
        await batch.commit();
        console.error(`Video status updated to 'error' for mux_asset_id: ${assetId}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 