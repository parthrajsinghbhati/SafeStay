import 'dotenv/config';
import express from 'express';
import { prisma } from './config/database.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);

// Import and use global error handler
import { ErrorHandler } from './core/errors.js';
app.use(ErrorHandler.handle);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Since top-level await is supported in Node ESM, we can connect lazily or directly without bootstrap()
await prisma.$connect().catch((error) => {
  console.error('❌ Failed to connect to the database:', error);
  process.exit(1);
});

console.log('📦 Connected to PostgreSQL database.');

app.listen(PORT, () => {
  console.log(`🚀 SafeStay REST API is running on http://localhost:${PORT}`);
});
