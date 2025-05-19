// Ce fichier est un remplacement côté client pour Prisma
// Il ne doit pas être utilisé côté serveur

// Déclaration d'un objet vide qui remplacera PrismaClient
export const PrismaClient = {
  // Cette méthode sera appelée si quelqu'un essaie d'utiliser Prisma côté client
  // Elle lancera une erreur explicite
  $on: () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('PrismaClient ne peut pas être utilisé côté client. Utilisez les API du serveur à la place.');
    }
  },
  // Autres méthodes vides pour éviter les erreurs
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
};

// Exporte un client Prisma vide
export const prisma = new Proxy(
  {},
  {
    get() {
      if (process.env.NODE_ENV === 'development') {
        console.error('Prisma ne peut pas être utilisé côté client. Utilisez les API du serveur à la place.');
      }
      return () => Promise.reject(new Error('Prisma ne peut pas être utilisé côté client'));
    },
  }
);

// Types vides pour TypeScript
export type PrismaClient = typeof PrismaClient;
