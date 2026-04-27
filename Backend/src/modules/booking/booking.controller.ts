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
  static async initiateBooking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);

      const { roomId, expectedVersion, extras } = req.body;
      
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) throw new AppError('Room not found', 404);

      const { totalPrice: calculatedPrice } = PricingEngine.calculate(
        room.basePrice,
        room.roomNumber,
        Array.isArray(extras) ? extras : []
      );

      const newBooking = await bookingService.bookRoom(
        roomId, 
        typeof expectedVersion === 'number' ? expectedVersion : room.version, 
        userId, 
        calculatedPrice
      );

      res.status(201).json({
        success: true,
        data: { booking: newBooking }
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmBooking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (typeof id !== 'string') throw new AppError('Invalid ID', 400);

      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) throw new AppError('Booking not found', 404);

      // Advance State Pattern: PENDING -> LOCKED -> CONFIRMED
      const bookingContext = new BookingContext(new PendingState());
      bookingContext.nextState(); // LOCKED
      bookingContext.nextState(); // CONFIRMED
      
      const finalStatus = bookingContext.status() as any;
      const updatedBooking = await prisma.booking.update({
        where: { id: id as string },
        data: { status: finalStatus }
      });

      res.status(200).json({
        success: true,
        data: { booking: updatedBooking, flowState: finalStatus }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBookings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id ?? req.user?.userId;
      const role = req.user?.role;
      if (!userId) throw new AppError('Unauthorized', 401);

      const whereClause: any = role === 'OWNER' 
        ? { room: { ownerId: userId } }
        : { userId };

      // Requirement: "remove from booking pages" if cancelled
      whereClause.status = { not: 'CANCELLED' };

      const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: { 
          room: true,
          user: {
            select: {
              email: true,
              profile: true
            }
          }
        },
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
