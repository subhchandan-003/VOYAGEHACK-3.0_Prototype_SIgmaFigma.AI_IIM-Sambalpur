/**
 * TBO TravelAgent™ – Express Server
 * ===================================
 * MERN Backend: MongoDB + Express + React + Node.js
 *
 * Start:
 *   npx ts-node server/server.ts
 *   – or –
 *   npx tsx server/server.ts
 *
 * Environment Variables (.env):
 *   PORT=5000
 *   MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tbo_travel
 *   NODE_ENV=development
 *   CORS_ORIGIN=http://localhost:5173
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';

// Route imports
import destinationRoutes from './routes/destinations';
import packageRoutes from './routes/packages';
import tripRoutes from './routes/trips';
import quoteRoutes from './routes/quotes';
import searchRoutes from './routes/searches';
import visionRoutes from './routes/vision';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ── API Routes ─────────────────────────────────────────────
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/vision', visionRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'TBO TravelAgent API' });
});

// ── Serve React in Production ──────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ── Global Error Handler ───────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// ── Start ──────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 TBO TravelAgent API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/tbo_travel'}\n`);
  });
};

start();

export default app;
