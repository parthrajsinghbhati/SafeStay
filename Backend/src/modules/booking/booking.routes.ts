import { Router } from 'express';
import { BookingController } from './booking.controller.js';
import { authenticate } from '../../core/middleware/auth.js';

const router = Router();

// Endpoint: POST /api/bookings/initiate
router.post('/initiate', authenticate, BookingController.initiateBooking);
// Endpoint: PATCH /api/bookings/:id/confirm
router.patch('/:id/confirm', authenticate, BookingController.confirmBooking);
router.get('/', authenticate, BookingController.getBookings);

export default router;
