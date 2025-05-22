// Using ESM syntax for consistency
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import routes
import healthRouter from './src/server/routes/health.js';
import videosRouter from './src/server/routes/videos.js';
import muxRouter from './src/server/routes/mux.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Main server using ESM
const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific domains
    const allowedOrigins = [
      'https://xdose.vercel.app',
      'http://localhost:3000',
      'http://localhost:3003'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

// Enable CORS
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Apply routers with CORS
app.use(healthRouter);
app.use('/api/videos', cors(corsOptions), videosRouter);
app.use('/api/mux', cors(corsOptions), muxRouter);

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));
  
// Handle SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 3003;
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const addr = server.address();
  if (!addr) {
    console.error('Server failed to bind to port');
    process.exit(1);
  }
  console.log(`Server successfully started:`);
  console.log(`- Address: http://${addr.address}:${addr.port}`);
  console.log(`- Health check: http://${addr.address}:${addr.port}/api/health`);
  console.log(`- Video API: http://${addr.address}:${addr.port}/api/videos`);
  console.log(`- Mux API: http://${addr.address}:${addr.port}/api/mux`);
  
  // Verify environment variables
  console.log('\nEnvironment variables:');
  console.log(`- MUX_TOKEN_ID: ${process.env.MUX_TOKEN_ID ? 'set' : 'not set'}`);
  console.log(`- MUX_WEBHOOK_SECRET: ${process.env.MUX_WEBHOOK_SECRET ? 'set' : 'not set'}`);
});
