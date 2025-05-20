
import express from 'express';
import cors from 'cors';
import videosRouter from './routes/videos';
import muxRouter from './routes/mux';

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/videos', videosRouter);
  app.use('/api/mux', muxRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

// Enable starting the server directly when this file is run
// This is compatible with ESM syntax
if (import.meta.url === import.meta.main) {
  const PORT = process.env.PORT || 3000;
  createServer().then(app => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Error creating server:', err);
    process.exit(1);
  });
}
