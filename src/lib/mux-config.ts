// Configuration MUX
export const MUX_TOKEN_ID = process.env.NEXT_PUBLIC_MUX_TOKEN_ID || '';
export const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET || '';
// Vérification des variables d'environnement
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.warn('MUX_TOKEN_ID et MUX_TOKEN_SECRET doivent être définis dans .env');
}
