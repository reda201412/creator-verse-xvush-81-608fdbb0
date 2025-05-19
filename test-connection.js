const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function test() {
  try {
    console.log('Attempting to connect...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful!', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Connection failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
