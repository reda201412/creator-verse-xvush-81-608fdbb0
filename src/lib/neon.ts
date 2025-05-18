import { Pool } from 'pg';
import { PoolConfig } from 'pg';

// Get database URL from Vite environment variables
const connectionString = import.meta.env.VITE_NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('VITE_NEON_DATABASE_URL environment variable is not set');
}

// Parse the connection string to extract components
const config: PoolConfig = {
  connectionString,
  // Enable SSL in production
  ssl: {
    rejectUnauthorized: false // Nécessaire pour la connexion à NEON
  },
  // Configuration du pool de connexions
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps d'inactivité avant qu'un client ne soit libéré
  connectionTimeoutMillis: 2000, // Temps d'attente pour obtenir une connexion
};

// Create a connection pool
export const pool = new Pool(config);

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the database connection on startup
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Successfully connected to the database');
  } catch (err) {
    console.error('❌ Error connecting to the database:', err);
    // Ne pas arrêter le processus pour ne pas bloquer le démarrage
  }
};

testConnection();

// Export a query function for convenience
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Fonction utilitaire pour exécuter des transactions
export const queryWithTransaction = async (queries: {text: string, values?: any[]}[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const results = [];
    for (const q of queries) {
      const result = await client.query(q.text, q.values);
      results.push(result);
    }
    await client.query('COMMIT');
    return results;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

// Export the pool for transactions
export const db = {
  query: pool.query.bind(pool),
  getClient: pool.connect.bind(pool),
  pool,
};

export default db;
