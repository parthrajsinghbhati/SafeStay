import { prisma } from '../../../config/database.js';
// import { RoomStatus, BookingStatus } from '@prisma/client';
export const RoomStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
} as const;
type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export const BookingStatus = {
  PENDING: 'PENDING',
  LOCKED: 'LOCKED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;
type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

/**
 * BookingService Class
 *
 * Handles database operations for bookings.
 *
 * SOLID Principle: Single Responsibility Principle (SRP) - This class is solely
 * responsible for managing the booking persistence and database transactions.
 */
export class BookingService {
  /**
   * Books a room atomically using Prisma $transaction and Optimistic Concurrency Control (OCC).
   *
   * @param roomId - The ID of the room to book.
   * @param expectedVersion - The version of the room the client expects to book (OCC).
   * @param userId - The ID of the user booking the room.
   * @param calculatedPrice - The total price calculated from the Decorator pricing engine.
   * @returns The created booking.
   * @throws Error if double-booking is detected or transaction fails.
   */
  async bookRoom(
    roomId: string,
    expectedVersion: number,
    userId: string,
    calculatedPrice: number
  ) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Step 1: Attempt to lock and update the room utilizing the version for OCC
        // If someone else already booked it, the version would have incremented, and this will update 0 records
        const updatedRoom = await tx.room.updateMany({
          where: {
            id: roomId,
            version: expectedVersion,
            status: RoomStatus.AVAILABLE,
          },
          data: {
            status: RoomStatus.BOOKED,
            version: {
              increment: 1, // Increment the version to protect against double booking
            },
          },
        });

        // Step 2: Ensure that exactly 1 room was updated. Otherwise, throw an error to trigger rollback.
        if (updatedRoom.count === 0) {
          throw new Error('Double Booking Detected: The room is no longer available or was updated by another process.');
        }

        // Step 3: Create the Booking record Atomic with the Room update
        const booking = await tx.booking.create({
          data: {
            roomId,
            userId,
            totalPrice: calculatedPrice,
            status: BookingStatus.PENDING, // Using PENDING as initial state matching our State Pattern initial step
          },
        });

        return booking;
      });

      console.log('Successfully booked room.');
      return result;
    } catch (error: any) {
      console.error(`Booking Failed: ${error.message}`);
      throw error;
    }
  }
}
