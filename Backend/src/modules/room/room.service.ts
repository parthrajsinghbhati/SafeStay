import { prisma } from '../../config/database.js';
// import { RoomStatus } from '@prisma/client';
export const RoomStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
} as const;
type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];
import { AppError } from '../../core/errors.js';

export class RoomService {
  static async createRoom(data: { roomNumber: string; basePrice: number }) {
    return await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        basePrice: data.basePrice,
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  static async getAllRooms() {
    return await prisma.room.findMany();
  }

  static async getRoomById(id: string) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    return room;
  }

  /**
   * Updates room using Optimistic Concurrency Control (OCC)
   */
  static async updateRoomWithOCC(
    id: string,
    expectedVersion: number,
    data: { basePrice?: number; status?: RoomStatus; roomNumber?: string }
  ) {
    const result = await prisma.room.updateMany({
      where: {
        id,
        version: expectedVersion, // Ensure the version matches what the client expects
      },
      data: {
        ...data,
        version: {
          increment: 1, // Increment version upon successful update
        },
      },
    });

    if (result.count === 0) {
      // It means either the room wasn't found or the version didn't match (modified by another user)
      throw new AppError('Conflict: The room has been modified by another user. Please refresh and try again.', 409);
    }

    // Now simply return the updated room by fetching it normally (since updateMany doesn't return the doc)
    return await prisma.room.findUnique({ where: { id } });
  }

  static async deleteRoom(id: string) {
    // Check if room exists first
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new AppError('Room not found', 404);
    }
    await prisma.room.delete({ where: { id } });
    return { success: true, message: 'Room deleted safely' };
  }
}
