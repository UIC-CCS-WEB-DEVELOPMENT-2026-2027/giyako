import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './routes/mediaRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api/media', mediaRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Only open a port when running locally (not in production/Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local dev server on http://localhost:${PORT}`));
}

// Export app for Vercel Serverless Functions
export default app;