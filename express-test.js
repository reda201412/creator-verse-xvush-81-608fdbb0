// Minimal Express test using ESM
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Express test working');
});

app.listen(3001, () => {
  console.log('Express test server running on port 3001');
});
