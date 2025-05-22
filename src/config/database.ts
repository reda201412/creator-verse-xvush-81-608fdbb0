
/**
 * Configuration de la base de données
 * 
 * Ce fichier exporte les configurations de connexion à la base de données
 * en fonction de l'environnement (développement, test, production).
 */

// Configuration de la base de données
export const dbConfig = {
  // URL de connexion à la base de données PostgreSQL (Neon)
  // Utilise la variable d'environnement DATABASE_URL si elle est définie,
  // sinon utilise une valeur par défaut pour le développement local
  url: import.meta.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/creators_verse',
  
  // Options de connexion
  options: {
    // Active le mode SSL pour les connexions sécurisées (requis pour Neon)
    ssl: import.meta.env.MODE === 'production' ? {
      rejectUnauthorized: false, // Nécessaire pour certaines configurations SSL
    } : false,
    
    // Configuration du pool de connexions
    pool: {
      min: 2,    // Nombre minimum de connexions dans le pool
      max: 10,   // Nombre maximum de connexions dans le pool
      idleTimeoutMillis: 30000, // Temps d'inactivité avant qu'une connexion ne soit libérée
      connectionTimeoutMillis: 2000, // Délai d'attente pour obtenir une connexion
    },
    
    // Configuration supplémentaire pour Prisma
    prisma: {
      // Active les logs de requêtes en mode développement
      log: import.meta.env.MODE === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    },
  },
};

// Configuration spécifique à Prisma
export const prismaConfig = {
  // Chemin vers le schéma Prisma
  schemaPath: './prisma/schema.prisma',
  
  // Dossiers de sortie
  output: {
    // Dossier de sortie pour le client généré
    client: './generated/prisma',
    
    // Dossier pour les migrations
    migrations: './prisma/migrations',
  },
};

// Configuration des migrations
export const migrationsConfig = {
  // Table dans laquelle stocker l'historique des migrations
  migrationsTable: '_prisma_migrations',
  
  // Dossier contenant les fichiers de migration
  migrationsDir: './prisma/migrations',
  
  // Schéma par défaut pour les migrations
  schema: 'public',
};
