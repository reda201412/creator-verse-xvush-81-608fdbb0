
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to create and configure Express server with Vite middleware
export async function createServer() {
  const app = express();
  
  // Enable CORS
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://xdose.vercel.app'  // Production domain
      : 'http://localhost:3000',    // Development domain
    credentials: true,
  }));

  // Parse JSON bodies
  app.use(express.json());
  
  // Create Vite server in development mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // API routes
  app.use('/api/videos', (await import('./routes/videos')).default);
  app.use('/api/mux', (await import('./routes/mux')).default);
  
  // Serve the app - all other routes go to the SPA
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Always read fresh template in development
      let template = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Creator Verse</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `;

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  return app;
}
