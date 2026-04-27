import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { prisma } from './config/database.js';
import authRoutes from './modules/auth/auth.routes.js';
import { initializeSocket } from './core/socket.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initializeSocket(httpServer);


// Middleware to parse incoming JSON bodies
app.use(express.json());

// Main Routes
import propertyRoutes from './modules/property/property.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

import roomRoutes from './modules/room/room.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';

app.use('/api/rooms', roomRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bookings', bookingRoutes);

// Import and use global error handler
import { ErrorHandler } from './core/errors.js';
app.use(ErrorHandler.handle);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database connection
await prisma.$connect().catch((error) => {
  console.error('❌ Failed to connect to the database:', error);
  process.exit(1);
});

console.log('📦 Connected to PostgreSQL database.');

httpServer.listen(PORT, () => {
  console.log(`🚀 SafeStay REST API is running on http://localhost:${PORT}`);
});
