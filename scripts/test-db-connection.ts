const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔌 Testing database connection...');
  
  try {
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    
    // Test de connexion simple
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Tester une requête simple
    const result = await prisma.$queryRaw`SELECT 1 + 1 as result`;
    console.log('🔢 Test query result:', result);
    
    // Vérifier si la table des vidéos existe
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Video';
      `;
      
      console.log('📊 Database tables:', tables);
      console.log('✅ Video table exists:', tables.length > 0);
      
    } catch (error) {
      console.error('❌ Error checking for tables:', error);
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
    process.exit(1);
  }
  
  console.log('🏁 Test completed');
}

testConnection();
