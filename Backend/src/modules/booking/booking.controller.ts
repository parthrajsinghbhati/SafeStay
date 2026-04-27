import { prisma } from '../../config/database.js';
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../core/middleware/auth.js';
import { BookingService } from './services/BookingService.js';
import { AppError } from '../../core/errors.js';
import { PricingEngine } from './services/PricingEngine.js';
import { BookingContext } from './flow/BookingContext.js';
import { PendingState } from './flow/States.js';
const bookingService = new BookingService();

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);

      const { roomId, expectedVersion, extras } = req.body;
      
      // 1. Fetch Room Base Data to initialize Pricing
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        throw new AppError('Room not found', 404);
      }

      const { totalPrice: calculatedPrice, description: addonsDescription } = PricingEngine.calculate(
        room.basePrice,
        room.roomNumber,
        Array.isArray(extras) ? extras : []
      );

      // 3. Initiate Transaction with OCC check via BookingService
      // Using expectedVersion from frontend prevents double booking
      const newBooking = await bookingService.bookRoom(
        roomId, 
        typeof expectedVersion === 'number' ? expectedVersion : room.version, 
        userId, 
        calculatedPrice
      );

      // 4. Initialize Flow State pattern
      // Our booking starts PENDING, but since payment/locking occurs, we will transition it.
      const bookingContext = new BookingContext(new PendingState());
      
      // Transition from PENDING -> LOCKED (or whatever next state is defined)
      bookingContext.nextState();
      
      // Normally, here you'd update your DB's BookingStatus to MATCH the Context's new status.
      // E.g., await prisma.booking.update({ where: { id: newBooking.id }, data: { status: bookingContext.status() } });

      res.status(201).json({
        status: 'success',
        message: `Successfully booked room with addons: ${addonsDescription}`,
        data: {
          booking: newBooking,
          flowState: bookingContext.status()
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  static async getBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);

      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: { room: true },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({
        success: true,
        data: { bookings }
      });
    } catch (error) {
      next(error);
    }
  }
}
