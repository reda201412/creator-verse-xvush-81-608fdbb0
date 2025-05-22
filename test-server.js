// Minimal Express test server using ESM
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Test server working');
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
});
