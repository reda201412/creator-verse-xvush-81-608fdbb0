// Configuration MUX
export const MUX_TOKEN_ID = import.meta.env.VITE_MUX_TOKEN_ID || '';
export const MUX_TOKEN_SECRET = import.meta.env.VITE_MUX_TOKEN_SECRET || '';

// Vérification des variables d'environnement
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.warn('VITE_MUX_TOKEN_ID et VITE_MUX_TOKEN_SECRET doivent être définis dans .env');
}
