import type { Response, NextFunction } from 'express';
import { AppError } from '../../core/errors.js';
import type { AuthRequest } from '../../core/middleware/auth.js';
import { PropertyService } from './property.service.js';

const getAuthUserId = (req: AuthRequest): string | undefined => req.user?.id ?? req.user?.userId;

export class PropertyController {
  static async getPublicProperties(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const properties = await PropertyService.getPublicProperties();
      res.json({ success: true, message: 'Properties fetched', data: { properties } });
    } catch (error) {
      next(error);
    }
  }

  static async getOwnerProperties(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = getAuthUserId(req);
      if (!ownerId) throw new AppError('Unauthorized', 401);

      const properties = await PropertyService.getOwnerProperties(ownerId);
      res.json({ success: true, message: 'Properties fetched', data: { properties } });
    } catch (error) {
      next(error);
    }
  }

  static async getOwnerPropertyById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = getAuthUserId(req);
      if (!ownerId) throw new AppError('Unauthorized', 401);
      const propertyId = req.params.id;
      if (!propertyId || typeof propertyId !== 'string') throw new AppError('Property ID is required', 400);

      const property = await PropertyService.getOwnerPropertyById(ownerId, propertyId);
      res.json({ success: true, message: 'Property fetched', data: { property } });
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = getAuthUserId(req);
      if (!ownerId) throw new AppError('Unauthorized', 401);

      const property = await PropertyService.createProperty(ownerId, req.body);
      res.status(201).json({ success: true, message: 'Property created', data: { property } });
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = getAuthUserId(req);
      if (!ownerId) throw new AppError('Unauthorized', 401);
      const propertyId = req.params.id;
      if (!propertyId || typeof propertyId !== 'string') throw new AppError('Property ID is required', 400);

      const property = await PropertyService.updateProperty(ownerId, propertyId, req.body);
      res.json({ success: true, message: 'Property updated', data: { property } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = getAuthUserId(req);
      if (!ownerId) throw new AppError('Unauthorized', 401);
      const propertyId = req.params.id;
      if (!propertyId || typeof propertyId !== 'string') throw new AppError('Property ID is required', 400);

      await PropertyService.deleteProperty(ownerId, propertyId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
