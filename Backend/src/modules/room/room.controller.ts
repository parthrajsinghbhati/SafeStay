import type { Request, Response, NextFunction } from 'express';
import { RoomService } from './room.service.js';
import { AppError } from '../../core/errors.js';

export class RoomController {
  static async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomNumber, basePrice } = req.body;
      const room = await RoomService.createRoom({ roomNumber, basePrice });
      res.status(201).json({ status: 'success', data: room });
    } catch (error) {
      next(error);
    }
  }

  static async getAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.status(200).json({ status: 'success', data: rooms });
    } catch (error) {
      next(error);
    }
  }

  static async getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') throw new AppError('Invalid Room ID', 400);

      const room = await RoomService.getRoomById(id);
      res.status(200).json({ status: 'success', data: room });
    } catch (error) {
      next(error);
    }
  }

  static async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') throw new AppError('Invalid Room ID', 400);

      const { expectedVersion, roomNumber, basePrice, status } = req.body;
      
      const payload: any = {};
      if (roomNumber !== undefined) payload.roomNumber = roomNumber;
      if (basePrice !== undefined) payload.basePrice = basePrice;
      if (status !== undefined) payload.status = status;

      const updatedRoom = await RoomService.updateRoomWithOCC(id, expectedVersion, payload);
      res.status(200).json({ status: 'success', data: updatedRoom });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') throw new AppError('Invalid Room ID', 400);

      await RoomService.deleteRoom(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
