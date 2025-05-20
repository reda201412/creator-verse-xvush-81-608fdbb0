
// Ce fichier utilise une version adaptée du client Prisma pour le navigateur

import { PrismaClient as PrismaClientType } from '@prisma/client';

// Importation dynamique du client Prisma - modifié pour être compatible avec le browser
const prismaClientPackage = '@prisma/client';

// Variable globale pour maintenir une connexion entre les hot-reloads
declare global {
  var prisma: PrismaClientType | undefined;
}

// Configuration du client Prisma
export const prisma: PrismaClientType = globalThis.prisma || 
  // @ts-ignore - On ignore l'erreur de typescript ici car nous savons que notre client-prisma.ts s'occupe de la compatibilité
  new (require(prismaClientPackage)).PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

// En développement, on garde le client dans l'objet global pour éviter les connexions multiples
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { PrismaClientType as PrismaClient };
