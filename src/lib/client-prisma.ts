
// Ce fichier est un "mock" du client Prisma pour utilisation côté client
// Il sera utilisé via l'alias dans vite.config.ts

export const PrismaClient = function() {
  console.warn('PrismaClient utilisé côté client. Utilisez plutôt des API pour accéder à la base de données.');
  return {
    // Stub des méthodes principales, retournant des promesses vides
    video: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({ id: 'client-mock-id' }),
      update: async () => ({ id: 'client-mock-id' }),
      delete: async () => ({ id: 'client-mock-id' }),
    },
    user: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => ({ id: 'client-mock-id' }),
      update: async () => ({ id: 'client-mock-id' }),
      delete: async () => ({ id: 'client-mock-id' }),
    },
    // Ajoutez d'autres modèles selon vos besoins
  };
};

export default { PrismaClient };
