import { Pool } from 'pg';
import { PoolConfig } from 'pg';

// Parse the database URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse the connection string to extract components
const config: PoolConfig = {
  connectionString,
  // Enable SSL in production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Create a connection pool
export const pool = new Pool(config);

// Test the database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

// Export a query function for convenience
export const query = (text: string, params?: any[]) => pool.query(text, params);

// Export the pool for transactions
export const db = {
  query: pool.query.bind(pool),
  getClient: pool.connect.bind(pool),
  pool,
};

export default db;
