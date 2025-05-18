import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔌 Testing database connection...');
  
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  const client = await pool.connect();
  
  try {
    console.log('✅ Successfully connected to the database');
    
    // Tester une requête simple
    const result = await client.query('SELECT 1 + 1 as result');
    console.log('🔢 Test query result:', result.rows[0]);
    
    // Vérifier si la table des vidéos existe
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = 'Video';
    `);
    
    console.log('📊 Database tables:', tableResult.rows);
    console.log('✅ Video table exists:', tableResult.rows.length > 0);
    
  } catch (error) {
    console.error('❌ Error during database test:');
    console.error(error);
  } finally {
    client.release();
    await pool.end();
    console.log('🏁 Test completed');
  }
}

testConnection().catch(console.error);
