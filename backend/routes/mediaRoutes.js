import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_RESULTS = 60;

// Helper to load JSON safely in local and Vercel environments
function loadCatalog() {
  const jsonPath = path.join(__dirname, '../data/media_catalog.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(rawData);
}

// GET /api/media/search?query=elden&type=game
// - query: matches the title OR the creator (case-insensitive). Empty = browse everything.
// - type:  all | movie | tv | anime | game | music | book
router.get('/search', (req, res) => {
  const { query = '', type = 'all' } = req.query;

  try {
    let catalog = loadCatalog();

    const q = String(query).trim().toLowerCase();
    if (q) {
      catalog = catalog.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.creator ?? '').toLowerCase().includes(q)
      );
    }

    if (type !== 'all') {
      catalog = catalog.filter((item) => item.media_type === type);
    }

    res.json(catalog.slice(0, MAX_RESULTS));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read media catalog.' });
  }
});

export default router;
