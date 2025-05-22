import express from 'express';
import cors from 'cors';
import muxRouter from './routes/mux';

export async function createServer() {
  try {
    const app = express();

    // Middleware
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://xdose.vercel.app', 'https://*.xdose.vercel.app']
        : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));
    
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    console.log('Registering routes...');
    
    // Routes
    app.use('/api/mux', muxRouter);

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
