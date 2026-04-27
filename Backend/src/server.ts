import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { prisma } from './config/database.js';
import authRoutes from './modules/auth/auth.routes.js';
import { initializeSocket } from './core/socket.js';
import { ExpiryService } from './modules/booking/services/ExpiryService.js';

ExpiryService.start();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initializeSocket(httpServer);

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Main Routes
import propertyRoutes from './modules/property/property.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

import roomRoutes from './modules/room/room.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import bookingRoutes from './modules/booking/booking.routes.js';
import maintenanceRoutes from './modules/maintenance/maintenance.routes.js';

app.use('/api/rooms', roomRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);

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

const server = httpServer.listen(PORT, () => {
  console.log(`🚀 SafeStay REST API is running on http://localhost:${PORT}`);
});

// Graceful shutdown to fix EADDRINUSE during dev restarts
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGUSR2', shutdown);
