// Importation conditionnelle de PrismaClient
import type { PrismaClient as PrismaClientType } from '@prisma/client';

let PrismaClient: typeof PrismaClientType;
// Type pour le client Prisma côté client
type ClientPrisma = {
  $on: () => void;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  [key: string]: unknown;
};

let prisma: PrismaClientType | ClientPrisma;

// Vérifie si nous sommes en mode serveur (Node.js)
const isServer = typeof window === 'undefined';

if (isServer) {
  // Côté serveur, importe le vrai PrismaClient
  const { PrismaClient: PrismaClientType } = await import('@prisma/client');
  PrismaClient = PrismaClientType;
  
  // Vérifie si nous sommes en mode développement
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Vérifie si une instance de PrismaClient existe déjà dans le contexte global
  const globalForPrisma = global as unknown as { prisma: typeof PrismaClient };
  
  // Initialise PrismaClient avec le logging en mode développement
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });
  
  // En mode développement, conserve l'instance de PrismaClient dans le contexte global
  // pour éviter les fuites de mémoire lors du rechargement à chaud (HMR)
  if (isDevelopment) {
    globalForPrisma.prisma = prisma;
  }
} else {
  // Côté client, utilise une implémentation vide
  prisma = {
    $on: () => {},
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
  };
}

// Fonction utilitaire pour se connecter à la base de données
export const connectDB = async () => {
  if (!isServer) {
    console.warn('connectDB ne peut être appelé que côté serveur');
    return;
  }
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Fonction pour fermer la connexion à la base de données
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
};

// Export à la fois par défaut et nommé pour la rétrocompatibilité
export { prisma };
export default prisma;
