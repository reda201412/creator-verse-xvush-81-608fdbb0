const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  console.log('🚀 Starting database test...');

  try {
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Créer une vidéo de test
    console.log('📝 Creating test video...');
    const video = await prisma.video.create({
      data: {
        user_id: 'test-user-123',
        title: 'Test Video',
        description: 'This is a test video',
        mux_asset_id: 'test-asset-123',
        mux_playback_id: 'test-playback-123',
        mux_upload_id: 'test-upload-123',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
        duration: 120,
        aspect_ratio: '16:9',
        status: 'processing',
        type: 'video/mp4',
        is_premium: false,
        token_price: 0.99,
      },
    });

    console.log('🎥 Test video created:', video);

    // Lire la vidéo créée
    console.log('🔍 Reading test video...');
    const foundVideo = await prisma.video.findUnique({
      where: { id: video.id },
    });

    console.log('📺 Found video:', foundVideo);

    // Lire toutes les vidéos
    console.log('📚 Listing all videos...');
    const allVideos = await prisma.video.findMany();
    console.log(`📊 Total videos in database: ${allVideos.length}`);
    console.log(allVideos);

  } catch (error) {
    console.error('❌ Error during database test:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('🏁 Database test completed');
  }
}

main().catch(console.error);
