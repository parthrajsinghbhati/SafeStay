import type { Response, NextFunction } from 'express';
import { ProfileService } from './profile.service.js';
import type { AuthRequest } from '../../core/middleware/auth.js';
import { AppError } from '../../core/errors.js';

export class ProfileController {
  /**
   * Get the logged-in user's profile
   */
  static async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Unauthorized access', 401);
      
      const profile = await ProfileService.getProfileByUserId(userId);
      res.status(200).json({ status: 'success', data: profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the logged-in user's profile fields
   */
  static async updateMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Unauthorized access', 401);

      const { firstName, lastName, phone } = req.body;
      const updatedProfile = await ProfileService.updateProfile(userId, { firstName, lastName, phone });
      
      res.status(200).json({ status: 'success', data: updatedProfile });
    } catch (error) {
      next(error);
    }
  }
}
