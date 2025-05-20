
// Using ESM syntax for consistency
import { createServer } from './src/server/index.js';

// Start the server
const PORT = process.env.PORT || 3000;
createServer().then(app => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
