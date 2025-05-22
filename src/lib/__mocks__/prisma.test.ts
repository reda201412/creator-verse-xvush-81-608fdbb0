import { prismaMock } from './prisma';

describe('Prisma Mock', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    prismaMock.$reset();
  });

  it('should connect to the database', async () => {
    await expect(prismaMock.$connect()).resolves.toBeUndefined();
  });

  it('should disconnect from the database', async () => {
    await expect(prismaMock.$disconnect()).resolves.toBeUndefined();
  });

  describe('User Model', () => {
    it('should find a user by id', async () => {
      const user = await prismaMock.user.findUnique({ 
        where: { id: 'user-1' } 
      });
      
      expect(user).toBeDefined();
      expect(user?.id).toBe('user-1');
      expect(user?.email).toBe('test@example.com');
    });

    it('should create a new user', async () => {
      const newUser = {
        email: 'new@example.com',
        name: 'New User',
      };

      const user = await prismaMock.user.create({
        data: newUser,
      });

      expect(user).toBeDefined();
      expect(user.id).toBe('new-user-id');
      expect(user.email).toBe(newUser.email);
      expect(user.name).toBe(newUser.name);
    });
  });

  describe('Video Model', () => {
    it('should find a video by id', async () => {
      const video = await prismaMock.video.findUnique({
        where: { id: 'video-1' },
      });

      expect(video).toBeDefined();
      expect(video?.id).toBe('video-1');
      expect(video?.title).toBe('Test Video');
    });

    it('should create a new video', async () => {
      const newVideo = {
        title: 'New Video',
        description: 'New Description',
        url: 'https://example.com/new-video',
        duration: 300,
        isPublished: true,
        ownerId: 'user-1',
        assetId: 'new-asset',
        playbackId: 'new-playback',
      };

      const video = await prismaMock.video.create({
        data: newVideo,
      });

      expect(video).toBeDefined();
      expect(video.id).toBe('new-video-id');
      expect(video.title).toBe(newVideo.title);
      expect(video.duration).toBe(newVideo.duration);
    });
  });

  describe('Transaction', () => {
    it('should handle transactions', async () => {
      const result = await prismaMock.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: 'user-1' } });
        const video = await tx.video.findUnique({ where: { id: 'video-1' } });
        return { user, video };
      });

      expect(result.user).toBeDefined();
      expect(result.video).toBeDefined();
      expect(result.user?.id).toBe('user-1');
      expect(result.video?.id).toBe('video-1');
    });
  });
});
