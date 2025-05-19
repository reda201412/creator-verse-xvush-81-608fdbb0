const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing PostgreSQL connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Extraire les informations de connexion de l'URL
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Nécessaire pour certaines configurations SSL
  }
});

async function testConnection() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL database');
    const result = await client.query('SELECT $1::text as message', ['Connection successful!']);
    console.log('Query result:', result.rows[0].message);
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
