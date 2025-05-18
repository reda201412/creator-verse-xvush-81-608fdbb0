const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔌 Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Test de connexion simple
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Tester une requête simple
    const result = await prisma.$queryRaw`SELECT 1 + 1 as result`;
    console.log('🔢 Test query result:', result);
    
    // Vérifier si la table des vidéos existe
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = 'Video';
    `;
    
    console.log('📊 Database tables:', tables);
    console.log('✅ Video table exists:', tables.length > 0);
    
  } catch (error) {
    console.error('❌ Error during database test:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('🏁 Test completed');
  }
}

testConnection().catch(console.error);
