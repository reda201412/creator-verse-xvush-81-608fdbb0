import express from 'express';
import cors from 'cors';
// import videosRouter from './routes/videos.js';
// import muxRouter from './routes/mux.js';

export async function createServer() {
  try {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    console.log('Registering health check route only');
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return app;
  } catch (err) {
    console.error('Error during server creation:', err);
    throw err;
  }
}

// Enable starting the server directly when this file is run
// This is compatible with ESM syntax
const isMainModule = import.meta.url.endsWith('/server/index.ts') ||
                     import.meta.url.endsWith('/server/index.js');
                     
if (isMainModule) {
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
