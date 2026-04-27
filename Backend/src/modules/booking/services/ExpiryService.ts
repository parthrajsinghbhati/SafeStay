import { prisma } from '../../../config/database.js';

/**
 * ExpiryService
 * 
 * Periodically checks for PENDING bookings that have been sitting for too long
 * (e.g., 10 minutes) and cancels them, releasing the room lock.
 */
export class ExpiryService {
  private static INTERVAL_MS = 60 * 1000; // Check every minute
  private static EXPIRY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

  static start() {
    console.log('--- Booking Expiry Service Started ---');
    setInterval(() => this.cleanupExpiredBookings(), this.INTERVAL_MS);
  }

  static async cleanupExpiredBookings() {
    try {
      const now = new Date();
      const threshold = new Date(now.getTime() - this.EXPIRY_THRESHOLD_MS);

      // 1. Find all PENDING bookings created before the threshold
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: threshold }
        },
        include: { room: true }
      });

      if (expiredBookings.length === 0) return;

      console.log(`Found ${expiredBookings.length} expired pending bookings. Cleaning up...`);

      for (const booking of expiredBookings) {
        await prisma.$transaction([
          // Mark booking as CANCELLED
          prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'CANCELLED' }
          }),
          // Mark room as AVAILABLE
          prisma.room.update({
            where: { id: booking.roomId },
            data: { status: 'AVAILABLE' }
          })
        ]);
        console.log(`Booking ${booking.id} expired. Room ${booking.roomId} is now AVAILABLE.`);
      }

    } catch (error) {
      console.error('Error during expired bookings cleanup:', error);
    }
  }
}
