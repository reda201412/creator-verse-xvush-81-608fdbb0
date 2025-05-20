
// Mock implementation for video API endpoint
export default function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Return mock videos data
      return res.status(200).json({
        videos: [
          {
            id: 'video1',
            title: 'Sample Video 1',
            description: 'This is a sample video',
            url: 'https://example.com/video1.mp4',
            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            createdAt: new Date().toISOString(),
            views: 120,
            likes: 45
          },
          {
            id: 'video2',
            title: 'Sample Video 2',
            description: 'Another sample video',
            url: 'https://example.com/video2.mp4',
            thumbnailUrl: 'https://example.com/thumbnail2.jpg',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            views: 87,
            likes: 23
          }
        ]
      });

    case 'POST':
      // Mock creating a new video
      return res.status(201).json({
        success: true,
        video: {
          id: `video_${Date.now()}`,
          title: req.body.title || 'Untitled',
          description: req.body.description || '',
          url: req.body.url || 'https://example.com/placeholder.mp4',
          thumbnailUrl: req.body.thumbnailUrl || 'https://example.com/placeholder-thumbnail.jpg',
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        }
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
