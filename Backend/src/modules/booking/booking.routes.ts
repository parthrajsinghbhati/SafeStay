import { Router } from 'express';
import { BookingController } from './booking.controller.js';
import { authenticate } from '../../core/middleware/auth.js';

const router = Router();

// Endpoint: POST /api/bookings
router.post('/', authenticate, BookingController.createBooking);

export default router;
