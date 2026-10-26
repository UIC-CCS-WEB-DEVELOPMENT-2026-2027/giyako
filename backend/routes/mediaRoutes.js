import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load JSON safely in local and Vercel environments
function loadCatalog() {
  const jsonPath = path.join(__dirname, '../data/media_catalog.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(rawData);
}

// GET /api/media/search?query=elden&type=game
router.get('/search', (req, res) => {
  const { query, type = 'all' } = req.query;

  try {
    let catalog = loadCatalog();

    if (query) {
      catalog = catalog.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type !== 'all') {
      catalog = catalog.filter((item) => item.media_type === type);
    }

    res.json(catalog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read media catalog.' });
  }
});

export default router;