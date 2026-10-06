import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/apiHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  const url = req.url || '';
  if (url.startsWith('/api/')) {
    try {
      const handled = await handleApiRequest(req, res, url);
      if (!handled) {
        res.status(404).json({ error: 'Endpoint not found' });
      }
    } catch (err: any) {
      console.error('Server API error:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
    return;
  }
  next();
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ToliMart Server listening on port ${PORT}`);
});
